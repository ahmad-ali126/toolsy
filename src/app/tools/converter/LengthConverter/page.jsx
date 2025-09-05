"use client";
import { useState } from "react";
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

export default function page() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("inch");
  const [result, setResult] = useState(null);

  // Conversion factors (to meters)
  const conversion = {
    cm: 0.01,
    inch: 0.0254,
    ft: 0.3048,
    m: 1,
  };

  const handleConvert = () => {
    if (!value) return;
    const inMeters = parseFloat(value) * conversion[fromUnit];
    const converted = inMeters / conversion[toUnit];
    setResult(converted.toFixed(4));
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">
        Length Converter
      </h1>

      <Card className="card-hover max-w-xl mx-auto">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Input */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              type="number"
              placeholder="Enter value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1"
            />

            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="inch">inch</SelectItem>
                <SelectItem value="ft">ft</SelectItem>
                <SelectItem value="m">m</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* To Unit */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <span className="font-medium">Convert to:</span>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="inch">inch</SelectItem>
                <SelectItem value="ft">ft</SelectItem>
                <SelectItem value="m">m</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button */}
          <Button onClick={handleConvert} className="bg-primary text-white">
            Convert
          </Button>

          {/* Result */}
          {result && (
            <div className="mt-4 p-4 rounded-lg border bg-muted">
              <h2 className="text-lg font-semibold">Result:</h2>
              <p className="text-foreground">
                {value} {fromUnit} ={" "}
                <span className="text-primary font-bold">
                  {result} {toUnit}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
