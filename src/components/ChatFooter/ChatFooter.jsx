"use client";
import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { Arimo } from "next/font/google";

const arimo = Arimo({ subsets: ["latin"], weight: ["400"] });

export default function ChatFooter({ onSend, isLoading = false }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    
    if (!trimmed || isLoading) return;
    
    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    // Envia com Enter (sem Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = !message.trim() || isLoading;

  return (
    <footer className="flex flex-col items-start gap-3 border-t border-[#1E2939] bg-[#0E1117] px-6 pt-4 pb-3">
      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <input
          type="text"
          placeholder={isLoading ? "Aguarde a resposta..." : "Digite sua pergunta sobre TCCs..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={`flex-1 h-9 rounded-[14px] border border-[#364153] bg-[#101828] px-3 py-1 text-white placeholder-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#4B5563] transition-opacity ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          autoFocus
          maxLength={500}
        />

        <button
          type="submit"
          disabled={isDisabled}
          className={`flex items-center justify-center h-9 w-9 rounded-xl transition ${
            isDisabled
              ? "bg-[#1B2029] text-gray-500 cursor-not-allowed"
              : "bg-[#364153] hover:bg-[#4B5563] text-white"
          }`}
          aria-label="Enviar mensagem"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>

      <p className={`text-center w-full text-[#4A5565] text-[12px] ${arimo.className}`}>
        Pressione <span className="text-[#6A7282]">Enter</span> para enviar • 
        {isLoading ? " Processando..." : " Este é um assistente experimental"}
      </p>
    </footer>
  );
}