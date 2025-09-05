"use client";
import { useState, useEffect } from "react";
import {
  ArrowUpDown,
  RotateCcw,
  Copy,
  Check,
  History,
  Calculator,
  Menu,
  X,
} from "lucide-react";

export default function EnhancedUnitConverter() {
  const categories = {
    Length: {
      units: {
        Meter: 1,
        Kilometer: 1000,
        Centimeter: 0.01,
        Millimeter: 0.001,
        Mile: 1609.34,
        Yard: 0.9144,
        Foot: 0.3048,
        Inch: 0.0254,
      },
    },
    Weight: {
      units: {
        Kilogram: 1,
        Gram: 0.001,
        Pound: 0.453592,
        Ounce: 0.0283495,
        Ton: 1000,
        Stone: 6.35029,
      },
    },
    Temperature: {
      units: { Celsius: "C", Fahrenheit: "F", Kelvin: "K" },
    },
    Time: {
      units: {
        Second: 1,
        Minute: 60,
        Hour: 3600,
        Day: 86400,
        Week: 604800,
        Month: 2629746,
        Year: 31556952,
      },
    },
    Volume: {
      units: {
        Liter: 1,
        Milliliter: 0.001,
        Gallon: 3.78541,
        Quart: 0.946353,
        Pint: 0.473176,
        Cup: 0.236588,
        "Fluid Ounce": 0.0295735,
      },
    },
    Area: {
      units: {
        "Square Meter": 1,
        "Square Kilometer": 1000000,
        "Square Centimeter": 0.0001,
        "Square Mile": 2589988.11,
        "Square Foot": 0.092903,
        Acre: 4046.86,
        Hectare: 10000,
      },
    },
  };

  const [category, setCategory] = useState("Length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-convert as user types
  useEffect(() => {
    if (value && !isNaN(value) && value !== "") {
      convert();
    } else {
      setResult("");
    }
  }, [value, fromUnit, toUnit, category]);

  const convert = () => {
    if (value === "" || isNaN(value)) return setResult("");

    let num = parseFloat(value);
    let convertedResult;

    if (category === "Temperature") {
      convertedResult = temperatureConvert(num, fromUnit, toUnit);
    } else {
      const base = num * categories[category].units[fromUnit];
      const converted = base / categories[category].units[toUnit];
      convertedResult = `${formatNumber(converted)} ${toUnit}`;
    }

    setResult(convertedResult);
  };

  const formatNumber = (num) => {
    if (num === 0) return "0";
    if (Math.abs(num) < 0.001) return num.toExponential(3);
    if (Math.abs(num) > 1000000) return num.toExponential(3);
    return parseFloat(num.toFixed(6)).toString();
  };

  const temperatureConvert = (val, from, to) => {
    let temp;
    // convert from -> Celsius
    if (from === "Celsius") temp = val;
    if (from === "Fahrenheit") temp = (val - 32) * (5 / 9);
    if (from === "Kelvin") temp = val - 273.15;

    // Celsius -> target
    if (to === "Celsius") return `${formatNumber(temp)} °C`;
    if (to === "Fahrenheit") return `${formatNumber(temp * (9 / 5) + 32)} °F`;
    if (to === "Kelvin") return `${formatNumber(temp + 273.15)} K`;
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const clearAll = () => {
    setValue("");
    setResult("");
  };

  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addToHistory = () => {
    if (value && result) {
      const historyItem = {
        id: Date.now(),
        conversion: `${value} ${fromUnit} = ${result}`,
        category,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
    }
  };

  const loadFromHistory = (item) => {
    const parts = item.conversion.split(" = ")[0].split(" ");
    setValue(parts[0]);
    setFromUnit(parts.slice(1).join(" "));
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calculator className="text-indigo-600" size={28} />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              Unit Converter
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Convert between different units instantly
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Main Converter - Full width on mobile, 2/3 on desktop */}
          <div className="flex-1 lg:flex-[2]">
            <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Category Tabs - Horizontal scroll on mobile */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                  {Object.keys(categories).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        const firstUnit = Object.keys(categories[cat].units)[0];
                        const secondUnit =
                          Object.keys(categories[cat].units)[1] || firstUnit;
                        setFromUnit(firstUnit);
                        setToUnit(secondUnit);
                        setValue("");
                        setResult("");
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm sm:text-base ${
                        category === cat
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter value"
                      className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-base sm:text-lg"
                    />
                    <select
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                      className="w-full sm:w-auto sm:min-w-32 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
                    >
                      {Object.keys(categories[category].units).map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapUnits}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-sm"
                    title="Swap units"
                  >
                    <ArrowUpDown size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Output Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 border border-gray-200 rounded-lg p-3 bg-gray-50 text-base sm:text-lg font-medium text-indigo-700 min-h-[3rem] flex items-center">
                      <span className="truncate">
                        {result || "Result will appear here"}
                      </span>
                    </div>
                    <select
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                      className="w-full sm:w-auto sm:min-w-32 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base"
                    >
                      {Object.keys(categories[category].units).map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Stack on mobile, inline on desktop */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={clearAll}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base"
                >
                  <RotateCcw size={16} />
                  Clear
                </button>
                <button
                  onClick={copyResult}
                  disabled={!result}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Result"}
                </button>
                <button
                  onClick={addToHistory}
                  disabled={!result}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <History size={16} />
                  Save
                </button>
                {/* Mobile History Toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm sm:text-base"
                >
                  <Menu size={16} />
                  History
                </button>
              </div>

              {/* Quick Info */}
              {result && (
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-medium text-indigo-900 mb-2 text-sm sm:text-base">
                    Conversion Summary
                  </h4>
                  <p className="text-indigo-700 text-sm sm:text-base break-words">
                    <span className="font-semibold">
                      {value} {fromUnit}
                    </span>{" "}
                    equals <span className="font-semibold">{result}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, shown as overlay when toggled */}
          <div
            className={`
            lg:flex-1 lg:block
            ${
              sidebarOpen
                ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:bg-transparent lg:static lg:z-auto"
                : "hidden"
            }
          `}
          >
            <div
              className={`
              bg-white lg:bg-transparent h-full lg:h-auto
              ${sidebarOpen ? "w-80 ml-auto shadow-2xl" : ""}
              lg:w-full lg:shadow-none
            `}
            >
              {/* Mobile header */}
              {sidebarOpen && (
                <div className="lg:hidden flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    History & Quick Reference
                  </h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <div className="p-4 lg:p-0 space-y-4 lg:space-y-6 overflow-y-auto h-full lg:h-auto">
                {/* History Panel */}
                <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      History
                    </h3>
                    <button
                      onClick={() => setHistory([])}
                      className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
                      disabled={history.length === 0}
                    >
                      Clear All
                    </button>
                  </div>

                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">
                      No conversions yet. Start converting to see your history!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 sm:max-h-96 overflow-y-auto">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => loadFromHistory(item)}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition group"
                        >
                          <div className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-indigo-600 break-words">
                            {item.conversion}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.category} • {item.timestamp}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Common Conversions */}
                <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                    Quick Reference
                  </h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">1 mile</span> = 1.609 km
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">1 kg</span> = 2.205 lbs
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">0°C</span> = 32°F
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">1 gallon</span> = 3.785 L
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">1 inch</span> = 2.54 cm
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <span className="font-medium">1 foot</span> = 30.48 cm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
