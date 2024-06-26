"use client"
import React, { useState } from 'react';
import { FileInput } from "@/components/ui/input"  // Update the import path as needed
import Link from 'next/link';


const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [summaryUrl, setSummaryUrl] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const handleFileChange = (fileList: FileList | null) => {
    if (fileList) {
      setFiles(Array.from(fileList));
    }
  };

  const requestSummary = async () => {
    setIsSummarizing(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: files.map(f => f.name) }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummaryUrl(data.summaryUrl);
    } catch (error) {
      console.error('Error generating summary:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsSummarizing(false);
    }
  };

  const uploadFiles = async () => {
    const uploadProgress: { [key: string]: number } = {};
    files.forEach(file => {
      uploadProgress[file.name] = 0;
    });
    setProgress(uploadProgress);
    const promises = files.map(file => uploadFile(file));
    await Promise.all(promises);
    setUploadComplete(true);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(prevProgress => ({
          ...prevProgress,
          [file.name]: Math.round((100 * event.loaded) / event.total),
        }));
      }
    };
    xhr.send(formData);
  };
  
  return (
    <div className="space-y-4">
      <FileInput 
        multiple 
        onFileChange={handleFileChange}
        id="file-upload"
        accept=".pdf,.txt"  // Specify accepted file types
      />
      <button 
        onClick={uploadFiles} 
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-md transition duration-200 ease-in-out"
        disabled={files.length === 0}
      >
        {files.length > 0 ? `Upload ${files.length} file${files.length > 1 ? 's' : ''}` : 'Select files to upload'}
      </button>
      {uploadComplete && (
        <button
          onClick={requestSummary}
          className="w-full bg-zinc-600 hover:bg-zinc-500 text-zinc-200 px-4 py-2 rounded-md transition duration-200 ease-in-out"
          disabled={isSummarizing}
        >
          {isSummarizing ? 'Generating Summary...' : 'Generate Summary'}
        </button>
      )}
      
      {summaryUrl && (
        <Link
          href={summaryUrl}
          className="block w-full text-center bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
        >
          Download Summary
        </Link>
      )}      
      {files.map(file => (
        <div key={file.name} className="text-zinc-300">
          <span>{file.name}</span>
          <div className="w-full bg-zinc-700 h-2 rounded-full mt-1">
            <div 
              className="bg-zinc-400 h-2 rounded-full transition-all duration-300 ease-in-out" 
              style={{width: `${progress[file.name] || 0}%`}}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileUpload;