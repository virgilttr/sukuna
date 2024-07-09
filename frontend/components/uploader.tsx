"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
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
      "image/png": "🖼️",
      "image/webp": "🖼️",
    };
    return iconMap[fileType] || "📁";
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
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.txt,.xlsx,.docx,.doc,.csv,.xls,.jpeg,.png,.webp"
      />
      <button
        onClick={handleButtonClick}
        className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-4 py-2 rounded-md transition duration-200 ease-in-out flex items-center justify-center"
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
        Select Files
      </button>
      {files.length > 0 && (
        <p className="text-zinc-400 text-sm text-center">
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div
            key={file.name}
            className="text-zinc-300 text-center p-4 bg-zinc-800 rounded-md"
          >
            <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
            <div className="text-sm break-words">{file.name}</div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={requestSummary}
          className="flex-1 bg-zinc-600 hover:bg-zinc-500 text-zinc-200 px-4 py-2 rounded-md transition duration-200 ease-in-out"
          disabled={files.length === 0 || isSummarizing}
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
          className="w-full bg-zinc-600 hover:bg-zinc-500 text-zinc-200 px-4 py-2 rounded-md transition duration-200 ease-in-out"
        >
          {showSummary ? "Hide Summary" : "Show Summary"}
        </button>
      )}

      {showSummary && summary && (
        <div className="mt-4 p-4 bg-zinc-800 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-zinc-200">Summary</h3>
          <textarea
            className="w-full h-64 p-2 border rounded-md bg-zinc-700 text-zinc-300"
            value={summary}
            readOnly
          />
          <div className="mt-2 space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(summary)}
              className="bg-zinc-600 hover:bg-zinc-500 text-zinc-200 px-3 py-1 rounded-md"
            >
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([summary], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "summary.txt";
                a.click();
              }}
              className="bg-zinc-600 hover:bg-zinc-500 text-zinc-200 px-3 py-1 rounded-md"
            >
              Save as File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
