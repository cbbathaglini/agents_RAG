import { chat, chatStream } from '../llm/client.js'
import { buildChunks, loadDocs } from './documents.js'
import { VectorStore } from './vectorStore.js'
import { embedStats } from './embeddings.js'

export { embedStats }

export const store = new VectorStore()

export interface LabOptions {
  chunkSize?: number
  overlap?: number
  topK?: number
}

let docsCache: { file: string; text: string }[] | null = null
let lastParams: { chunkSize: number; overlap: number } = { chunkSize: 16, overlap: 3 }

export function currentParams() {
  return lastParams
}

/** Indexa com os parâmetros padrão (compatibilidade com scripts). */
export async function setup(): Promise<void> {
  await indexWith()
}

/** (Re)indexa os documentos com os parâmetros de chunking escolhidos. */
export async function indexWith(opts: LabOptions = {}): Promise<void> {
  docsCache ??= loadDocs()
  const chunkSize = Math.max(3, Math.min(60, opts.chunkSize ?? 16))
  const overlap = Math.max(0, Math.min(chunkSize - 1, opts.overlap ?? 3))
  lastParams = { chunkSize, overlap }
  await store.index(buildChunks(docsCache, chunkSize, overlap))
}

/** Garante os documentos indexados com os parâmetros atuais (idempotente). */
async function ensure(): Promise<void> {
  if (store.chunks.length === 0) await indexWith()
}

export function fmtSources(hits: { file: string; chunkId: string; score: number }[]) {
  return hits.map((h) => ({ file: h.file, chunkId: h.chunkId, score: Number(h.score.toFixed(3)) }))
}

export interface OverviewFile {
  file: string
  total: number
  chunks: { chunkId: string; text: string; retrieved: boolean }[]
}

/** Só a recuperação (chunks + scores) — sem chamar a LLM. */
export async function searchHits(question: string, topK = 4) {
  await ensure()
  return store.search(question, topK)
}

/** Monta a resposta com contexto a partir dos hits; opcionalmente em streaming de tokens. */
export async function answerWithContext(
  question: string,
  hits: { file: string; chunkId: string; text: string; score: number }[],
  onToken?: (delta: string) => void,
): Promise<string> {
  const context = hits.map((h) => `[${h.file} ${h.chunkId}]\n${h.text}`).join('\n\n')
  const messages = [
    {
      role: 'system' as const,
      content:
        'Responda com base SOMENTE no contexto fornecido. Cite o arquivo-fonte no final da resposta.',
    },
    { role: 'user' as const, content: `Contexto:\n${context}\n\nPergunta: ${question}` },
  ]
  if (onToken) return chatStream(messages, onToken)
  return (await chat(messages)).choices[0].message.content ?? ''
}

/** RAG completo de uma vez (retorno simples). */
export async function ask(question: string, topK = 4) {
  const hits = await searchHits(question, topK)
  const answer = await answerWithContext(question, hits)
  return { answer, sources: fmtSources(hits) }
}

/**
 * "Laboratório RAG": (re)indexa com chunkSize/overlap, busca e devolve
 * os hits + uma visão por arquivo de como o documento foi dividido em
 * chunks (destacando os recuperados e onde há overlap).
 */
export async function ragLab(
  question: string,
  opts: LabOptions = {},
): Promise<{
  hits: { file: string; chunkId: string; text: string; score: number }[]
  chunking: {
    overlap: number
    files: OverviewFile[]
  }
}> {
  await indexWith(opts)
  const topK = Math.max(1, Math.min(8, opts.topK ?? 6))
  const hits = await searchHits(question, topK)
  const retrieved = new Set(hits.map((h) => `${h.file} ${h.chunkId}`))
  const fileSet = new Set(hits.map((h) => h.file))
  const files = [...fileSet].sort((a, b) => {
    const pa = a === 'products.md' ? 0 : 1
    const pb = b === 'products.md' ? 0 : 1
    return pa - pb
  }).slice(0, 3)

  const overviewFiles: OverviewFile[] = files.map((file) => ({
    file,
    total: store.chunks.filter((c) => c.file === file).length,
    chunks: store.chunks
      .filter((c) => c.file === file)
      .map((c) => ({
        chunkId: c.chunkId,
        text: c.text,
        retrieved: retrieved.has(`${c.file} ${c.chunkId}`),
      }))
      // Mantém a visão compacta, mas nunca esconde um chunk recuperado.
      .filter((c, index) => index < 20 || c.retrieved),
  }))

  return { hits, chunking: { overlap: lastParams.overlap, files: overviewFiles } }
}
