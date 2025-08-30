"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days });
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">Age Calculator</h1>

      <Card className="card-hover">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Date of Birth</label>
            <Input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Button */}
          <Button onClick={handleCalculate} className="bg-primary text-white">
            Calculate Age
          </Button>

          {/* Result */}
          {result && (
            <div className="mt-4 p-4 rounded-lg border bg-muted">
              <h2 className="text-lg font-semibold">Your Age:</h2>
              <p className="text-foreground">
                {result.years} years, {result.months} months, {result.days} days
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
