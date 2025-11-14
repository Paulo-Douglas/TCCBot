"use client";
import { useState } from "react";
import ChatContainer from "@/components/Chat/ChatContainer";
import ChatFooter from "@/components/ChatFooder/ChatFooder";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (msg) => {
    const userMessage = { 
      id: Date.now(), 
      text: msg, 
      sender: "user" 
    };
    setMessages((prev) => [...prev, userMessage]);
    
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

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Resposta vazia do servidor");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const botMessageId = Date.now() + 1;
      let fullText = "";
      let documents = null;
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Processa eventos SSE completos
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (!line.trim()) continue;
          
          const eventMatch = line.match(/event: (\w+)\ndata: (.+)/);
          if (eventMatch) {
            const [, eventType, data] = eventMatch;
            
            console.log("📡 Evento:", eventType);
            
            if (eventType === "documents") {
              try {
                const parsed = JSON.parse(data);
                documents = parsed.data;
              } catch (e) {
                console.error("Erro ao parsear documentos:", e);
              }
            } else if (eventType === "text") {
              try {
                const parsed = JSON.parse(data);
                fullText += parsed.text;
              } catch (e) {
                console.error("Erro ao parsear texto:", e);
              }
            }
          }
        }
        
        setMessages((prev) => {
          const newMessages = [...prev];
          const botIndex = newMessages.findIndex(m => m.id === botMessageId);
          
          if (botIndex === -1) {
            newMessages.push({
              id: botMessageId,
              text: fullText,
              sender: "bot",
              documents: documents
            });
          } else {
            newMessages[botIndex].text = fullText;
            if (documents) {
              newMessages[botIndex].documents = documents;
            }
          }
          
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Erro no chat:", error.message);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
          sender: "bot"
        }
      ]);
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
