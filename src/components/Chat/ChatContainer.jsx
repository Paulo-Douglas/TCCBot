"use client";
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import WelcomeMessage from "./WelcomeMessage";

export default function ChatContainer({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4">
      <div className="max-w-4xl mx-auto">
        {!messages.length && !isLoading && <WelcomeMessage />}

        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
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