"use client";
import { useState } from "react";

export default function ColorPicker() {
  const [color, setColor] = useState("#4f46e5");

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Color Picker</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4 text-center">
        {/* Picker */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-32 h-32 border-none rounded-lg cursor-pointer"
        />

        {/* Hex + Preview */}
        <div className="space-y-2">
          <p className="text-lg font-semibold">Selected Color:</p>
          <p className="font-mono">{color}</p>
          <div
            className="w-full h-16 rounded-lg shadow-inner"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    </section>
  );
}
