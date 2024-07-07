"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [uploadPrefix, setUploadPrefix] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setUploadPrefix(
      `upload_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    );
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  //TODO: Validate 1. Maximum 5 documents 2. Maximum document size 3. documents formats 4. Documents naming
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

  const uploadFiles = async () => {
    const uploadProgress: { [key: string]: number } = {};
    files.forEach((file) => {
      uploadProgress[file.name] = 0;
    });
    setProgress(uploadProgress);
    const promises = files.map((file) => uploadFile(file));
    await Promise.all(promises);
    setUploadComplete(true);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prefix", uploadPrefix);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress((prevProgress) => ({
          ...prevProgress,
          [file.name]: Math.round((100 * event.loaded) / event.total),
        }));
      }
    };
    xhr.send(formData);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full text-zinc-300"
        accept=".pdf,.txt,.xlsx"
      />
      <div className="flex space-x-2">
        <button
          onClick={uploadFiles}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-md transition duration-200 ease-in-out"
          disabled={files.length === 0}
        >
          {files.length > 0
            ? `Upload ${files.length} file${files.length > 1 ? "s" : ""}`
            : "Select files to upload"}
        </button>
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

      {files.map((file) => (
        <div key={file.name} className="text-zinc-300">
          <span>{file.name}</span>
          <div className="w-full bg-zinc-700 h-2 rounded-full mt-1">
            <div
              className="bg-zinc-400 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress[file.name] || 0}%` }}
            />
          </div>
        </div>
      ))}

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
