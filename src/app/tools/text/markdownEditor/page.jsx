"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Download, Eye } from "lucide-react";

export default function MarkdownEditor() {
  const [md, setMd] = useState(
    `# Welcome\n\nStart typing **Markdown** on the left.\n`
  );
  const [html, setHtml] = useState("");
  const [split, setSplit] = useState(true);
  const [useSanitizer, setUseSanitizer] = useState(true);
  const [previewReady, setPreviewReady] = useState(false);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const filenameRef = useRef("note");

  // Try to dynamically import marked + DOMPurify for robust rendering
  useEffect(() => {
    let cancelled = false;
    async function loadAndRender() {
      try {
        const markedModule = await import("marked").then((m) => m.default ?? m);
        const DOMPurify = await import("dompurify").then((m) => m.default ?? m);
        if (cancelled) return;
        const rendered = markedModule.parse(md || "");
        const clean = DOMPurify.sanitize(rendered);
        setHtml(clean);
        setPreviewReady(true);
      } catch (err) {
        // If imports fail (packages not installed), use a simple fallback converter
        const fallback = simpleMarkdownToHtml(md);
        setHtml(fallback);
        setPreviewReady(true);
        setUseSanitizer(false);
      }
    }
    loadAndRender();
    return () => {
      cancelled = true;
    };
  }, [md]);

  // Very small fallback markdown -> HTML (handles headings, bold, italic, code blocks, lists, links)
  function simpleMarkdownToHtml(input) {
    if (!input) return "";
    let out = input
      // code blocks
      .replace(
        /```([\s\S]*?)```/g,
        (m, p1) => `<pre><code>${escapeHtml(p1)}</code></pre>`
      )
      // inline code
      .replace(/`([^`]+)`/g, (m, p1) => `<code>${escapeHtml(p1)}</code>`)
      // headings
      .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
      .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
      .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // bold & italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // blockquote
      .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
      // unordered list
      .replace(/^\s*[-\*\+] (.*)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>")
      // links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
      )
      // paragraphs
      .replace(/^\s*([\s\S]+?)\s*$/gm, (m, p1) => {
        // If block-level already present, keep it
        if (/^(<h|<ul|<ol|<pre|<blockquote|<img|<p|<div)/.test(p1.trim()))
          return p1;
        return `<p>${p1.trim()}</p>`;
      });

    return out;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m];
    });
  }

  // Toolbar helpers
  function wrapSelection(prefix, suffix = prefix) {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = md.slice(0, start);
    const selection = md.slice(start, end);
    const after = md.slice(end);
    const newText = before + prefix + selection + suffix + after;
    setMd(newText);

    // restore selection (place cursor inside wrapped text)
    const cursor = start + prefix.length + selection.length + suffix.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  }

  function insertAtCursor(textToInsert) {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = md.slice(0, start);
    const after = md.slice(end);
    const newText = before + textToInsert + after;
    setMd(newText);

    const pos = start + textToInsert.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  // Downloads
  function downloadFile(content, name, mime = "text/markdown") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function handleDownloadMd() {
    downloadFile(md, `${filenameRef.current || "note"}.md`, "text/markdown");
  }
  function handleDownloadHtml() {
    const fullHtml = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(
      filenameRef.current || "note"
    )}</title></head><body>${html}</body></html>`;
    downloadFile(
      fullHtml,
      `${filenameRef.current || "note"}.html`,
      "text/html"
    );
  }

  async function copyPreviewHtml() {
    try {
      await navigator.clipboard.writeText(html);
      alert("HTML copied to clipboard!");
    } catch {
      alert("Copy failed — maybe your browser blocked clipboard access.");
    }
  }

  function copyMarkdown() {
    navigator.clipboard
      .writeText(md)
      .then(() => alert("Markdown copied to clipboard!"))
      .catch(() => alert("Copy failed."));
  }

  // Simple toggle insert helpers
  function addLink() {
    const url = prompt("Enter URL", "https://");
    if (!url) return;
    const text = prompt("Link text", "link");
    insertAtCursor(`[${text || "link"}](${url})`);
  }

  function addImage() {
    const url = prompt("Image URL");
    if (!url) return;
    insertAtCursor(`![alt text](${url})`);
  }

  // Sync scroll: when preview shown, keep ratio approx same
  const syncScroll = (e) => {
    if (!previewRef.current || !editorRef.current) return;
    const ratio =
      e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight || 1);
    previewRef.current.scrollTop =
      ratio *
      (previewRef.current.scrollHeight - previewRef.current.clientHeight);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Markdown Editor ✍️
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* meta row */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Input
                placeholder="filename (without extension)"
                defaultValue={filenameRef.current}
                onChange={(e) => (filenameRef.current = e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={() => setSplit((s) => !s)} variant="ghost">
                <Eye className="mr-2 h-4 w-4" />{" "}
                {split ? "Toggle Single" : "Split View"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyMarkdown} variant="outline">
                <Copy className="mr-2 h-4 w-4" /> Copy MD
              </Button>
              <Button onClick={copyPreviewHtml} variant="outline">
                Copy HTML
              </Button>
              <Button onClick={handleDownloadMd}>
                <Download className="mr-2 h-4 w-4" /> Download .md
              </Button>
              <Button onClick={handleDownloadHtml} variant="secondary">
                Download .html
              </Button>
            </div>
          </div>

          {/* toolbar */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => wrapSelection("**")}>Bold</Button>
            <Button onClick={() => wrapSelection("*")}>Italic</Button>
            <Button onClick={() => wrapSelection("`")}>Inline Code</Button>
            <Button onClick={() => wrapSelection("```\n", "\n```")}>
              Code Block
            </Button>
            <Button onClick={() => wrapSelection("> ")}>Quote</Button>
            <Button onClick={() => wrapSelection("- ")}>UL</Button>
            <Button onClick={() => wrapSelection("1. ")}>OL</Button>
            <Button onClick={() => wrapSelection("# ")}>H1</Button>
            <Button onClick={() => wrapSelection("## ")}>H2</Button>
            <Button onClick={addLink}>Link</Button>
            <Button onClick={addImage}>Image</Button>
            <Button onClick={() => setMd("")} variant="destructive">
              Clear
            </Button>
          </div>

          {/* editor + preview */}
          <div
            className={`grid ${
              split ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            } gap-4`}
          >
            <div className="flex flex-col">
              <Label>Markdown</Label>
              <Textarea
                ref={editorRef}
                value={md}
                onChange={(e) => setMd(e.target.value)}
                onScroll={syncScroll}
                className="min-h-[360px] font-mono"
              />
            </div>

            <div className="flex flex-col">
              <Label>
                Preview {useSanitizer ? "" : "(limited rendering)"}{" "}
              </Label>
              <div
                ref={previewRef}
                onScroll={() => {}}
                className="min-h-[360px] p-4 bg-card rounded-md overflow-auto prose max-w-none"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Tip: For best rendering install <code>marked</code> and{" "}
            <code>dompurify</code>:
            <code className="ml-2">npm i marked dompurify</code>. The editor
            will auto-use them if present.
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
