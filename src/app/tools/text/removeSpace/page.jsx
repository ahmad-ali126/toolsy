"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  // Function to remove extra spaces
  const handleRemoveSpaces = () => {
    const cleaned = text.replace(/\s+/g, " ").trim();
    setResult(cleaned);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
    }
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">
        Extra Space Remover
      </h1>

      <Card className="card-hover">
        <CardContent className="p-6 flex flex-col gap-4">
          {/* Input Area */}
          <Textarea
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-40 resize-none"
          />

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleRemoveSpaces}
              className="bg-primary text-white"
            >
              Remove Extra Spaces
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
              <Textarea value={result} readOnly className="h-40 resize-none" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
