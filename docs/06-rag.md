# 06 · Passo a passo — o RAG (Node/TS)

> **Corresponde ao Ato 3.** Vamos tornar os documentos pesquisáveis por *significado*:
> ler → chunk → embedding → guardar vetores → buscar por similaridade → responder com fonte.

## 1. Carregar e "chunkar" os documentos

`src/rag/documents.ts`

```ts
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export type DocChunk = { file: string; chunkId: string; text: string }

export function loadDocs(folder = 'src/docsData') {
  return readdirSync(folder)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => ({
      file,
      text: readFileSync(join(folder, file), 'utf-8'),
    }))
}

export function chunkText(text: string, size = 6, overlap = 1): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []
  let start = 0
  while (start < words.length) {
    chunks.push(words.slice(start, start + size).join(' '))
    start += Math.max(1, size - overlap)
  }
  return chunks
}

export function buildChunks(docs: { file: string; text: string }[]): DocChunk[] {
  const out: DocChunk[] = []
  for (const doc of docs) {
    chunkText(doc.text).forEach((text, i) => {
      out.push({ file: doc.file, chunkId: `#${String(i).padStart(3, '0')}`, text })
    })
  }
  return out
}
```

> Mostre o `chunkId` na tela — é o "Chunk #17" dos slides.

## 2. Embeddings (transformers.js) + vector store em memória

`src/rag/embeddings.ts`

```ts
import { pipeline } from '@huggingface/transformers'

const extractor = await pipeline(
  'feature-extraction',
  'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
)

export async function embed(texts: string[]): Promise<number[][]> {
  const out = await extractor(texts, { pooling: 'mean', normalize: true })
  return out.tolist() as number[][]
}
```

`src/rag/vectorStore.ts`

```ts
import type { DocChunk } from './documents.js'
import { embed } from './embeddings.js'

export class VectorStore {
  chunks: DocChunk[] = []
  vectors: number[][] = []

  async index(chunks: DocChunk[]) {
    this.chunks = chunks
    this.vectors = await embed(chunks.map((c) => c.text))
  }

  async search(query: string, topK = 3) {
    const [q] = await embed([query])
    const scored = this.chunks.map((c, i) => {
      const v = this.vectors[i]
      const dot = v.reduce((s, x, j) => s + x * q[j], 0)
      return { score: dot, ...c } // vetores normalizados -> cosseno = produto escalar
    })
    return scored.sort((a, b) => b.score - a.score).slice(0, topK)
  }
}
```

> Guardar vetores em memória é suficiente para a demo e mostra o conceito sem depender de
> banco. Depois dá para trocar por Chroma/Qdrant mantendo `index()`/`search()`.

## 3. Montar o RAG end-to-end

`src/rag/pipeline.ts`

```ts
import { chat } from '../llm/client.js'
import { buildChunks, loadDocs } from './documents.js'
import { VectorStore } from './vectorStore.js'

export const store = new VectorStore()

export async function setup() {
  await store.index(buildChunks(loadDocs()))
}

export async function ask(question: string, topK = 3) {
  const hits = await store.search(question, topK)
  const context = hits
    .map((h) => `[${h.file} ${h.chunkId}]\n${h.text}`)
    .join('\n\n')

  const resp = await chat([
    {
      role: 'system',
      content:
        'Responda com base SOMENTE no contexto fornecido. Cite o arquivo-fonte no final.',
    },
    { role: 'user', content: `Contexto:\n${context}\n\nPergunta: ${question}` },
  ])

  return {
    answer: resp.choices[0].message.content,
    sources: hits.map((h) => `${h.file} ${h.chunkId} (${h.score.toFixed(2)})`),
  }
}
```

## 4. Demonstração ao vivo

```ts
import { ask, setup } from './src/rag/pipeline.js'

await setup()
console.log(await ask('Qual é o público do Vestido Aurora?'))
```

Esperado: resposta citando `products.md` e o chunk do público. Teste também:

- "Quero uma roupa elegante para um evento formal." → acha mesmo sem a palavra "vestido"
  (momento embeddings/busca semântica).
- "O que o guia de comunicação fala sobre gírias?" → acha no `communication-guide.md`.

> Para rodar: `npx tsx scripts/rag-demo.ts`.

## 5. (Opcional) variar o top-k

Altere `topK` entre 1 e 5 e mostre os scores mudando — igual ao slide da busca.

## 6. Checklist

- [ ] `setup()` indexa os documentos sem erro (modelo já baixado)
- [ ] pergunta sobre o público responde citando a fonte
- [ ] busca semântica funciona com palavras diferentes
- [ ] quem assiste viu os chunks e os scores na tela

**Próximo passo:** `07-agente-e-imagem-real.md` — unir conhecimento (RAG) e ação (tools + imagem/vídeo reais).
