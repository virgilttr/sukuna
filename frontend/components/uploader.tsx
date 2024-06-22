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