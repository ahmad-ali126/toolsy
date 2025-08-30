"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  // Handle button click
  const handleClick = (value) => {
    setExpression((prev) => prev + value);
  };

  // Clear input
  const handleClear = () => {
    setExpression("");
    setResult("");
  };

  // Evaluate expression safely
  const handleCalculate = () => {
    try {
      let exp = expression
        .replace(/sin/gi, "Math.sin")
        .replace(/cos/gi, "Math.cos")
        .replace(/tan/gi, "Math.tan")
        .replace(/log/gi, "Math.log10")
        .replace(/ln/gi, "Math.log")
        .replace(/√/g, "Math.sqrt")
        .replace(/\^/g, "**"); // ✅ use power operator

      const evalResult = eval(exp); // ⚠ controlled environment only
      setResult(evalResult);
    } catch (error) {
      setResult("Error");
    }
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "sin(",
    "cos(",
    "tan(",
    "4",
    "5",
    "6",
    "*",
    "log(",
    "ln(",
    "√(",
    "1",
    "2",
    "3",
    "-",
    "^",
    "(",
    ")",
    "0",
    ".",
    "%",
    "+",
    "π",
    "e",
    "=",
  ];

  // Assign colors dynamically
  const getButtonClass = (btn) => {
    if (btn === "=")
      return "col-span-2 bg-green-600 text-white hover:bg-green-700";
    if (btn === "Clear") return "bg-red-600 text-white hover:bg-red-700";
    if (["+", "-", "*", "/", "^", "%"].includes(btn))
      return "bg-blue-600 text-white hover:bg-blue-700";
    if (["sin(", "cos(", "tan(", "log(", "ln(", "√("].includes(btn))
      return "bg-purple-600 text-white hover:bg-purple-700";
    if (["π", "e"].includes(btn))
      return "bg-amber-600 text-white hover:bg-amber-700";
    return "bg-gray-200 hover:bg-gray-300";
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">
        Scientific Calculator
      </h1>

      <Card className="card-hover max-w-md mx-auto">
        <CardContent className="p-6 flex flex-col gap-4">
          {/* Display */}
          <Input
            type="text"
            value={expression}
            readOnly
            className="text-right font-mono text-lg"
          />
          <Input
            type="text"
            value={result}
            readOnly
            className="text-right font-bold text-primary text-xl"
          />

          {/* Buttons Grid */}
          <div className="grid grid-cols-7 gap-2">
            {buttons.map((btn, i) => (
              <Button
                key={i}
                onClick={() => {
                  if (btn === "=") {
                    handleCalculate();
                  } else if (btn === "π") {
                    handleClick("3.1416");
                  } else if (btn === "e") {
                    handleClick("2.718");
                  } else {
                    handleClick(btn);
                  }
                }}
                className={getButtonClass(btn)}
              >
                {btn}
              </Button>
            ))}
          </div>

          {/* Clear Button */}
          <Button
            onClick={handleClear}
            className="bg-red-600 text-white mt-3 hover:bg-red-700"
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
