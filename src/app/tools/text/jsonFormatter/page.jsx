"use client";
import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState("");

  const handleFormat = () => {
    try {
      const obj = JSON.parse(input);
      setFormatted(JSON.stringify(obj, null, 2));
      setError("");
    } catch (err) {
      setError("Invalid JSON. Please check your input.");
      setFormatted("");
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">JSON Formatter</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        {/* Input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON here..."
          className="w-full h-40 border border-gray-300 rounded-lg p-3 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Button */}
        <button
          onClick={handleFormat}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Format JSON
        </button>

        {/* Output */}
        {error && <p className="text-red-500 font-semibold">{error}</p>}
        {formatted && (
          <pre className="bg-gray-100 p-3 rounded-lg overflow-auto text-sm font-mono">
            {formatted}
          </pre>
        )}
      </div>
    </section>
  );
}
