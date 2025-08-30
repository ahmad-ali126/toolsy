"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function ImageConverterPage() {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9); // 0.0 - 1.0
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadName, setDownloadName] = useState("converted-image");
  const imgRef = useRef(null);

  // Handle file selection
  const handleFile = (f) => {
    setDownloadUrl(null);
    setFile(f);
    if (!f) {
      setSrc(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setSrc(url);
    const baseName = f.name.replace(/\.[^/.]+$/, "");
    setDownloadName(`${baseName}-converted`);
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    handleFile(f);
  };

  // Drag & drop handlers
  const onDrop = (e) => {
    e.preventDefault();
    const f =
      e.dataTransfer.files && e.dataTransfer.files[0]
        ? e.dataTransfer.files[0]
        : null;
    handleFile(f);
  };
  const onDragOver = (e) => e.preventDefault();

  // Convert using canvas
  const convertImage = async () => {
    if (!file || !src) return;
    setBusy(true);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await new Promise((res, rej) => {
        img.onload = () => res(true);
        img.onerror = (err) => rej(err);
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mime = format;
      const ext =
        mime === "image/png" ? "png" : mime === "image/jpeg" ? "jpg" : "webp";

      await new Promise((resolve, reject) => {
        const q = Math.max(0, Math.min(1, quality));
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert image"));
              return;
            }
            if (downloadUrl) URL.revokeObjectURL(downloadUrl);
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setDownloadName((n) => `${n}.${ext}`);
            resolve();
          },
          mime,
          q
        );
      });
    } catch (err) {
      console.error(err);
      alert("Conversion failed. See console for details.");
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const clearAll = () => {
    setFile(null);
    setSrc(null);
    setDownloadUrl(null);
    setDownloadName("converted-image");
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <Card className="rounded-2xl shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Image Converter 🖼️
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Drop zone + file input */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="border-dashed border-2 border-muted rounded-lg p-6 text-center cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
            <label htmlFor="image-input" className="inline-block">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Click to select an image or drag & drop here (PNG, JPG, GIF,
                  WebP, etc.)
                </p>
                <Button
                  onClick={() => document.getElementById("image-input").click()}
                >
                  Choose Image
                </Button>
              </div>
            </label>

            {src && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex justify-center">
                  <img
                    ref={imgRef}
                    src={src}
                    alt="preview"
                    className="max-w-full max-h-64 object-contain rounded-md border"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Filename</Label>
                    <Input
                      value={downloadName.replace(/\.[^/.]+$/, "")}
                      onChange={(e) => setDownloadName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Target Format</Label>
                    <Select onValueChange={(val) => setFormat(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder={format} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image/png">
                          PNG (lossless)
                        </SelectItem>
                        <SelectItem value="image/jpeg">
                          JPEG / JPG (lossy)
                        </SelectItem>
                        <SelectItem value="image/webp">
                          WebP (modern)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Quality ({Math.round(quality * 100)}%)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[Math.round(quality * 100)]}
                        min={10}
                        max={100}
                        step={1}
                        onValueChange={(val) => setQuality(val[0] / 100)}
                        className="flex-1"
                      />
                      <div className="w-12 text-right">
                        {Math.round(quality * 100)}%
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Quality applies to JPEG and WebP. PNG is lossless and
                      ignores quality.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button onClick={convertImage} disabled={!file || busy}>
              {busy ? "Converting..." : "Convert Image"}
            </Button>
            <Button
              variant="secondary"
              onClick={clearAll}
              disabled={!file && !downloadUrl}
            >
              Clear
            </Button>
            <Button
              variant="ghost"
              onClick={handleDownload}
              disabled={!downloadUrl}
            >
              Download
            </Button>
          </div>

          {downloadUrl && (
            <div className="text-center mt-2">
              <p className="text-sm">
                Conversion ready — click Download or preview below.
              </p>
              <div className="mt-3 flex justify-center">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Open converted image in new tab
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
