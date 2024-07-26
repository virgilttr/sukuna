import React from "react";
import Head from "next/head";
import FileUpload from "../components/uploader";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <Head>
        <title>AI Orchestration Panel</title>
      </Head>
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-zinc-100">
          Findevor AI Assistant
        </h1>
        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-100">
              Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-lg">
              <li>
                Select the files you would like to use for your report below
                (word, PDF, excel).
              </li>
              <li>
                Generate your property report based on the provided documents.
              </li>
            </ol>
          </div>
          <div className="bg-zinc-900 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-zinc-100">
              File Upload
            </h2>
            <FileUpload />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
