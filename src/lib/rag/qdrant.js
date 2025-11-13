import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

/**
 * Realiza busca semântica no Qdrant
 * @param {number[]} embedding - Embedding da query
 * @param {number} limit - Número de resultados
 * @returns {Promise<Array>} Resultados da busca
 */
export async function searchSimilar(embedding, limit = 5) {
  try {
    const searchResult = await client.search(COLLECTION_NAME, {
      vector: embedding,
      limit: limit,
      with_payload: true,
      with_vector: false,
    });

    return searchResult.map(result => ({
      id: result.id,
      score: result.score,
      title: result.payload.titulo || "Sem título",
      abstract: result.payload.resumo || "Sem resumo",
      url: result.payload.uri || "Sem link",
      author: result.payload.autor || "Sem autor",
      advisor: result.payload.orientador || null, 
      course: result.payload.curso || "Sem curso",
    }));
  } catch (error) {
    console.error("Erro ao buscar no Qdrant:", error);
    throw new Error("Falha na busca semântica");
  }
}