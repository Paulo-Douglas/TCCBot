import { GraduationCap, Sparkles } from "lucide-react";
import { Arimo } from "next/font/google";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400"],
});

export default function ChatHeader() {
  return (
    <header
      className="bg-[#0E1117] h-16 w-full px-6 gap-3 flex justify-between items-center border-b border-[#1E2939]"
    >
      <div className="flex gap-4">
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-[#1E2939]">
          <GraduationCap className="text-white h-6 w-6" />
        </div>
        <div className="flex h-10 flex-col items-start">
          <h2
            className={`${arimo.className} text-[#F3F4F6] text-[16px] leading-6 font-normal`}
          >
            Assistente de TCCs UFRN
          </h2>
          <p
            className={`${arimo.className} text-[#99A1AF] text-[12px] leading-4 font-normal`}
          >
            Pesquise trabalhos de conclusão de curso
          </p>
        </div>
      </div>

      <Sparkles className="text-white h-5 w-5" />
    </header>
  );
}
