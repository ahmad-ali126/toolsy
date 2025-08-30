"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const handleCalculate = () => {
    if (!weight || !height) return;

    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = (
      parseFloat(weight) /
      (heightInMeters * heightInMeters)
    ).toFixed(1);

    setBmi(bmiValue);

    if (bmiValue < 18.5) {
      setCategory("Underweight");
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setCategory("Normal weight");
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setCategory("Overweight");
    } else {
      setCategory("Obese");
    }
  };

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">BMI Calculator</h1>

      <Card className="card-hover">
        <CardContent className="p-6 flex flex-col gap-6">
          {/* Inputs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="font-medium">Weight (kg)</label>
              <Input
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="font-medium">Height (cm)</label>
              <Input
                type="number"
                placeholder="Enter height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Button */}
          <Button onClick={handleCalculate} className="bg-primary text-white">
            Calculate BMI
          </Button>

          {/* Result */}
          {bmi && (
            <div className="mt-4 p-4 rounded-lg border bg-muted">
              <h2 className="text-lg font-semibold">
                Your BMI: <span className="text-primary">{bmi}</span>
              </h2>
              <p className="text-foreground">Category: {category}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
