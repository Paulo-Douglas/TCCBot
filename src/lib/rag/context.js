/**
 * Monta o contexto para a LLM com os TCCs encontrados
 */
export function buildContext(question, docs) {
  if (!docs?.length) {
    return `Pergunta: "${question}"\n\nNenhum TCC relevante encontrado.`;
  }

  const tccList = docs
    .map((doc, i) => {
      const score = (doc.score * 100).toFixed(1);
      return `
TCC ${i + 1}:
Título: ${doc.title}
Autor: ${doc.author}
Curso: ${doc.course}
Resumo: ${doc.abstract}
Link: ${doc.url}
Relevância: ${score}%
`.trim();
    })
    .join("\n\n");

  return `PERGUNTA DO USUÁRIO: "${question}"

=== TCCs ENCONTRADOS (${docs.length}) ===

${tccList}

=== INSTRUÇÕES ===
1. Faça uma introdução breve sobre o tema da pergunta
2. Para cada TCC relevante, explique o que ele faz usando o RESUMO fornecido
3. No final, liste todos os TCCs no formato:
   • Título - Autor - Curso - Link

Seja didático e objetivo. Use linguagem acadêmica mas acessível.`;
}
