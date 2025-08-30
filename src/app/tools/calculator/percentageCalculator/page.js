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
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [mode, setMode] = useState("percentOf");
  const [result, setResult] = useState(null);

  const calculate = () => {
    let res = null;
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || (mode !== "increaseDecrease" && isNaN(num2))) return;

    switch (mode) {
      case "percentOf":
        res = (num1 / 100) * num2; // e.g. 20% of 150
        break;
      case "whatPercent":
        res = (num1 / num2) * 100; // e.g. 30 is what % of 200
        break;
      case "increaseDecrease":
        res = num1 + (num1 * num2) / 100; // Increase/Decrease by %
        break;
      default:
        res = null;
    }
    setResult(res?.toFixed(2));
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">
        Percentage Calculator
      </h1>

      <Card className="card-hover max-w-xl mx-auto">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Mode Selector */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <span className="font-medium">Choose Mode:</span>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-full sm:w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentOf">% of a Number</SelectItem>
                <SelectItem value="whatPercent">What % of</SelectItem>
                <SelectItem value="increaseDecrease">
                  Increase/Decrease by %
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inputs */}
          {mode === "percentOf" && (
            <div className="flex flex-col gap-4">
              <Input
                type="number"
                placeholder="Enter percentage (e.g. 20)"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Enter number (e.g. 150)"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
              />
            </div>
          )}

          {mode === "whatPercent" && (
            <div className="flex flex-col gap-4">
              <Input
                type="number"
                placeholder="Enter part (e.g. 30)"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Enter whole (e.g. 200)"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
              />
            </div>
          )}

          {mode === "increaseDecrease" && (
            <div className="flex flex-col gap-4">
              <Input
                type="number"
                placeholder="Enter original number (e.g. 1000)"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Enter percentage (+/- e.g. 10 or -5)"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
              />
            </div>
          )}

          {/* Button */}
          <Button onClick={calculate} className="bg-primary text-white">
            Calculate
          </Button>

          {/* Result */}
          {result && (
            <div className="mt-4 p-4 rounded-lg border bg-muted">
              <h2 className="text-lg font-semibold">Result:</h2>
              <p className="text-foreground">
                <span className="text-primary font-bold">{result}</span>
                {mode === "percentOf" || mode === "increaseDecrease" ? "" : "%"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
