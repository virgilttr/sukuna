"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input"

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
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
      <Input 
        type="file" 
        multiple 
        onChange={handleFileChange} 
        className="bg-zinc-900 border-zinc-700 text-zinc-300"
      />
      <button 
        onClick={uploadFiles} 
        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-md transition duration-200 ease-in-out"
      >
        Upload
      </button>
      {files.map(file => (
        <div key={file.name} className="text-zinc-300">
          <span>{file.name}</span>
          <progress 
            value={progress[file.name] || 0} 
            max="100" 
            className="w-full h-2 bg-zinc-700"
          >
            {progress[file.name] || 0}%
          </progress>
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