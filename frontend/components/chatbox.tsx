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
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px]">
      <header className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-medium">Findevor AI</h3>
        </div>
      </header>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`rounded-lg p-2 max-w-[80%] text-sm ${message.sender === 'ai' ? 'bg-zinc-800' : 'bg-zinc-700'}`}>
                <p>{message.text}</p>
                {message.citation && <p className="mt-1 text-xs text-zinc-400">{message.citation}</p>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2 p-2 bg-zinc-800 border-t border-zinc-700">
        <Textarea
          placeholder="Type your message..."
          className="flex-1 bg-zinc-700 border-none focus:ring-0 resize-none text-sm min-h-[2.5rem] max-h-[5rem]"
          value={inputValue}
          onChange={handleInputChange}
          rows={1}
        />
        <Button onClick={handleSubmit} size="sm" className="bg-zinc-700 hover:bg-zinc-600">
          <SendIcon className="w-4 h-4" />
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