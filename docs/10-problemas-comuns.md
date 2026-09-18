# 10 · Problemas comuns (troubleshooting rápido)

> Consulte por sintoma. Se nada resolver, o mais provável é **internet/chave** — teste com
> um `curl` simples primeiro.

## O servidor não sobe (`tsx`/`npm run dev` falha)

- Rodou na pasta certa? (`cd vestido-aurora`)
- `npm install` foi executado?
- Erro de import/`Cannot find module` → conferir extensão `.js` nos imports locais de TS
  (em `"module": "ESNext"`, imports de arquivos `.ts` usam `.js`).
- Erro de tipo TS → rode `npx tsc --noEmit` para ver onde está.

## DeepSeek retorna erro de autenticação (401)

- Chave correta no `.env`? Teste o curl do passo 5 da `02-instalacao.md`.
- Chave com espaço/aspas no `.env`? Remova.
- Base URL certo? `https://api.deepseek.com`.

## DeepSeek não delega/chama as tools (responde texto em vez de agir)

- Confirmou que está usando **`deepseek-chat`**? O `deepseek-reasoner` não faz function calling.
- As `tool_calls` chegam? Logue `msg.tool_calls` no `Orchestrator Agent` e nos especialistas.
- Prompt de sistema muito fechado pode inibir tools — deixe claro que ele DEVE usá-las.

## Atlas Cloud não gera imagem/vídeo

- 401 → chave (`ATLASCLOUD_API_KEY`, prefixo `apikey-`) correta?
- 404 → confira o endpoint: `/api/v1/model/generateImage`.
- Para vídeo, confira o endpoint `/api/v1/model/generateVideo` e o modelo `alibaba/wan-2.7/image-to-video`.
- `status: failed` no polling → leia `data.error`.
- Demora muito → teste a rede; aumente o limite de iterações do polling.
- Lembre de reiniciar o processo após editar o `.env` (o `dotenv` lê uma vez).

## Embedding trava/baixa devagar

- O `@huggingface/transformers` baixa o modelo ONNX na primeira execução — rode antes de
  apresentar para deixar em cache.
- Sem acesso à internet para o Hugging Face → o modelo não baixa; prepare cache antes.
- Pouca RAM → feche abas pesadas antes de indexar.

## Busca do RAG devolve resultado errado

- Aumente `topK` (3–5).
- Os arquivos estão em `src/docsData/` e com extensão `.md`?
- Rode `setup()` DEPOIS de criar/editar os documentos.
- Confirme que os vetores foram normalizados (o cosseno = produto escalar depende disso).

## O fluxo multi-agent não para / entra em loop

- Respeite o `maxSteps` no loop.
- Se o Orchestrator delegar sempre ao mesmo especialista, a observação pode estar vazia — logue os retornos das tools.
- Confirme que os especialistas disponíveis são exatamente `knowledge`, `image`, `video` e `caption`.

## A internet caiu na hora (Plano B)

- Mantenha um exemplo de execução do `runMultiAgent` **já gravado** (log de uma execução anterior).
- Mostre a imagem/vídeo já gerados salvos no disco.
- RAG local funciona offline depois do modelo carregado — dê print dos chunks/scores.
- DeepSeek/Atlas exigem internet — se cair de vez, vire a conversa para conceito + código.

## Custos acima do esperado

- Limite o contexto: topK pequeno e respostas curtas.
- Não rode o agent em loop de debugging com tools repetidas.
- Confira o saldo nos painéis no fim da apresentação.
