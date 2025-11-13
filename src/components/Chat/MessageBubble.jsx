import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import TCCCard from "../TCCCard/TCCCard";

export default function MessageBubble({ message, isUser, documents }) {
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-[#364153]" : "bg-[#1E2939]"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className="max-w-[75%] space-y-3">
        {/* Texto da mensagem */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-[#364153] text-white"
              : "bg-[#1E2939] text-gray-200"
          }`}
        >
          {isUser ? (
            // Mensagem do usuário - texto simples
            <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-words">
              {message}
            </p>
          ) : (
            // Mensagem do bot - com formatação markdown
            <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  // Customiza os elementos markdown
                  p: ({ children }) => (
                    <p className="mb-2 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="ml-2">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ inline, children }) => 
                    inline ? (
                      <code className="bg-[#0E1117] px-1.5 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-[#0E1117] p-2 rounded my-2 text-sm overflow-x-auto">
                        {children}
                      </code>
                    ),
                  h1: ({ children }) => (
                    <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#364153] pl-3 my-2 italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Cards de TCCs - apenas para mensagens do bot */}
        {!isUser && documents && documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <TCCCard key={index} tcc={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}