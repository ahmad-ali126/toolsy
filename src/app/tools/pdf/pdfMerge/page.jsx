"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    setLoading(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      saveAs(blob, "merged.pdf");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Something went wrong while merging PDFs.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">📄 Merge PDF Files</h1>
        <p className="text-gray-600 mb-6">
          Upload multiple PDF files and merge them into one. 100% free and works
          in your browser.
        </p>

        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 text-sm cursor-pointer"
        />

        <button
          onClick={mergePDFs}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-semibold transition disabled:opacity-50"
        >
          {loading ? "Merging..." : "Merge PDFs"}
        </button>
      </div>
    </div>
  );
}
