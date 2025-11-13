import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/rag/embeddings";
import { searchSimilar } from "@/lib/rag/qdrant";
import { buildContext } from "@/lib/rag/context";
import { generateResponseStream } from "@/lib/rag/llm";

export async function POST(request) {
  try {
    const { message, stream = false } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mensagem inválida" },
        { status: 400 }
      );
    }

    const question = message.trim();
    
    const embedding = await generateEmbedding(question);
    const docs = await searchSimilar(embedding, 5);
    const context = buildContext(question, docs);

    if (stream) {
      const responseStream = await generateResponseStream(context);
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // PRIMEIRO: Envia os documentos como evento SSE
            const docsData = {
              type: "documents",
              data: docs.map(doc => ({
                title: doc.title,
                author: doc.author,
                advisor: doc.advisor || null,
                course: doc.course,
                url: doc.url,
                abstract: doc.abstract,
                score: doc.score,
              }))
            };
            
            const sseMessage = `event: documents\ndata: ${JSON.stringify(docsData)}\n\n`;
            controller.enqueue(encoder.encode(sseMessage));
            
            // DEPOIS: Envia o texto em streaming
            for await (const chunk of responseStream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                const textMessage = `event: text\ndata: ${JSON.stringify({ text })}\n\n`;
                controller.enqueue(encoder.encode(textMessage));
              }
            }
            
            // Finaliza
            controller.enqueue(encoder.encode("event: done\ndata: {}\n\n"));
            controller.close();
          } catch (error) {
            console.error("Erro no streaming:", error);
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    return NextResponse.json({ error: "Stream não habilitado" }, { status: 400 });

  } catch (error) {
    console.error("Erro na API:", error.message);
    
    return NextResponse.json(
      { 
        error: "Erro ao processar mensagem",
        message: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Ceres TCC AI",
    timestamp: new Date().toISOString(),
  });
}