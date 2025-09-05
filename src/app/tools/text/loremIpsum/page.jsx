"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [paragraphs, setParagraphs] = useState(2);
  const [result, setResult] = useState("");

  // Basic lorem ipsum text
  const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  // Generate lorem ipsum text
  const handleGenerate = () => {
    const output = Array.from({ length: paragraphs }, () => lorem).join("\n\n");
    setResult(output);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">
        Lorem Ipsum Generator
      </h1>

      <Card className="card-hover">
        <CardContent className="p-6 flex flex-col gap-4">
          {/* Input: Paragraph Count */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <label className="font-medium">Number of paragraphs:</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={paragraphs}
              onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
              className="w-24"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerate} className="bg-primary text-white">
              Generate
            </Button>
            {result && (
              <Button variant="secondary" onClick={handleCopy}>
                Copy Result
              </Button>
            )}
          </div>

          {/* Output */}
          {result && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Result:</h2>
              <Textarea value={result} readOnly className="h-60 resize-none" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
