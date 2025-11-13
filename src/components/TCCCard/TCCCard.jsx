"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, GraduationCap, User, BookOpen } from "lucide-react";

export default function TCCCard({ tcc }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-[#364153] rounded-lg overflow-hidden bg-[#1E2939] hover:border-[#4B5563] transition-colors">
      {/* Header - Sempre visível */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#252F3F] transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <div className="shrink-0 w-8 h-8 rounded-full bg-[#364153] flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white wrap-break-words">
              {tcc.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {tcc.author}
            </p>
          </div>
        </div>
        
        <div className="shrink-0 ml-2">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[#364153] space-y-3">
          {/* Autor */}
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Autor(a)</p>
              <p className="text-sm text-white">{tcc.author}</p>
            </div>
          </div>

          {/* Orientador (se existir) */}
          {tcc.advisor && (
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">Orientador(a)</p>
                <p className="text-sm text-white">{tcc.advisor}</p>
              </div>
            </div>
          )}

          {/* Curso */}
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Curso</p>
              <p className="text-sm text-white">{tcc.course}</p>
            </div>
          </div>

          {/* Resumo (se existir) */}
          {tcc.abstract && (
            <div className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">Resumo</p>
                <p className="text-sm text-gray-300 line-clamp-3">
                  {tcc.abstract}
                </p>
              </div>
            </div>
          )}

          {/* Score (relevância) */}
          {tcc.score && (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-1">Relevância</p>
                <div className="w-full bg-[#364153] rounded-full h-2">
                  <div
                    className="bg-[#5B7C99] h-2 rounded-full transition-all"
                    style={{ width: `${(tcc.score * 100).toFixed(0)}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {(tcc.score * 100).toFixed(0)}%
              </span>
            </div>
          )}

          {/* Link para o repositório */}
          <a
            href={tcc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#364153] hover:bg-[#4B5563] text-white text-sm rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver no Repositório
          </a>
        </div>
      )}
    </div>
  );
}