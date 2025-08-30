"use client";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);

  const [resizedUrl, setResizedUrl] = useState(null);
  const canvasRef = useRef(null);

  // Handle file upload
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    const reader = new FileReader();
    reader.onload = (ev) => setSrc(ev.target.result);
    reader.readAsDataURL(f);
  };

  // When image loads, store original size
  const handleImageLoad = (e) => {
    const w = e.target.naturalWidth;
    const h = e.target.naturalHeight;
    setOrigW(w);
    setOrigH(h);
    if (!width) setWidth(w);
    if (!height) setHeight(h);
  };

  // Maintain aspect ratio (only adjust opposite dimension)
  const handleWidthChange = (val) => {
    setWidth(val);
    if (keepAspect && origW && origH && val) {
      const newH = Math.round((origH / origW) * Number(val));
      setHeight(newH);
    }
  };
  const handleHeightChange = (val) => {
    setHeight(val);
    if (keepAspect && origW && origH && val) {
      const newW = Math.round((origW / origH) * Number(val));
      setWidth(newW);
    }
  };

  // Resize image using canvas
  const handleResize = async () => {
    if (!src || !width || !height) return;
    const w = Math.max(1, Math.round(Number(width)));
    const h = Math.max(1, Math.round(Number(height)));

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    const canvas = canvasRef.current || document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        const url = URL.createObjectURL(blob);
        setResizedUrl(url);
      },
      format,
      format === "image/png" ? 1 : quality
    );
  };

  // Download resized image
  const handleDownload = () => {
    if (!resizedUrl) return;
    const a = document.createElement("a");
    a.href = resizedUrl;
    const ext =
      format === "image/png" ? "png" : format === "image/webp" ? "webp" : "jpg";
    const name = (file?.name || "resized-image").replace(/\.[^/.]+$/, "");
    a.download = `${name}-resized.${ext}`;
    a.click();
  };

  // Reset everything
  const handleReset = () => {
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setFile(null);
    setSrc(null);
    setOrigW(0);
    setOrigH(0);
    setWidth("");
    setHeight("");
    setResizedUrl(null);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <Card className="rounded-2xl shadow-lg border">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Image Resizer ✂️</h1>

          {/* Upload */}
          <div>
            <label className="font-medium">Upload Image</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-muted-foreground">
              Works offline — JPG, PNG, WebP supported.
            </p>
          </div>

          {src && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preview */}
              <div>
                <img
                  src={src}
                  alt="preview"
                  onLoad={handleImageLoad}
                  className="max-w-full rounded border"
                />
                <p className="text-sm mt-2 text-muted-foreground">
                  Original: {origW}px × {origH}px
                </p>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium">Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="font-medium">Height</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={keepAspect}
                    onChange={(e) => setKeepAspect(e.target.checked)}
                  />
                  <span>Maintain aspect ratio</span>
                </div>

                <div>
                  <label className="font-medium">Output Format</label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/png">PNG</SelectItem>
                      <SelectItem value="image/jpeg">JPG</SelectItem>
                      <SelectItem value="image/webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(format === "image/jpeg" || format === "image/webp") && (
                  <div>
                    <label className="font-medium">
                      Quality ({Math.round(quality * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={handleResize}>Resize</Button>
                  {resizedUrl && (
                    <Button variant="secondary" onClick={handleDownload}>
                      Download
                    </Button>
                  )}
                  <Button variant="destructive" onClick={handleReset}>
                    Reset
                  </Button>
                </div>

                {resizedUrl && (
                  <div>
                    <p className="font-medium mb-2">Resized Preview</p>
                    <img
                      src={resizedUrl}
                      alt="resized"
                      className="max-w-full rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CardContent>
      </Card>
    </section>
  );
}
