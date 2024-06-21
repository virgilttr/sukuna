"use client"

import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  citation?: string;
  citation_link?: string;
}

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, userMessage]); // Ensure message is added immediately

    try {
      const response = await fetch('/api/bedrock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue })
      });

      const data = await response.json();
      console.log(data);
      if (data.output) {
        const aiMessage: Message = {
          id: messages.length + 2,
          text: data.output.text,
          sender: 'ai',
          citation: data.markdownCitations
        };

        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        console.log('No output from AI');
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }

    setInputValue(''); // Clear input after sending
  };

  return (
    <div className="flex flex-col h-screen bg-black text-gray-300">
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-zinc-700">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-zinc-800 text-zinc-400">AI</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-semibold text-zinc-300">Findevor</h3>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
          <XIcon className="w-6 h-6" />
          <span className="sr-only">Close</span>
        </Button>
      </header>
      <ScrollArea className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`rounded-lg p-4 max-w-[70%] ${message.sender === 'ai' ? 'bg-zinc-900' : 'bg-zinc-800'}`}>
                <p className="text-sm">{message.text}</p>
                {message.citation && <p className="mt-2 text-xs text-zinc-500">{message.citation}</p>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-4 px-6 py-4 bg-zinc-950 border-t border-zinc-800">
        <Textarea
          placeholder="Type your message..."
          className="flex-1 bg-zinc-900 border-zinc-700 focus:border-zinc-600 focus:ring focus:ring-zinc-700 focus:ring-opacity-50 rounded-lg resize-none text-zinc-300 placeholder-zinc-600"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button onClick={handleSubmit} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full p-3">
          <SendIcon className="w-5 h-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>  
);  
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}