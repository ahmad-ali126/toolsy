"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

    let chars = lower;
    if (includeUppercase) chars += upper;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let result = "";
    for (let i = 0; i < length; i++) {
      const randIndex = Math.floor(Math.random() * chars.length);
      result += chars[randIndex];
    }
    setPassword(result);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      alert("Password copied to clipboard!");
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Random Password Generator 🔐
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generated Password */}
          <div className="flex items-center gap-2">
            <Input
              value={password}
              readOnly
              placeholder="Your generated password will appear here..."
              className="font-mono"
            />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div>
              <Label>Password Length: {length}</Label>
              <Slider
                value={[length]}
                onValueChange={(val) => setLength(val[0])}
                min={6}
                max={32}
                step={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={includeUppercase}
                  onCheckedChange={(val) => setIncludeUppercase(!!val)}
                />
                <Label>Include Uppercase</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={includeNumbers}
                  onCheckedChange={(val) => setIncludeNumbers(!!val)}
                />
                <Label>Include Numbers</Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={includeSymbols}
                  onCheckedChange={(val) => setIncludeSymbols(!!val)}
                />
                <Label>Include Symbols</Label>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-center">
            <Button onClick={generatePassword}>Generate Password</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
