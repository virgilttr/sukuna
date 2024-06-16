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
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium">Findevor</h3>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <XIcon className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
      </header>
      <ScrollArea className="flex-1 p-4 overflow-auto">
        <div className="grid gap-4">
          {messages.map(message => (
            <div key={message.id} className={`flex flex-col items-start gap-3 ${message.sender === 'ai' ? 'items-end' : ''}`}>
              <div className={`rounded-lg p-3 max-w-[80%] ${message.sender === 'ai' ? 'bg-blue-600' : 'bg-gray-800'}`}>
                <p>{message.text}</p>
                {message.citation && <p className="text-gray-400 text-xs">{message.citation}</p>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-800">
        <Textarea
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 border-none focus:ring-0 resize-none"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button onClick={handleSubmit}>
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