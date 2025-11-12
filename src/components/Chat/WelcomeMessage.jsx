import { GraduationCap } from "lucide-react";
import { Arimo } from "next/font/google";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
      {/* Ícone */}
      <div className="w-16 h-16 rounded-full bg-[#1E2939] flex items-center justify-center">
        <GraduationCap className="w-8 h-8 text-white" />
      </div>

      {/* Título */}
      <div className="text-center max-w-md">
        <h1
          className={`${arimo.className} text-2xl font-semibold text-white mb-2`}
        >
          Olá! Sou o assistente de TCCs da UFRN
        </h1>
        <p className={`${arimo.className} text-[#99A1AF] text-sm`}>
          Como posso ajudá-lo hoje? Você pode me perguntar sobre trabalhos de conclusão de curso, pesquisar por temas, autores ou orientadores.
        </p>
      </div>
    </div>
  );
}