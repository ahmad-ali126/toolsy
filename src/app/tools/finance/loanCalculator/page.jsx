"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [years, setYears] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const calculateLoan = () => {
    const principal = parseFloat(amount);
    const annualRate = parseFloat(interest) / 100 / 12; // monthly rate
    const numPayments = parseFloat(years) * 12;

    if (!principal || !annualRate || !numPayments) return;

    // EMI formula
    const emi =
      (principal * annualRate * Math.pow(1 + annualRate, numPayments)) /
      (Math.pow(1 + annualRate, numPayments) - 1);

    setMonthlyPayment(emi);
    setTotalPayment(emi * numPayments);
    setTotalInterest(emi * numPayments - principal);
  };

  const reset = () => {
    setAmount("");
    setInterest("");
    setYears("");
    setMonthlyPayment(null);
    setTotalPayment(null);
    setTotalInterest(null);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Loan Calculator 💰
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Loan Amount ($)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 10000"
              />
            </div>
            <div className="space-y-2">
              <Label>Interest Rate (%)</Label>
              <Input
                type="number"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="e.g. 7.5"
              />
            </div>
            <div className="space-y-2">
              <Label>Loan Term (Years)</Label>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <Button onClick={calculateLoan}>Calculate</Button>
            <Button variant="destructive" onClick={reset}>
              Reset
            </Button>
          </div>

          {/* Results */}
          {monthlyPayment && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-lg font-semibold">
                  ${monthlyPayment.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Monthly Payment</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-lg font-semibold">
                  ${totalPayment?.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Payment</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-lg font-semibold">
                  ${totalInterest?.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Interest</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
