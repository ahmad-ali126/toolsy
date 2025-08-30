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

export default function SalaryTaxCalculator() {
  // Inputs
  const [annualSalary, setAnnualSalary] = useState("");
  const [deductions, setDeductions] = useState("");
  const [allowances, setAllowances] = useState("");
  const [currency, setCurrency] = useState("USD");

  // Brackets state
  const [brackets] = useState([
    { upTo: 10000, rate: 0.0 }, // 0% on first 10k
    { upTo: 40000, rate: 0.1 }, // 10% next 30k
    { upTo: 100000, rate: 0.2 }, // 20% next 60k
    { upTo: null, rate: 0.3 }, // 30% remaining
  ]);

  const [result, setResult] = useState(null);

  // Helper: compute tax
  function computeProgressiveTax(taxable, bracketsArr) {
    let remaining = taxable;
    let lastUpper = 0;
    const breakdown = [];
    let totalTax = 0;

    for (let i = 0; i < bracketsArr.length; i++) {
      const b = bracketsArr[i];
      const upper = b.upTo === null ? Infinity : Number(b.upTo);
      const bandAmount = Math.max(0, Math.min(remaining, upper - lastUpper));
      const taxForBand = bandAmount * b.rate;
      breakdown.push({
        bandFrom: lastUpper,
        bandTo: b.upTo === null ? "∞" : upper,
        bandAmount,
        rate: b.rate,
        taxForBand,
      });
      totalTax += taxForBand;
      remaining -= bandAmount;
      lastUpper = upper;
      if (remaining <= 0) break;
    }

    return { totalTax, breakdown };
  }

  const handleCalculate = () => {
    const salary = parseFloat(annualSalary) || 0;
    const ded = parseFloat(deductions) || 0;
    const allow = parseFloat(allowances) || 0;

    if (salary <= 0) {
      setResult(null);
      return;
    }

    const taxableIncome = Math.max(0, salary - ded - allow);
    const { totalTax, breakdown } = computeProgressiveTax(
      taxableIncome,
      brackets
    );

    const netAnnual = salary - totalTax;
    const netMonthly = netAnnual / 12;
    const effectiveRate = salary > 0 ? (totalTax / salary) * 100 : 0;

    setResult({
      salary: salary.toFixed(2),
      deductions: ded.toFixed(2),
      allowances: allow.toFixed(2),
      taxableIncome: taxableIncome.toFixed(2),
      totalTax: totalTax.toFixed(2),
      netAnnual: netAnnual.toFixed(2),
      netMonthly: netMonthly.toFixed(2),
      effectiveRate: effectiveRate.toFixed(2),
      breakdown,
    });
  };

  // Format currency safely
  const fmt = (val) =>
    `${currency} ${Number(val).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="container-box section-spacing">
      <h1 className="text-3xl font-bold text-gradient mb-6">
        Salary Tax Calculator
      </h1>

      <Card className="card-hover max-w-3xl mx-auto">
        <CardContent className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium">Annual Salary</label>
              <Input
                type="number"
                placeholder="Enter annual salary"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                  <SelectItem value="AUD">AUD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Deductions (total)</label>
              <Input
                type="number"
                placeholder="e.g. retirement, pre-tax deductions"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Allowances / Exemptions</label>
              <Input
                type="number"
                placeholder="personal allowance or tax-free amount"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            This is a <strong>generic progressive tax</strong> calculator.
            Default brackets are examples — adjust brackets in code to match a
            specific country's rules.
          </p>

          <Button onClick={handleCalculate} className="bg-primary text-white">
            Calculate Tax
          </Button>

          {result && (
            <div className="mt-4 p-4 rounded-lg border bg-muted">
              <h2 className="text-lg font-semibold mb-2">Summary</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Gross Salary</p>
                  <p className="font-semibold">{fmt(result.salary)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Deductions
                  </p>
                  <p className="font-semibold">{fmt(result.deductions)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Allowances</p>
                  <p className="font-semibold">{fmt(result.allowances)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Taxable Income
                  </p>
                  <p className="font-semibold">{fmt(result.taxableIncome)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Tax</p>
                  <p className="text-xl font-bold text-destructive">
                    {fmt(result.totalTax)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Effective Tax Rate
                  </p>
                  <p className="font-semibold">{result.effectiveRate}%</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Net Annual Salary
                  </p>
                  <p className="font-semibold">{fmt(result.netAnnual)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Net Monthly Salary
                  </p>
                  <p className="font-semibold">{fmt(result.netMonthly)}</p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Per-bracket Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-sm text-muted-foreground">
                        <th className="py-2">Band</th>
                        <th className="py-2">Taxable Amount</th>
                        <th className="py-2">Rate</th>
                        <th className="py-2">Tax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.breakdown.map((b, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-2">
                            {Number(b.bandFrom).toLocaleString()} —{" "}
                            {b.bandTo === "∞"
                              ? "∞"
                              : Number(b.bandTo).toLocaleString()}
                          </td>
                          <td className="py-2">
                            {fmt(b.bandAmount.toFixed(2))}
                          </td>
                          <td className="py-2">{(b.rate * 100).toFixed(1)}%</td>
                          <td className="py-2">
                            {fmt(b.taxForBand.toFixed(2))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
