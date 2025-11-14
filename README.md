# Ceres TCC AI 🎓

Assistente inteligente para pesquisa de TCCs do CERES - UFRN usando RAG (Retrieval-Augmented Generation).

🔗 **[Acesse: tccbot.carcaratech.dev](https://tccbot.carcaratech.dev/)**

## 📋 Sobre

Chatbot especializado que busca e explica trabalhos de conclusão de curso do CERES - UFRN usando busca semântica e IA generativa.

**Principais recursos:**
- 🔍 Busca semântica inteligente
- 💬 Respostas contextualizadas em tempo real
- 📚 Detalhes completos dos TCCs (autor, orientador, resumo)
- ⚡ Interface responsiva com streaming

## 🛠️ Stack

**Frontend:** Next.js 15, React 19, Tailwind CSS 4  
**IA/Backend:** Hugging Face (embeddings), Qdrant (vector DB), Groq/Llama 3.1 (LLM)

## 🚀 Instalação
```bash
# Clone e instale
git clone https://github.com/seu-usuario/ceres-tcc-ai.git
cd ceres-tcc-ai
npm install

# Configure .env.local
HUGGINGFACE_API_KEY=seu_token
QDRANT_URL=sua_url
QDRANT_API_KEY=sua_chave
QDRANT_COLLECTION_NAME=nome_colecao
GROQ_API_KEY=sua_chave

# Execute
npm run dev
```

## 📁 Estrutura
```
src/
├── app/
│   ├── api/chat/route.js    # API do chat
│   └── page.js              # Página principal
├── components/              # Componentes UI
└── lib/rag/                # Pipeline RAG
    ├── embeddings.js       # Geração de embeddings
    ├── qdrant.js          # Busca vetorial
    ├── context.js         # Montagem de contexto
    └── llm.js             # Interface LLM
```

## 🔧 Como Funciona

1. Usuário faz uma pergunta
2. Sistema gera embedding da pergunta
3. Busca TCCs similares no Qdrant
4. Monta contexto com documentos relevantes
5. LLM gera resposta didática
6. Exibe resposta + cards dos TCCs

## 📄 Licença

MIT License
