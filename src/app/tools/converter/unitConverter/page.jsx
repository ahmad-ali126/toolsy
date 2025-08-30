"use client";
import { useState } from "react";

export default function UnitConverter() {
  const categories = {
    Length: {
      units: {
        Meter: 1,
        Kilometer: 1000,
        Centimeter: 0.01,
        Mile: 1609.34,
        Foot: 0.3048,
        Inch: 0.0254,
      },
    },
    Weight: {
      units: { Kilogram: 1, Gram: 0.001, Pound: 0.453592, Ounce: 0.0283495 },
    },
    Temperature: {
      units: { Celsius: "C", Fahrenheit: "F", Kelvin: "K" },
    },
    Time: {
      units: { Second: 1, Minute: 60, Hour: 3600, Day: 86400 },
    },
  };

  const [category, setCategory] = useState("Length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");

  const convert = () => {
    if (value === "" || isNaN(value)) return setResult("Enter a valid number");

    let num = parseFloat(value);

    if (category === "Temperature") {
      setResult(temperatureConvert(num, fromUnit, toUnit));
    } else {
      const base = num * categories[category].units[fromUnit];
      const converted = base / categories[category].units[toUnit];
      setResult(`${converted} ${toUnit}`);
    }
  };

  const temperatureConvert = (val, from, to) => {
    let temp;
    // convert from -> Celsius
    if (from === "Celsius") temp = val;
    if (from === "Fahrenheit") temp = (val - 32) * (5 / 9);
    if (from === "Kelvin") temp = val - 273.15;

    // Celsius -> target
    if (to === "Celsius") return `${temp} °C`;
    if (to === "Fahrenheit") return `${temp * (9 / 5) + 32} °F`;
    if (to === "Kelvin") return `${temp + 273.15} K`;
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Unit Converter</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            const firstUnit = Object.keys(categories[e.target.value].units)[0];
            setFromUnit(firstUnit);
            setToUnit(firstUnit);
          }}
          className="w-full border rounded-lg p-2"
        >
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Input */}
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* From & To */}
        <div className="flex gap-4">
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="flex-1 border rounded-lg p-2"
          >
            {Object.keys(categories[category].units).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="flex-1 border rounded-lg p-2"
          >
            {Object.keys(categories[category].units).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={convert}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Convert
        </button>

        {/* Result */}
        {result && (
          <p className="text-center font-semibold text-lg text-indigo-700">
            {result}
          </p>
        )}
      </div>
    </section>
  );
}
