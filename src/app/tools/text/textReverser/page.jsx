"use client";
import { useState } from "react";

export default function TextReverser() {
  const [text, setText] = useState("");
  const [reversed, setReversed] = useState("");

  const handleReverse = () => {
    setReversed(text.split("").reverse().join(""));
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Text Reverser</h2>

      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
        {/* Input Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Button */}
        <button
          onClick={handleReverse}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Reverse Text
        </button>

        {/* Output */}
        {reversed && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Reversed Text:</h3>
            <div className="bg-gray-100 p-3 rounded-lg break-words">
              {reversed}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
