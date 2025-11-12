"use client";
import { useState } from "react";
import ChatContainer from "@/components/Chat/ChatContainer";
import ChatFooter from "@/components/ChatFooder/ChatFooder";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Envia mensagem COM streaming (resposta aparece aos poucos)
   */
  const handleSend = async (msg) => {
    const userMessage = { 
      id: Date.now(), 
      text: msg, 
      sender: "user" 
    };
    setMessages((prev) => [...prev, userMessage]);
    
    const botMessageId = Date.now() + 1;
    setMessages((prev) => [...prev, { 
      id: botMessageId,
      text: "", 
      sender: "bot" 
    }]);
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: msg,
          stream: true
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Lê o stream chunk por chunk
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const text = decoder.decode(value);
        
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage.id === botMessageId) {
            lastMessage.text += text;
          }
          
          return newMessages;
        });
      }
      
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (lastMessage.id === botMessageId) {
          lastMessage.text = "Desculpe, ocorreu um erro. Tente novamente.";
        }
        
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContainer messages={messages} isLoading={isLoading} />
      <ChatFooter onSend={handleSend} />
    </div>
  );
}