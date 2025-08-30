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

export default function Page() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("C");
  const [toUnit, setToUnit] = useState("F");
  const [result, setResult] = useState(null);

  const convertTemp = (val, from, to) => {
    if (from === to) return val;

    // Convert from source to Celsius
    let celsius;
    if (from === "C") celsius = val;
    else if (from === "F") celsius = (val - 32) * (5 / 9);
    else if (from === "K") celsius = val - 273.15;

    // Convert Celsius to target
    if (to === "C") return celsius;
    if (to === "F") return (celsius * 9) / 5 + 32;
    if (to === "K") return celsius + 273.15;
  };

  const handleConvert = () => {
    if (!value) return;
    const converted = convertTemp(parseFloat(value), fromUnit, toUnit);
    setResult(converted.toFixed(2));
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">
        Temperature Converter
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
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">°C</SelectItem>
                <SelectItem value="F">°F</SelectItem>
                <SelectItem value="K">K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* To Unit */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <span className="font-medium">Convert to:</span>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">°C</SelectItem>
                <SelectItem value="F">°F</SelectItem>
                <SelectItem value="K">K</SelectItem>
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
                {value}°{fromUnit} ={" "}
                <span className="text-primary font-bold">
                  {result}°{toUnit}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
