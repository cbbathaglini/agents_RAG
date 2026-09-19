# Agents RAG

Projeto didático em português sobre workflows, LLMs, RAG, ferramentas e sistemas com múltiplos agentes. O cenário de demonstração é a campanha do **Vestido Aurora**.

## Estrutura

- `presentation/`: apresentação interativa em React, TypeScript, Vite e GSAP.
- `vestido-aurora/`: API Express, interface web e demonstrações de RAG e agentes.
- `docs/`: guia de instalação, arquitetura, roteiro e solução de problemas.

A demonstração reúne Orchestrator, Knowledge, Image, Video e Caption Agents. O RAG consulta documentos locais da marca; DeepSeek fornece o LLM; Atlas Cloud executa a geração de imagens e vídeos. O serviço local de legenda retorna o texto e a referência do vídeo; a implementação atual não grava a legenda no arquivo de vídeo.

## Requisitos

- Node.js 20 ou superior e npm.
- Chaves DeepSeek e Atlas Cloud para as funcionalidades que usam essas APIs.
- Internet para instalar dependências e baixar o modelo de embeddings na primeira execução.

As chamadas de geração e LLM podem consumir créditos dos provedores.

## Executar a apresentação

```bash
cd presentation
npm ci
npm run dev
```

Abra http://localhost:5173. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

### Publicar na Vercel

O repositório aceita o deploy a partir da raiz: o arquivo `vercel.json` executa a instalação e o build em `presentation/`. Se o projeto da Vercel estiver configurado com **Root Directory** igual a `presentation`, a configuração equivalente existente nessa pasta será usada.

## Executar a demonstração

Em outro terminal:

```bash
cd vestido-aurora
npm ci
cp .env.example .env
```

Preencha `.env` com suas chaves e configurações. O arquivo não deve ser versionado.

```bash
npm run download:model
npm run dev
```

Abra http://localhost:8000 para a interface web. Verifique a API em http://localhost:8000/health. A porta pode ser alterada pela variável `PORT`.

O modelo de embeddings é `Xenova/paraphrase-multilingual-MiniLM-L12-v2`, com cache local em `.cache/` (configurável por `MODEL_CACHE_DIR`). A busca vetorial é mantida em memória.

Demonstrações disponíveis no diretório `vestido-aurora`:

```bash
npm run chat:demo
npm run rag:demo
npm run agent:demo
```

## Verificação

```bash
cd presentation
npm run build
npm run check
cd ../vestido-aurora
npm run typecheck
```

## Documentação

Comece pela [visão geral](docs/00-visao-geral.md), consulte [instalação](docs/02-instalacao.md) e siga o [roteiro da demonstração](docs/09-roteiro.md). Os demais arquivos de `docs/` detalham cada etapa.

Este projeto é uma demonstração didática. Os serviços de imagem, vídeo e legenda são rotas do mesmo servidor Express.

### Resultado da verificação na importação

A compilação da apresentação e a verificação de tipos da demonstração passaram. O teste `npm run check` da apresentação falhou no ambiente Node.js 25.9.0 porque `localStorage.getItem` não estava disponível na renderização fora do navegador.
