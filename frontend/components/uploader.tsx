"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";

const FileUpload: React.FC = () => {
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB in bytes

  const [files, setFiles] = useState<File[]>([]);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const [useSonnet, setUseSonnet] = useState(false);
  const [oversizedFiles, setOversizedFiles] = useState<Set<string>>(new Set());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [prompt, setPrompt] =
    useState<string>(`You are an experienced real estate analyst. Please only include information that is included in the documents. Based on the provided documents, write a detailed investment report in the following format:

OVERVIEW
Provide a concise summary (2-3 sentences) of the investment opportunity, highlighting key elements that would immediately interest an investor.

RISK AND REWARDS
Summarize the potential risks and rewards of the investment. Focus on the factors most likely to impact returns. Include a bullet-point list of top 3 risks and top 3 potential rewards.

RETURNS
Analyze the expected returns, including:
- Expected annual return (%)
- Cash flow projections
- Cap rate
- Internal Rate of Return (IRR)
- Payback period
- Tax advantages
Create a table detailing this information for years 1-5, if possible.

KEY ASSUMPTIONS
List any major assumptions made in this analysis.

RECOMMENDATION
Provide a clear recommendation on the investment, taking all factors into account. Include a brief explanation of your reasoning.

Please use specific data and figures from the provided documents wherever possible. If certain information is not available, please indicate this in your report.
    `);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);

      // Check if the total number of files exceeds the limit
      if (files.length + newFiles.length > MAX_FILES) {
        alert(`You can only upload a maximum of ${MAX_FILES} files.`);
        return;
      }

      // Check each file's size and update oversizedFiles
      const newOversizedFiles = new Set(oversizedFiles);
      newFiles.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          newOversizedFiles.add(file.name);
        }
      });

      // Append new files to existing files
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setOversizedFiles(newOversizedFiles);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setOversizedFiles((prevOversized) => {
      const newOversized = new Set(prevOversized);
      newOversized.delete(fileName);
      return newOversized;
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType: string) => {
    const iconMap: { [key: string]: string } = {
      "application/pdf": "📄",
      "text/plain": "📝",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "📊",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "📘",
      "application/msword": "📘",
      "text/csv": "📊",
      "application/vnd.ms-excel": "📊",
      "image/jpeg": "🖼️",
      "image/jpg": "🖼️",
      "image/png": "🖼️",
      "image/webp": "🖼️",
    };
    return iconMap[fileType] || "📁";
  };

  const downloadAsPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "investment_report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const requestSummary = async () => {
    setIsSummarizing(true);
    setShowSummary(true);
    setSummary("Generating summary...");
    try {
      const fileContents = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return {
            name: file.name,
            type: file.type,
            content: Array.from(new Uint8Array(arrayBuffer)),
          };
        })
      );

      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: fileContents,
          prompt: prompt,
          useSonnet: useSonnet,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }
      const data = await response.json();
      setSummary(data.summary || "No summary generated");
      setSummaryUrl(data.summaryUrl);
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.txt,.xlsx,.docx,.doc,.csv,.xls,.jpeg,.png,.webp,.jpg,.gif"
      />
      <button
        onClick={handleButtonClick}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
        disabled={files.length >= MAX_FILES}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        {files.length >= MAX_FILES ? "File limit reached" : "Select Files"}
      </button>

      {files.length > 0 && (
        <p className="text-gray-500 text-sm text-center">
          {files.length} file{files.length !== 1 ? "s" : ""} selected (
          {files.length}/{MAX_FILES})
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.name}
            className={`text-gray-300 text-center p-4 bg-gray-800 rounded-md ${
              oversizedFiles.has(file.name) ? "border-2 border-red-500" : ""
            }`}
          >
            <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
            <div className="text-sm break-words">{file.name}</div>
            {oversizedFiles.has(file.name) && (
              <div className="text-xs text-red-500 mt-1">
                Exceeds 4.5 MB limit
              </div>
            )}
          </div>
        ))}
      </div>

      {oversizedFiles.size > 0 && (
        <p className="text-red-500 text-sm text-center">
          Some files exceed the 4.5 MB size limit and cannot be processed.
        </p>
      )}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        className="w-full p-2 border rounded-md bg-gray-700 text-gray-300 placeholder-gray-500"
        rows={5}
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="useSonnet"
          checked={useSonnet}
          onChange={(e) => setUseSonnet(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <label htmlFor="useSonnet" className="text-gray-300">
          Use Claude 3 Sonnet (more powerful, but slower)
        </label>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={requestSummary}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
          disabled={
            files.length === 0 ||
            isSummarizing ||
            prompt.trim() === "" ||
            oversizedFiles.size > 0
          }
        >
          {isSummarizing ? "Generating Summary..." : "Generate Summary"}
        </button>
      </div>

      {summaryUrl && (
        <Link
          href={summaryUrl}
          className="block w-full text-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
        >
          Download Summary
        </Link>
      )}

      {summary && (
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
        >
          {showSummary ? "Hide Summary" : "Show Summary"}
        </button>
      )}

      {showSummary && summary && (
        <div className="mt-4 p-4 bg-gray-800 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Summary</h3>
          <textarea
            className="w-full h-64 p-2 border rounded-md bg-gray-700 text-gray-300"
            value={summary}
            readOnly
          />
          <div className="mt-2 space-x-2">
            {summary && (
              <button
                onClick={downloadAsPdf}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? "Generating PDF..." : "Download as PDF"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
