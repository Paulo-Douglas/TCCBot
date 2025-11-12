// lib/rag/context.js

/**
 * Monta o contexto para a LLM com os TCCs encontrados
 * @param {string} question - Pergunta do usuário
 * @param {Array} docs - Documentos retornados do Qdrant
 * @returns {string} - Contexto formatado para a LLM
 */
export function buildContext(question, docs) {
  if (!docs || docs.length === 0) {
    return `Pergunta: "${question}"\n\nNenhum TCC relevante encontrado.`;
  }

  let contextText = `PERGUNTA DO USUÁRIO: "${question}"\n\n`;
  contextText += `=== TCCs ENCONTRADOS (${docs.length}) ===\n\n`;

  docs.forEach((doc, index) => {
    const scorePercent = (doc.score * 100).toFixed(1);
    
    contextText += `TCC ${index + 1}:\n`;
    contextText += `Título: ${doc.title}\n`;
    contextText += `Autor: ${doc.author}\n`;
    contextText += `Curso: ${doc.course}\n`;
    contextText += `Resumo: ${doc.abstract}\n`;
    contextText += `Link: ${doc.url}\n`;
    contextText += `Relevância: ${scorePercent}%\n\n`;
  });

  contextText += `=== INSTRUÇÕES ===\n`;
  contextText += `1. Faça uma introdução breve sobre o tema da pergunta\n`;
  contextText += `2. Para cada TCC relevante, explique o que ele faz usando o RESUMO fornecido\n`;
  contextText += `3. No final, liste todos os TCCs no formato:\n`;
  contextText += `   • Título - Autor - Curso - Link\n\n`;
  contextText += `Seja didático e objetivo. Use linguagem acadêmica mas acessível.`;

  return contextText;
}