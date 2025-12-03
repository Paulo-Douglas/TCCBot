"use client";
import { useChat } from "ai/react";
import ChatContainer from "@/components/Chat/ChatContainer";
import ChatFooter from "@/components/ChatFooder/ChatFooder";
import { useMemo } from "react";

export default function ChatPage() {
  const { messages, input, setInput, handleSubmit, isLoading, data } = useChat({
    api: "/api/chat",
  });

  // Mapeia documentos para mensagens
  const messagesWithDocs = useMemo(() => {
    const docsMap = new Map();
    
    // Constrói mapa de documentos
    data?.forEach((item) => {
      if (item?.documents) {
        const assistantMsg = messages
          .slice()
          .reverse()
          .find((m) => m.role === "assistant");
        
        if (assistantMsg) {
          docsMap.set(assistantMsg.id, item.documents);
        }
      }
    });

    // Formata mensagens
    return messages.map((msg) => ({
      id: msg.id,
      text: msg.content,
      sender: msg.role === "user" ? "user" : "bot",
      documents: msg.role === "assistant" ? docsMap.get(msg.id) : undefined,
    }));
  }, [messages, data]);

  const handleSend = (message) => {
    setInput(message);
    // Aguarda input ser atualizado antes de submeter
    setTimeout(() => {
      const event = new Event("submit", { cancelable: true, bubbles: true });
      handleSubmit(event);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContainer messages={messagesWithDocs} isLoading={isLoading} />
      <ChatFooter onSend={handleSend} />
    </div>
  );
}