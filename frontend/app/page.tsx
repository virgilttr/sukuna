import React from "react";
import Head from "next/head";
import FileUpload from "../components/uploader";
import Chatbox from "@/components/chatbox";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <Head>
        <title>AI Orchestration Panel</title>
      </Head>
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-zinc-100">
          Findevor AI Assistant
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Instructions and File Upload */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="bg-zinc-900 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-zinc-100">
                Instructions
              </h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Select the files you'd like to use for your report below
                  (word, PDF, excel, pictures).
                </li>
                <li>Wait for the upload to complete.</li>
                <li>Ask your AI assistant questions about your documents.</li>
              </ol>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-zinc-100">
                File Upload
              </h2>
              <FileUpload />
            </div>
          </div>

          {/* Right column: Chatbox */}
          <div className="w-full lg:w-1/2">
            <div className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
              <Chatbox />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
