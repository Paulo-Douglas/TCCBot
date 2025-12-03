import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

/**
 * Realiza busca semântica no Qdrant
 */
export async function searchSimilar(embedding, limit = 5) {
  try {
    const results = await client.search(COLLECTION_NAME, {
      vector: embedding,
      limit,
      with_payload: true,
      with_vector: false,
    });

    return results.map(({ id, score, payload }) => ({
      id,
      score,
      title: payload.titulo || "Sem título",
      abstract: payload.resumo || "Sem resumo",
      url: payload.uri || "Sem link",
      author: payload.autor || "Sem autor",
      advisor: payload.orientador || null,
      course: payload.curso || "Sem curso",
    }));
  } catch (error) {
    console.error("Erro ao buscar no Qdrant:", error);
    throw new Error("Falha na busca semântica");
  }
}