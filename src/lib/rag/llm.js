import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.1-8b-instant";

/**
 * Gera resposta usando a LLM do Groq com contexto
 * @param {string} context - Contexto formatado com documentos e pergunta
 * @returns {Promise<string>} Resposta gerada
 */
export async function generateResponse(context) {
  try {
    const systemPrompt = `Você é um assistente de TCCs da UFRN. 

Sua resposta deve ter EXATAMENTE esta estrutura:

1. Um parágrafo introdutório sobre o tema pesquisado
2. Para cada TCC relevante, um parágrafo explicando o que ele faz (baseado no resumo)
3. NO FINAL, liste os TCCs no formato:
   • Título do TCC - Autor(a) - Curso - Link

Seja objetivo, acadêmico e didático. Use os resumos para explicar cada trabalho.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: context,
        },
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 512, // ⚡ Reduzido de 1024 para 512 (respostas mais curtas e rápidas)
      top_p: 1,
    });

    return completion.choices[0]?.message?.content || "Não foi possível gerar uma resposta.";
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    throw new Error("Falha ao gerar resposta da LLM");
  }
}

/**
 * Gera resposta com streaming (respostas em tempo real, palavra por palavra)
 * @param {string} context - Contexto formatado
 * @returns {Promise<AsyncIterable>} Stream de resposta
 */
export async function generateResponseStream(context) {
  try {
    const systemPrompt = `Você é um assistente especializado em trabalhos de conclusão de curso (TCCs) da UFRN.
Sua função é ajudar estudantes e pesquisadores a encontrar informações relevantes sobre TCCs.

Sempre responda em português de forma clara, objetiva e acadêmica.
Se não houver documentos relevantes, informe isso educadamente.
Sempre cite os trabalhos utilizados ao final da resposta.`;

    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
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
      stream: true, // <- Isso ativa o streaming
    });

    return stream;
  } catch (error) {
    console.error("Erro ao gerar resposta em stream:", error);
    throw new Error("Falha ao gerar resposta da LLM");
  }
}