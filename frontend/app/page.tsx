import React from 'react';
import Head from 'next/head';
import FileUpload from '../components/uploader';
import Chatbox from '@/components/chatbox';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>File Upload</title>
      </Head>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Upload Files</h1>
        <FileUpload />
        <Chatbox />
      </main>
    </div>
  );
}

export default Home;