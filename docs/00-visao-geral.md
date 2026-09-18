# 00 · Visão geral do projeto (hands-on)

> "Vestido Aurora": um **RAG** que conhece os documentos da marca e um sistema com
> **5 agentes** que coordena ferramentas, terminando com **imagem e vídeo do Vestido Aurora gerados de verdade**.

## Formato

## O que vamos construir

O mesmo cenário dos slides, mas com APIs reais por baixo:

```
USUÁRIO ──> Orchestrator Agent
                ├─ delega -> Knowledge Agent -> search_knowledge(query)  -> RAG
                ├─ delega -> Image Agent     -> generate_image(prompt)   -> Image Service -> Atlas Cloud
                ├─ delega -> Video Agent     -> generate_video(image_url) -> Video Service -> Atlas Cloud
                └─ delega -> Caption Agent   -> add_caption(video_url)   -> Caption Service local
```

Mensagem que precisa entregar (igual ao deck):
**"O Agent decide. O serviço executa. O Orchestrator coordena."**

Os 5 agentes da demo são:

- `Orchestrator Agent` — entende o objetivo e delega.
- `Knowledge Agent` — consulta o RAG e devolve contexto com fontes.
- `Image Agent` — monta o prompt visual e chama o serviço de imagem.
- `Video Agent` — transforma a imagem em vídeo via Atlas Cloud.
- `Caption Agent` — cria/aplica a legenda via Caption Service local.

## Stack escolhida

**Node.js + TypeScript** — instalação leve (sem PyTorch), mesmo ecossistema da
apresentação (React/TS), e embeddings locais via `@huggingface/transformers` (ONNX).

## Arquitetura-alvo (física)

```
vestido-aurora/
  package.json
  tsconfig.json
  .env                  # chaves (NUNCA versionar)
  .gitignore
  src/
    server.ts           # Express: monta os "microsserviços" + endpoints da demo
    workflow.ts         # automação Imagem -> Vídeo -> Legenda (Ato 1)
    services/
      imageService.ts   # POST /images  (Image Service real -> Atlas Cloud)
      videoService.ts   # POST /videos  (Video Service real -> Atlas Cloud)
      captionService.ts # POST /captions (Caption Service local)
    llm/
      client.ts         # cliente DeepSeek (OpenAI-compatível)
    rag/
      documents.ts      # leitura + chunking
      embeddings.ts     # transformers.js (MiniLM multilingual)
      vectorStore.ts    # vetores + busca por similaridade (memória)
      pipeline.ts       # setup() + ask() -> RAG pronto
    tools/
      registry.ts       # schemas de function calling + dispatch
      imageTool.ts      # tool generate_image -> chama o Image Service
    agent/
      multi.ts          # Orchestrator + Knowledge/Image/Video/Caption Agents
      run.ts            # wrapper simples para executar o fluxo multi-agent
    docsData/           # os documentos criados
```

## Sequência lógica (e a conexão com os slides)

| Momento | Slides | Demo |
| --- | --- | --- |
| 1 | Ato 1 (microsserviços/workflow) | 3 endpoints + workflow |
| 2 | Ato 2 (LLM entende) | DeepSeek entendendo o pedido |
| 3 | Ato 3 (RAG) | criar documentos → chunks → embeddings → pergunta com fonte |
| 4 | Ato 4–5 (Tools + Agent) | por que um Agent decide e uma Tool executa |
| 5 | Ato 6+ (Multi-Agent) | 5 agentes: Orchestrator + Knowledge/Image/Video/Caption |

## Documentos nesta pasta

- `01-requisitos-e-custos.md` — o que é necessário e quanto custa
- `02-instalacao.md` — instalação passo a passo (Node/TS)
- `03-base-do-projeto.md` — a base: estrutura, `.env`, Express e os 3 serviços
- `04-llm-e-deepseek.md` — integrar o DeepSeek (deepseek-chat)
- `05-documentos-do-vestido-aurora.md` — os documentos criados
- `06-rag.md` — RAG completo (chunks, embeddings, busca, resposta com fonte)
- `07-agente-e-imagem-real.md` — Tools + 5 agentes + imagem/vídeo reais (demo principal)
- `08-video-e-legenda-local.md` — vídeo real via Atlas Cloud + legenda local
- `09-roteiro.md` — o plano cronometrado de execução
- `10-problemas-comuns.md` — troubleshooting rápido
