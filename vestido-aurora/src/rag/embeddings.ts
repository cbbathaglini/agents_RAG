import path from 'node:path'
import { env, pipeline } from '@huggingface/transformers'

// Configura o cache local ANTES de carregar qualquer modelo.
// O download acontece UMA vez; depois disso funciona offline.
export const MODEL_ID = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2'
export const cacheDir = path.resolve(process.env.MODEL_CACHE_DIR ?? path.join(process.cwd(), '.cache'))
env.cacheDir = cacheDir

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Extractor = any

let extractorPromise: Promise<Extractor> | null = null

function getExtractor(): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', MODEL_ID)
  }
  return extractorPromise
}

/** Baixa/garante o modelo em cache (usado pelo script download:model). */
export async function downloadModel() {
  const extractor = await getExtractor()
  // força um forward para validar o download
  await extractor('Vestido Aurora', { pooling: 'mean', normalize: true })
  return cacheDir
}

/** Gera um vetor (normalizado) por texto. */
export async function embed(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor()
  const out = await extractor(texts, { pooling: 'mean', normalize: true })
  return out.tolist()
}

/** Resumo didático do embedding de um texto (para mostrar na interface). */
export async function embedStats(text: string): Promise<{ dims: number; values: number[] }> {
  const [v] = await embed([text])
  return { dims: v.length, values: v.slice(0, 12).map((n) => Math.round(n * 1000) / 1000) }
}
