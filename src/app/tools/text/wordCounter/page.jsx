"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  // Count words and characters
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;

  const handleClear = () => setText("");

  return (
    <div>
      <section className="max-w-4xl mx-auto px-4 py-16">
        <Card className="shadow-lg border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Word Counter ✍️
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="min-h-[200px] resize-none"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-lg font-semibold">{wordCount}</p>
                <p className="text-sm text-muted-foreground">Words</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-lg font-semibold">{charCount}</p>
                <p className="text-sm text-muted-foreground">Characters</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <Button variant="destructive" onClick={handleClear}>
                Clear Text
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      jkahkjafh
    </div>
  );
}
