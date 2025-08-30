"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Base64Page() {
  const [mode, setMode] = useState("encode"); // "encode" or "decode"
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("decoded-file");
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);

  // Utility: encode Unicode-safe
  function base64EncodeUnicode(str) {
    // encodeURIComponent produces %XX escapes for UTF-8 bytes
    // we convert those to raw bytes for btoa
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (m, p1) {
        return String.fromCharCode("0x" + p1);
      })
    );
  }

  function base64DecodeUnicode(b64) {
    // atob -> raw bytes -> percent-encoded -> decodeURIComponent
    try {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(b64), function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    } catch (err) {
      // invalid base64 or binary data
      throw err;
    }
  }

  // Handle text encode/decode
  const handleConvert = async () => {
    setBusy(true);
    try {
      if (mode === "encode") {
        if (file) {
          // file -> dataURL (includes mime + base64)
          const reader = new FileReader();
          reader.onload = () => {
            setOutput(reader.result); // data:<mime>;base64,....
            setBusy(false);
          };
          reader.onerror = () => {
            alert("Failed to read file.");
            setBusy(false);
          };
          reader.readAsDataURL(file);
        } else {
          // text -> base64 (unicode-safe)
          setOutput(base64EncodeUnicode(input || ""));
          setBusy(false);
        }
      } else {
        // decode
        const val = input.trim();
        if (!val) {
          alert("Provide base64 text or data URL to decode.");
          setBusy(false);
          return;
        }

        // if is data URL
        if (val.startsWith("data:")) {
          // create blob and set up download url
          const match = val.match(/^data:([^;]+);base64,(.*)$/s);
          if (!match) {
            alert("Invalid data URL.");
            setBusy(false);
            return;
          }
          const mime = match[1];
          const b64 = match[2];
          const byteChars = atob(b64);
          const byteNumbers = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNumbers[i] = byteChars.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mime });
          const url = URL.createObjectURL(blob);
          setOutput(url); // output is a blob URL for download/preview
          setFileName((n) => (n ? n : "decoded-file"));
          setBusy(false);
        } else {
          // raw base64 - try decode as text first (Unicode)
          try {
            const decoded = base64DecodeUnicode(val);
            setOutput(decoded);
          } catch (err) {
            // binary base64 - create blob with application/octet-stream
            try {
              const byteChars = atob(val);
              const byteNumbers = new Array(byteChars.length);
              for (let i = 0; i < byteChars.length; i++) {
                byteNumbers[i] = byteChars.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], {
                type: "application/octet-stream",
              });
              const url = URL.createObjectURL(blob);
              setOutput(url);
            } catch (err2) {
              alert(
                "Failed to decode base64. Ensure it's valid base64 or a data URL."
              );
            }
          } finally {
            setBusy(false);
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert("Conversion error. Check console for details.");
      setBusy(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setInput(""); // clear text input when file chosen
      setOutput("");
      setFileName(f.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleCopyOutput = async () => {
    if (!output) return;
    try {
      // If output is a blob URL, read blob and put base64/text into clipboard is complex.
      // We'll copy blob URL if that's what we have.
      await navigator.clipboard.writeText(output);
      alert("Output copied to clipboard!");
    } catch (err) {
      alert("Copy failed — your browser may restrict clipboard access.");
    }
  };

  const handleDownloadDecoded = () => {
    if (!output) {
      alert("Nothing to download.");
      return;
    }
    // If output looks like an object URL (startsWith blob:)
    if (output.startsWith("blob:") || output.startsWith("http")) {
      const a = document.createElement("a");
      a.href = output;
      a.download = fileName || "decoded-file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // revoke object URL after a short delay
      setTimeout(() => {
        try {
          URL.revokeObjectURL(output);
        } catch (e) {}
      }, 1000);
      return;
    }

    // If output is text, create a text file for download
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || "decoded"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const resetAll = () => {
    setMode("encode");
    setInput("");
    setOutput("");
    setFile(null);
    setFileName("decoded-file");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Base64 Encoder / Decoder
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mode toggle */}
          <div className="flex items-center justify-center gap-3">
            <button
              className={`px-4 py-2 rounded-md ${
                mode === "encode" ? "bg-primary text-white" : "bg-muted"
              }`}
              onClick={() => setMode("encode")}
            >
              Encode
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                mode === "decode" ? "bg-primary text-white" : "bg-muted"
              }`}
              onClick={() => setMode("decode")}
            >
              Decode
            </button>
          </div>

          {/* File input (only relevant for encode) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Text input</Label>
              <Textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                placeholder={
                  mode === "encode"
                    ? "Type text to encode (UTF-8 safe)..."
                    : "Paste base64 or data URL to decode..."
                }
                className="min-h-[160px] resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label>File (encode only)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="*/*"
                onChange={handleFileChange}
                className="block w-full"
              />
              {file && (
                <div className="p-3 rounded-md bg-muted text-sm">
                  <div>
                    <strong>Selected:</strong> {file.name}
                  </div>
                  <div>
                    <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
                  </div>
                  <div className="text-xs text-muted-foreground">
                    When encoding a file, output will be a data URL
                    (data:&lt;mime&gt;;base64,...)
                  </div>
                </div>
              )}
              <div className="mt-2">
                <Label>Filename for decoded download</Label>
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleConvert}
              disabled={busy || (mode === "encode" && !input && !file)}
            >
              {busy ? "Working..." : mode === "encode" ? "Encode" : "Decode"}
            </Button>

            <Button
              variant="outline"
              onClick={handleCopyOutput}
              disabled={!output}
            >
              Copy Output
            </Button>

            <Button
              variant="secondary"
              onClick={handleDownloadDecoded}
              disabled={!output}
            >
              Download Result
            </Button>

            <Button variant="destructive" onClick={resetAll}>
              Reset
            </Button>
          </div>

          {/* Output */}
          <div>
            <Label>Output</Label>

            {output ? (
              // If output is a blob/object URL show preview + link
              output.startsWith("blob:") || output.startsWith("http") ? (
                <div className="p-4 rounded-md bg-card">
                  <div className="mb-2 text-sm">
                    Decoded binary produced a downloadable file.
                  </div>
                  <a
                    href={output}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Open in new tab
                  </a>
                  <div className="mt-3">
                    <Button onClick={handleDownloadDecoded}>Download</Button>
                  </div>
                </div>
              ) : (
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[160px] resize-none"
                />
              )
            ) : (
              <div className="p-4 rounded-md bg-muted text-sm text-muted-foreground">
                No output yet — encode or decode something to see results.
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Notes: Encoding text produces raw base64. Encoding a file returns a
            data URL (data:&lt;mime&gt;;base64,...). Decoding will try to detect
            a data URL first, then raw base64; text results are shown as text,
            binary results become a downloadable file.
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
