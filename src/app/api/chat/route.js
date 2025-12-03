import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { generateEmbedding } from "@/lib/rag/embeddings";
import { searchSimilar } from "@/lib/rag/qdrant";
import { buildContext } from "@/lib/rag/context";

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT = `Você é um assistente especializado em trabalhos de conclusão de curso (TCCs) da UFRN.

Sua resposta deve ter EXATAMENTE esta estrutura:

1. Um parágrafo introdutório sobre o tema pesquisado
2. Para cada TCC relevante, um parágrafo explicando o que ele faz (baseado no resumo)

Seja objetivo, acadêmico e didático. Use os resumos para explicar cada trabalho.
Sempre responda em português de forma clara e profissional.`;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    // Validação
    if (!messages?.length) {
      return Response.json({ error: "Mensagens inválidas" }, { status: 400 });
    }

    // Busca semântica
    const lastMessage = messages[messages.length - 1];
    const embedding = await generateEmbedding(lastMessage.content);
    const docs = await searchSimilar(embedding, 5);
    
    // Enriquece o contexto
    const enrichedMessages = [
      ...messages.slice(0, -1),
      {
        role: "user",
        content: buildContext(lastMessage.content, docs),
      },
    ];

    // Stream com AI SDK
    const result = streamText({
      model: groq("llama-3.1-8b-instant"),
      system: SYSTEM_PROMPT,
      messages: enrichedMessages,
      temperature: 0.7,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse({
      data: { documents: docs },
    });
  } catch (error) {
    console.error("Erro na API:", error);
    return Response.json(
      { error: "Erro ao processar mensagem" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    service: "Ceres TCC AI",
    timestamp: new Date().toISOString(),
  });
}