import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2";

/**
 * Gera embeddings para um texto usando o modelo do Hugging Face
 * @param {string} text - Texto para gerar embedding
 * @returns {Promise<number[]>} Array com o embedding
 */
export async function generateEmbedding(text) {
  try {
    const response = await hf.featureExtraction({
      model: MODEL_NAME,
      inputs: text,
    });

    return Array.isArray(response) ? response : Array.from(response);
  } catch (error) {
    console.error("Erro ao gerar embedding:", error);
    throw new Error("Falha ao gerar embedding do texto");
  }
}