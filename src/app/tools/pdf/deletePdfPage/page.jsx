"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function DeletePDFPages() {
  const [file, setFile] = useState(null);
  const [pagesToDelete, setPagesToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
    setFile(selectedFile);
    setError("");
  };

  const validateInput = () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return false;
    }

    if (!pagesToDelete.trim()) {
      setError("Enter pages to delete (e.g., 2, 4, 6).");
      return false;
    }

    return true;
  };

  const deletePages = async () => {
    if (!validateInput()) return;

    setLoading(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      // Convert input into array of page indices
      const pages = pagesToDelete
        .split(",")
        .map((p) => parseInt(p.trim(), 10) - 1) // zero-based index
        .filter((p) => !isNaN(p) && p >= 0 && p < totalPages);

      // Remove duplicates
      const uniquePages = [...new Set(pages)];

      if (uniquePages.length === 0) {
        setError("No valid pages found to delete.");
        setLoading(false);
        return;
      }

      // Remove pages (reverse order to avoid index shifting)
      uniquePages
        .sort((a, b) => b - a)
        .forEach((p) => {
          pdf.removePage(p);
        });

      const newPdfBytes = await pdf.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      saveAs(blob, `${file.name.replace(".pdf", "")}-pages-deleted.pdf`);
    } catch (error) {
      console.error("Error deleting PDF pages:", error);
      setError("Something went wrong while deleting PDF pages.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      deletePages();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          🗑️ Delete PDF Pages
        </h1>
        <p className="text-gray-600 mb-6">
          Upload a PDF and enter the page numbers you want to remove.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select PDF File
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pages to Delete
          </label>
          <input
            type="text"
            placeholder="Enter pages (e.g., 2, 4, 6)"
            value={pagesToDelete}
            onChange={(e) => setPagesToDelete(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate page numbers with commas
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={deletePages}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Deleting...
            </>
          ) : (
            "Delete Pages"
          )}
        </button>

        {file && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Selected file:</strong> {file.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
