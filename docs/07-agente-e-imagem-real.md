# 07 · Passo a passo — Tools + 5 agentes + imagem/vídeo REAIS

> **Momento principal da demo (Atos 4 a 6).** O `Orchestrator Agent` interpreta o
> objetivo e delega para quatro especialistas: `Knowledge Agent`, `Image Agent`,
> `Video Agent` e `Caption Agent`. Os especialistas chamam as tools; imagem e vídeo
> do Vestido Aurora são gerados de verdade via Atlas Cloud.

## 1. Registrar as tools (function calling)

`src/tools/registry.ts`

```ts
import { generateImage } from './imageTool.js'
import { generateVideoFromService } from '../services/videoService.js'
import { ask } from '../rag/pipeline.js'

export type ToolName = 'search_knowledge' | 'generate_image' | 'generate_video' | 'add_caption'

export const TOOL_SCHEMAS = [
  {
    type: 'function',
    function: {
      name: 'search_knowledge',
      description: 'Busca conhecimento relevante nos documentos da marca.',
      parameters: { type: 'object', properties: { query: { type: 'string' } } },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_image',
      description: 'Gera uma imagem a partir de uma descrição (serviço real).',
      parameters: { type: 'object', properties: { prompt: { type: 'string' } } },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_video',
      description: 'Transforma uma imagem em vídeo usando o Video Service.',
      parameters: { type: 'object', properties: { imageUrl: { type: 'string' }, imageId: { type: 'string' }, prompt: { type: 'string' } } },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_caption',
      description: 'Adiciona legenda ao vídeo.',
      parameters: {
        type: 'object',
        properties: { videoId: { type: 'string' }, videoUrl: { type: 'string' }, text: { type: 'string' } },
      },
    },
  },
] as const

export async function dispatch(name: string, args: Record<string, unknown>) {
  switch (name as ToolName) {
    case 'search_knowledge':
      return ask(String(args.query))
    case 'generate_image':
      return { imageUrl: await generateImage(String(args.prompt)) }
    case 'generate_video':
      return { videoUrl: await generateVideoFromService(String(args.imageUrl ?? args.imageId), String(args.prompt ?? '')), mock: false }
    case 'add_caption':
      return addCaptionFromService(String(args.videoUrl ?? args.videoId), String(args.text ?? 'Vestido Aurora'))
    default:
      throw new Error(`Tool desconhecida: ${name}`)
  }
}
```

## 2. Tool de imagem → Image Service → Atlas Cloud

`src/tools/imageTool.ts`

```ts
import { generateImageFromService } from '../services/imageService.js'

export async function generateImage(prompt: string): Promise<string> {
  return generateImageFromService(prompt)
}
```

A tool é só a ponte chamada pelo `Image Agent`. Quem executa de verdade é o
`Image Service` em `src/services/imageService.ts`:

```text
Image Agent -> generate_image(prompt) -> Image Service -> Atlas Cloud
```

No código real, `imageService.ts` aplica a identidade visual da marca, usa sempre o modelo
`alibaba/wan-2.7-pro/image-edit` e faz polling até receber a URL final da imagem.

O modelo de imagem não vem do `.env`: ele fica fixo no `Image Service` para evitar variação
durante a demo.

## 3. Tool de vídeo → Video Service → Atlas Cloud

No registro de tools, `generate_video` chama `generateVideoFromService`. Quem executa de
verdade é o `Video Service` em `src/services/videoService.ts`:

```text
Video Agent -> generate_video(imageUrl) -> Video Service -> Atlas Cloud
```

No código real, `videoService.ts` usa `VIDEO_MODEL=alibaba/wan-2.7/image-to-video` e sempre
anexa esta restrição ao prompt: vídeo de no máximo 3 segundos, sem áudio.

**search_knowledge → reusa o RAG** (já importado no `registry.ts` via `ask`).

## 4. O fluxo com 5 agentes

`src/agent/multi.ts`

```ts
export async function runMultiAgent(goal: string, emit: Emit, maxSteps = 10) {
  // 1) Orchestrator recebe o objetivo.
  // 2) Ele delega para um especialista por vez.
  // 3) Cada especialista só usa as tools da sua responsabilidade.
  // 4) O resultado volta para o Orchestrator decidir o próximo passo.
}
```

Responsabilidades:

- `Orchestrator Agent` — coordena e delega; não executa tool de produto diretamente.
- `Knowledge Agent` — chama `search_knowledge` e devolve contexto/fonte.
- `Image Agent` — chama `generate_image` com um prompt visual rico.
- `Video Agent` — chama `generate_video` com a `imageUrl` e aciona o `Video Service`.
  O `Video Service` usa `alibaba/wan-2.7/image-to-video` e reforça vídeo de no máximo 3 segundos, sem áudio.
- `Caption Agent` — chama `add_caption` com `videoUrl` ou `videoId` e o texto; o `Caption Service` local registra a legenda no retorno.

`src/agent/run.ts` existe só como wrapper simples para scripts/rotas que esperam uma
resposta final em texto. O caminho real da demo é `runMultiAgent`.

## 5. Demonstração ao vivo (a frase dos slides)

```ts
import { runMultiAgent } from './src/agent/multi.js'

await runMultiAgent('Crie um vídeo para divulgar o Vestido Aurora.', console.log)
```

O que deve acontecer em ordem (estado observável — sem chain-of-thought):

1. `Orchestrator Agent` recebe o objetivo.
2. `Orchestrator Agent` delega para `Knowledge Agent`.
3. `Knowledge Agent` chama `search_knowledge("Vestido Aurora público e tom da marca")`.
4. `Orchestrator Agent` delega para `Image Agent`.
5. `Image Agent` chama `generate_image(prompt rico com tom da marca)`.
6. `Orchestrator Agent` delega para `Video Agent`.
7. `Video Agent` chama `generate_video(imageUrl)` e recebe a URL do vídeo gerado pela Atlas Cloud, com no máximo 3 segundos e sem áudio.
8. `Orchestrator Agent` delega para `Caption Agent`.
9. `Caption Agent` chama `add_caption(videoId, texto)` e retorna o id final.

Abra as URLs: primeiro a imagem, depois o vídeo curto do Vestido Aurora feito "ao vivo".

## 6. Os 4 pedidos (igual aos slides)

- "Gere apenas uma imagem." → `Orchestrator` delega para `Knowledge` e `Image`.
- "Anime esta imagem." → `Orchestrator` delega para `Video`.
- "Coloque legenda neste vídeo." → `Orchestrator` delega para `Caption`.
- "Crie tudo a partir desta descrição." → os 5 agentes aparecem no fluxo.

**Conclusão didática:** o caminho mudou conforme o objetivo. O `Orchestrator` decide
quem chamar, o especialista decide como usar sua tool, e o serviço executa.

## 7. Checklist

- [ ] os 5 agentes aparecem na explicação/demo
- [ ] as 4 tools aparecem no registro
- [ ] imagem real gerada e URL exibida no navegador
- [ ] vídeo real gerado pela Atlas Cloud, com no máximo 3 segundos e sem áudio
- [ ] `runMultiAgent("...", emit)` delega na ordem certa
- [ ] "Orchestrator coordena · Agent decide · Serviço executa" ficou claro para quem assiste

**Próximo passo:** `08-video-e-legenda-local.md`.
