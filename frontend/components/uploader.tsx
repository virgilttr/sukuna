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
    setUploadComplete(true); // Set uploadComplete to true after all files are uploaded
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
    <div>
      <Input type="file" multiple onChange={handleFileChange} className="mb-4" />
      <button onClick={uploadFiles} className="bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
      {files.map(file => (
        <div key={file.name}>
          <span>{file.name}</span>
          <progress value={progress[file.name] || 0} max="100">{progress[file.name] || 0}%</progress>
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