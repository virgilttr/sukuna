"use client"
import React, { useState } from 'react';
import { FileInput } from "@/components/ui/input"  // Update the import path as needed

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  const handleFileChange = (fileList: FileList | null) => {
    if (fileList) {
      setFiles(Array.from(fileList));
    }
  };

  const uploadFiles = async () => {
    // ... (rest of the uploadFiles function remains the same)
  };

  const uploadFile = async (file: File) => {
    // ... (rest of the uploadFile function remains the same)
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
      {uploadComplete && (
        <div className="mt-4 text-green-500">
          All files have been successfully uploaded! Please ask your questions to the AI now
        </div>
      )}
    </div>
  );
};

export default FileUpload;