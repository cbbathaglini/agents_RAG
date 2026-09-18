# 01 · Requisitos e custos

## O que precisamos para rodar

| Item | Obrigatório? | Por quê |
| --- | --- | --- |
| Node.js 20+ (LTS) | Sim | roda a API, o RAG e os 5 agentes em TS |
| npm (vem com o Node) | Sim | gerenciar dependências |
| Git | Recomendado | versionar o que for feito |
| VS Code (ou editor) | Recomendado | facilitar o acompanhamento |
| Internet | Sim | chamar DeepSeek e Atlas Cloud |


## Contas e chaves (API keys)

| Serviço | Serve para | Onde fica |
| --- | --- | --- |
| DeepSeek | LLM (entender + responder + coordenar agentes/tools) | `.env` → `DEEPSEEK_API_KEY` |
| Atlas Cloud | Gerar imagem e vídeo de verdade | `.env` → `ATLASCLOUD_API_KEY` |
| Hugging Face (opcional) | baixar o modelo de embedding | não precisa de login |

Modelos a usar:
- DeepSeek: **`deepseek-chat`** (suporta function calling; `deepseek-reasoner` NÃO).
- Imagem: **`alibaba/wan-2.7-pro/image-edit`** fixo no `Image Service`.
- Vídeo: **`alibaba/wan-2.7/image-to-video`** (configurável via `VIDEO_MODEL`).
- Embedding (Node): **`paraphrase-multilingual-MiniLM-L12-v2`** via `@huggingface/transformers`.

> **Segurança:** chaves vão no `.env` e o `.env` entra no `.gitignore`

## Custo real da demo

Praticamente **tudo é grátis**; o que custa é uso de API em pay-as-you-go:

| Recurso | Custo | Nota |
| --- | --- | --- |
| Node + libs (Express, transformers.js) | R$ 0 | open source |
| Embedding local (MiniLM ONNX) | R$ 0 | roda na sua máquina |
| DeepSeek `deepseek-chat` | poucos centavos | demo = algumas dezenas de chamadas curtas |
| Atlas Cloud (imagem/vídeo) | varia por geração | vamos gerar 1 imagem e 1 vídeo curto |
| **Total estimado da demo** | **< R$ 5** | dificilmente passa disso |
