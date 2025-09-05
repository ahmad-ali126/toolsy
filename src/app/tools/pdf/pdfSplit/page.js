"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const splitPDF = async () => {
    if (!file) {
      alert("Please upload a PDF file first.");
      return;
    }

    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const totalPages = pdf.getPageCount();
      const start = Math.max(1, parseInt(startPage));
      const end = endPage
        ? Math.min(totalPages, parseInt(endPage))
        : totalPages;

      if (start > end || start > totalPages) {
        alert("Invalid page range.");
        setLoading(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(
        pdf,
        Array.from({ length: end - start + 1 }, (_, i) => i + (start - 1))
      );

      copiedPages.forEach((page) => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      saveAs(blob, `split-pages-${start}-to-${end}.pdf`);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("Something went wrong while splitting PDF.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">✂️ Split PDF</h1>
        <p className="text-gray-600 mb-6">
          Upload a PDF and extract specific pages into a new PDF file.
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm cursor-pointer"
        />

        <div className="flex gap-3 mb-4">
          <input
            type="number"
            min="1"
            placeholder="Start Page"
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="1"
            placeholder="End Page (optional)"
            value={endPage}
            onChange={(e) => setEndPage(e.target.value)}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={splitPDF}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {loading ? "Splitting..." : "Split PDF"}
        </button>
      </div>
    </div>
  );
}
