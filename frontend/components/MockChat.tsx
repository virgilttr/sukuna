import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MockChatProps {
  isVisible: boolean;
}

const mockConversation: Message[] = [
  {
    role: "user",
    content: "What are the main risks associated with this property?",
  },
  {
    role: "assistant",
    content:
      "Based on the provided documents, the main risks associated with this property are:\n\n1. Fire damage: There was a recent incident of fire damage in the server room due to faulty wiring [1].\n2. Water damage: A burst pipe affected multiple floors, indicating potential plumbing issues [1].\n3. Theft: High-value tech equipment was stolen from a secure room, suggesting security vulnerabilities [1].\n4. Structural damage: The facade suffered windstorm damage, which could be a recurring risk due to the building's location [1].\n5. Explosion risk: An incident involving a backup generator caused extensive damage to the mechanical room [1].\n6. Flooding: The property's location near a river presents a flooding risk that has affected lower levels and electrical systems in the past [2].\n\nSources:\n[1] Loss Run Report\n[2] Environmental Report",
  },
  {
    role: "user",
    content: "How does the building's construction affect its insurability?",
  },
  {
    role: "assistant",
    content:
      "The building's construction plays a significant role in its insurability. Here's how it affects the risk profile:\n\n1. Modern construction: Built in 2020, the Empire Tech Tower uses contemporary building techniques and materials, which generally improve its insurability [1].\n2. Materials: The building is made of steel and glass with reinforced concrete foundations. These materials are typically fire-resistant and durable, which is favorable for insurance [2].\n3. Structural integrity: Despite the modern construction, there have been incidents of fire and windstorm damage, which may indicate some vulnerabilities in the structure [2].\n4. Height: As a 25-story building, it may have additional risks associated with high-rise structures, such as more complex evacuation procedures and potential for greater damage in case of a fire [1].\n5. Tech infrastructure: The building houses high-value equipment and data servers, which may require specialized insurance coverage [3].\n\nOverall, while the modern construction and materials are positive factors, the reported incidents and the building's specific use may require careful consideration in the underwriting process.\n\nSources:\n[1] Property Overview\n[2] Inspection Report\n[3] Lease Agreement",
  },
];

const MockChat: React.FC<MockChatProps> = ({ isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mockConversation);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isVisible) {
      setIsOpen(true);
    }
  }, [isVisible]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { role: "user", content: newMessage }]);
      setNewMessage("");
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I apologize, but I don't have enough context to provide a specific answer to your question. Could you please provide more details or ask about something mentioned in the previous conversation? I'd be happy to assist you based on the information we have discussed.",
          },
        ]);
      }, 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 right-0 w-96 bg-gray-800 text-white shadow-lg rounded-t-lg overflow-hidden">
      <div
        className="bg-blue-600 p-2 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Chat about your documents</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>
      {isOpen && (
        <div className="h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 p-2 rounded-lg ${
                    message.role === "user" ? "bg-blue-500" : "bg-gray-700"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-700 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-600 text-white p-2 rounded-l-md focus:outline-none"
            />
            <button type="submit" className="bg-blue-500 p-2 rounded-r-md">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MockChat;
