// app/api/chat/route.js
import { NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/rag/embeddings";
import { searchSimilar } from "@/lib/rag/qdrant";
import { buildContext } from "@/lib/rag/context";
import { generateResponse, generateResponseStream } from "@/lib/rag/llm";

/**
 * API Route para o chatbot
 * Orquestra todo o pipeline RAG:
 * 1. Recebe mensagem do usuário
 * 2. Gera embedding da mensagem
 * 3. Busca TCCs similares no Qdrant
 * 4. Monta contexto
 * 5. Envia para LLM
 * 6. Retorna resposta
 */
export async function POST(request) {
  try {
    const { message, stream = false } = await request.json();

    // Validação
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Mensagem inválida" },
        { status: 400 }
      );
    }

    const question = message.trim();

    console.log("1. Gerando embedding da pergunta...");
    const embedding = await generateEmbedding(question);

    console.log("2. Buscando TCCs similares...");
    const docs = await searchSimilar(embedding, 5);

    console.log("3. Montando contexto...");
    const context = buildContext(question, docs);

    console.log("4. Gerando resposta...");

    // Se for streaming, retorna um ReadableStream
    if (stream) {
      const responseStream = await generateResponseStream(context);
      
      // Cria um ReadableStream para o cliente
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of responseStream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Resposta normal (sem streaming)
    const response = await generateResponse(context);

    return NextResponse.json({
      response: response,
      documents: docs.map(doc => ({
        title: doc.title,
        author: doc.author,
        course: doc.course,
        url: doc.url,
        score: doc.score,
      })),
      success: true,
      metadata: {
        docsFound: docs.length,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error("Erro na API de chat:", error);
    
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

// Endpoint de health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Ceres TCC AI",
    timestamp: new Date().toISOString(),
  });
}