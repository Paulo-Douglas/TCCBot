"use client";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import WelcomeMessage from "./WelcomeMessage";

export default function ChatContainer({ messages, isLoading }) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-[#364153] scrollbar-track-transparent hover:scrollbar-thumb-[#4B5563]"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#364153 transparent'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Mensagem de boas-vindas quando não há mensagens */}
        {messages.length === 0 && !isLoading && <WelcomeMessage />}

        {/* Lista de mensagens */}
        <div className="flex flex-col gap-6">
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id || index}
              message={msg.text}
              isUser={msg.sender === "user"}
              documents={msg.documents}
            />
          ))}

          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}