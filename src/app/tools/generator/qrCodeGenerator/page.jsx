"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Copy, Download } from "lucide-react";

export default function QRGeneratorPage() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300); // px
  const [level, setLevel] = useState("M");
  const [src, setSrc] = useState(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef(null);

  // Generate using `qrcode` package dynamically (runs only in browser)
  const generateQRCode = async () => {
    if (!text) {
      alert("Please enter text or URL to generate a QR code.");
      return;
    }
    setBusy(true);
    try {
      const QR = await import("qrcode").then((m) => m.default ?? m);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      await QR.toCanvas(canvas, text, {
        width: size,
        margin: 1,
        errorCorrectionLevel: level,
      });

      const dataUrl = canvas.toDataURL("image/png");
      setSrc(dataUrl);
      canvasRef.current = canvas;
    } catch (err) {
      console.error("QR generation failed:", err);
      alert("Failed to generate QR code. Check console for details.");
    } finally {
      setBusy(false);
    }
  };

  const downloadPNG = () => {
    if (!canvasRef.current && !src) {
      alert("No QR code to download. Generate first.");
      return;
    }
    const url = src;
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const copyText = async () => {
    if (!text) {
      alert("Nothing to copy — enter text first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      alert("Text copied to clipboard!");
    } catch {
      alert("Copy failed — your browser may restrict clipboard access.");
    }
  };

  const clearAll = () => {
    setText("");
    setSrc(null);
    canvasRef.current = null;
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            QR Code Generator 🔳
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Text or URL</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com or any text"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="text-xs">Size: {size}px</Label>
                  <Slider
                    value={[size]}
                    min={100}
                    max={1024}
                    step={10}
                    onValueChange={(val) => setSize(val[0])}
                  />
                </div>

                <div className="w-40">
                  <Label className="text-xs">Error Correction</Label>
                  <Select onValueChange={(v) => setLevel(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={level} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">L — Low (7%)</SelectItem>
                      <SelectItem value="M">M — Medium (15%)</SelectItem>
                      <SelectItem value="Q">Q — Quartile (25%)</SelectItem>
                      <SelectItem value="H">H — High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={generateQRCode} disabled={busy || !text}>
              {busy ? "Generating..." : "Generate QR"}
            </Button>
            <Button onClick={copyText} variant="outline" disabled={!text}>
              <Copy className="mr-2 h-4 w-4" /> Copy Text
            </Button>
            <Button onClick={downloadPNG} variant="ghost" disabled={!src}>
              <Download className="mr-2 h-4 w-4" /> Download PNG
            </Button>
            <Button
              onClick={clearAll}
              variant="destructive"
              disabled={!text && !src}
            >
              Clear
            </Button>
          </div>

          {/* Preview */}
          <div className="flex justify-center mt-4">
            {src ? (
              <div className="border rounded-md p-4 bg-card inline-block">
                <img
                  src={src}
                  alt="QR preview"
                  width={size}
                  height={size}
                  className="block"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Right-click → Save image as... or use Download
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No QR generated yet — enter text and hit Generate.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
