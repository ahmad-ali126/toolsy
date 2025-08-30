"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
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
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSrc(ev.target.result);
    };
    reader.readAsDataURL(f);
  };

  const handleImageLoad = (e) => {
    const w = e.target.naturalWidth;
    const h = e.target.naturalHeight;
    setOrigW(w);
    setOrigH(h);
    if (!width) setWidth(w);
    if (!height) setHeight(h);
  };

  useEffect(() => {
    if (!keepAspect || !origW || !origH) return;
    if (width && !isNaN(width)) {
      const w = parseFloat(width);
      const newH = Math.round((origH / origW) * w);
      setHeight(newH);
    }
  }, [width, keepAspect, origW, origH]);

  useEffect(() => {
    if (!keepAspect || !origW || !origH) return;
    if (height && !isNaN(height)) {
      const h = parseFloat(height);
      const newW = Math.round((origW / origH) * h);
      setWidth(newW);
    }
  }, [height, keepAspect, origW, origH]);

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

    const outFormat = format;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        setResizedUrl(url);
      },
      outFormat,
      outFormat === "image/png" ? 1 : Number(quality)
    );
  };

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

  const handleReset = () => {
    setFile(null);
    setSrc(null);
    setOrigW(0);
    setOrigH(0);
    setWidth("");
    setHeight("");
    setResizedUrl(null);
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">Image Resizer</h1>

      <Card className="card-hover max-w-3xl mx-auto">
        <CardContent className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium">Upload Image</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-muted-foreground">
              Supported: JPG, PNG, WebP. Image is processed in your browser — no
              upload to a server.
            </p>
          </div>

          {src && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <div className="mb-2 font-medium">Preview</div>
                <div className="border rounded p-2 bg-card">
                  <img
                    ref={imgRef}
                    src={src}
                    alt="preview"
                    onLoad={handleImageLoad}
                    className="max-w-full h-auto mx-auto"
                  />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Original: {origW}px × {origH}px
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-medium">Width (px)</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="font-medium">Height (px)</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="font-medium">Maintain aspect ratio</label>
                  {typeof Toggle !== "undefined" ? (
                    <Toggle
                      pressed={keepAspect}
                      onPressedChange={(val) => setKeepAspect(Boolean(val))}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={keepAspect}
                      onChange={(e) => setKeepAspect(e.target.checked)}
                      className="w-4 h-4"
                    />
                  )}
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

                <div className="flex flex-wrap gap-3 mt-2">
                  <Button
                    onClick={handleResize}
                    className="bg-primary text-white"
                  >
                    Resize
                  </Button>
                  {resizedUrl && (
                    <Button
                      onClick={handleDownload}
                      className="bg-accent text-white"
                    >
                      Download
                    </Button>
                  )}
                  <Button
                    onClick={handleReset}
                    className="bg-destructive text-white"
                  >
                    Reset
                  </Button>
                </div>

                {resizedUrl && (
                  <div className="mt-3">
                    <div className="font-medium mb-1">Resized Preview</div>
                    <div className="border rounded p-2 bg-card">
                      <img
                        src={resizedUrl}
                        alt="resized"
                        className="max-w-full h-auto mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </CardContent>
      </Card>
    </div>
  );
}
