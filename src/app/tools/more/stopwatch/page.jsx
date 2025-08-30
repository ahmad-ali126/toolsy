"use client";

import { useState, useRef } from "react";

export default function Stopwatch() {
  const [time, setTime] = useState(0); // time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopStopwatch = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const resetStopwatch = () => {
    clearInterval(timerRef.current);
    setTime(0);
    setIsRunning(false);
  };

  // Convert seconds → hh:mm:ss
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Stopwatch</h2>

      <div className="bg-white rounded-xl shadow p-6 text-center space-y-6">
        {/* Timer Display */}
        <div className="text-4xl font-mono">{formatTime(time)}</div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startStopwatch}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Start
          </button>
          <button
            onClick={stopStopwatch}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Stop
          </button>
          <button
            onClick={resetStopwatch}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
