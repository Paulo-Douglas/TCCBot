import ChatHeader from "@/components/ChatHeader/ChatHeader";
import "./globals.css";

export const metadata = {
  title: "Ceres TCC AI",
  description: "Assistente de TCCs da UFRN",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-[#0E1117] text-white">
        <div className="fixed top-0 left-0 right-0 z-50">
          <ChatHeader />
        </div>

        <main className="pt-16 h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}