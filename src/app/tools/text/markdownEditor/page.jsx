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
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const filenameRef = useRef("note");

  // Load marked + DOMPurify
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
        setUseSanitizer(true);
      } catch {
        setHtml(simpleMarkdownToHtml(md));
        setUseSanitizer(false);
      }
    }
    loadAndRender();
    return () => (cancelled = true);
  }, [md]);

  // Simple fallback parser
  function simpleMarkdownToHtml(input) {
    if (!input) return "";
    return input
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n$/gim, "<br />");
  }

  function escapeHtml(s) {
    return s.replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[m])
    );
  }

  // Helpers
  function wrapSelection(prefix, suffix = prefix) {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newText =
      md.slice(0, start) +
      prefix +
      md.slice(start, end) +
      suffix +
      md.slice(end);
    setMd(newText);
  }

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
      alert("HTML copied!");
    } catch {
      alert("Copy failed.");
    }
  }

  function copyMarkdown() {
    navigator.clipboard.writeText(md).then(() => alert("Markdown copied!"));
  }

  // Sync scroll
  const syncScroll = (e) => {
    if (!previewRef.current || !editorRef.current) return;
    const ratio =
      e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight || 1);
    previewRef.current.scrollTop =
      ratio *
      (previewRef.current.scrollHeight - previewRef.current.clientHeight);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Markdown Editor ✍️
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Input
                placeholder="filename (without extension)"
                value={filenameRef.current}
                onChange={(e) => (filenameRef.current = e.target.value)}
                className="w-full md:max-w-xs"
              />
              <Button onClick={() => setSplit((s) => !s)} variant="ghost">
                <Eye className="mr-2 h-4 w-4" />
                {split ? "Toggle Single" : "Split View"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Button onClick={copyMarkdown} variant="outline">
                <Copy className="mr-2 h-4 w-4" /> Copy MD
              </Button>
              <Button onClick={copyPreviewHtml} variant="outline">
                Copy HTML
              </Button>
              <Button onClick={handleDownloadMd}>
                <Download className="mr-2 h-4 w-4" /> .md
              </Button>
              <Button onClick={handleDownloadHtml} variant="secondary">
                .html
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 w-full">
            <Button onClick={() => wrapSelection("**")}>Bold</Button>
            <Button onClick={() => wrapSelection("*")}>Italic</Button>
            <Button onClick={() => wrapSelection("`")}>Code</Button>
            <Button onClick={() => wrapSelection("```\n", "\n```")}>
              Code Block
            </Button>
            <Button onClick={() => wrapSelection("> ")}>Quote</Button>
            <Button onClick={() => wrapSelection("- ")}>UL</Button>
            <Button onClick={() => wrapSelection("# ")}>H1</Button>
            <Button onClick={() => setMd("")} variant="destructive">
              Clear
            </Button>
          </div>

          {/* Editor + Preview */}
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
                className="min-h-[360px] font-mono resize-y"
              />
            </div>
            {split && (
              <div className="flex flex-col">
                <Label>Preview {useSanitizer ? "" : "(limited)"}</Label>
                <div
                  ref={previewRef}
                  className="min-h-[360px] p-4 bg-card rounded-md overflow-auto prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
