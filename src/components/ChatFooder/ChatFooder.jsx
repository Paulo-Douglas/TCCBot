"use client";
import { Send } from "lucide-react";
import { useState } from "react";
import { Arimo } from "next/font/google";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400"],
});

export default function ChatFooter({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  };

  const isEmpty = message.trim().length === 0;

  return (
    <footer className="flex flex-col items-start gap-3 border-t border-[#1E2939] bg-[#0E1117] px-6 pt-4 pb-3 h-[100px]">
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center justify-center gap-2 selection:bg-[#364153] selection:text-white"
      >
        <input
          type="text"
          placeholder="Digite sua pergunta sobre TCCs..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex w-7xl h-9 items-center rounded-[14px] border border-[#364153] bg-[#101828] px-3 py-1 text-white placeholder-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#4B5563] selection:bg-[#364153] selection:text-white"
        />

        <button
          type="submit"
          disabled={isEmpty}
          className={`flex items-center justify-center h-9 w-9 rounded-xl transition selection:bg-[#364153] selection:text-white ${
            isEmpty
              ? "bg-[#1B2029] text-gray-500 cursor-not-allowed"
              : "bg-[#364153] hover:bg-[#4B5563] text-white"
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      <p
        className={`flex h-4 items-start self-stretch justify-center text-center text-[#4A5565] text-[12px] leading-4 ${arimo.className}`}
      >
        Pressione <span className="mx-1 text-[#6A7282]">Enter</span> para enviar
        • Este é um assistente experimental
      </p>
    </footer>
  );
}
