import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `Você é um assistente especializado em trabalhos de conclusão de curso (TCCs) da UFRN.

Sua resposta deve ter EXATAMENTE esta estrutura:

1. Um parágrafo introdutório sobre o tema pesquisado
2. Para cada TCC relevante, um parágrafo explicando o que ele faz (baseado no resumo)

Seja objetivo, acadêmico e didático. Use os resumos para explicar cada trabalho.
Sempre responda em português de forma clara e profissional.`;

/**
 * Gera resposta usando a LLM do Groq com contexto
 * @param {string} context - Contexto formatado com documentos e pergunta
 * @returns {Promise<string>} Resposta gerada
 */
export async function generateResponse(context) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: context,
        },
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
    });

    return completion.choices[0]?.message?.content || "Não foi possível gerar uma resposta.";
  } catch (error) {
    console.error("Erro ao gerar resposta:", error.message);
    throw new Error("Falha ao gerar resposta da LLM");
  }
}

/**
 * Gera resposta com streaming (respostas em tempo real)
 * @param {string} context - Contexto formatado
 * @returns {Promise<AsyncIterable>} Stream de resposta
 */
export async function generateResponseStream(context) {
  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: context,
        },
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error("Erro ao gerar resposta em stream:", error.message);
    throw new Error("Falha ao gerar resposta da LLM");
  }
}