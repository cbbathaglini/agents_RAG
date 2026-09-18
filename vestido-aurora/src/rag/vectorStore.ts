import { embed } from './embeddings.js'
import type { DocChunk } from './documents.js'

export interface Hit extends DocChunk {
  score: number
}

export class VectorStore {
  chunks: DocChunk[] = []
  vectors: number[][] = []

  async index(chunks: DocChunk[]): Promise<void> {
    this.chunks = chunks
    this.vectors = await embed(chunks.map((c) => c.text))
  }

  async search(query: string, topK = 3): Promise<Hit[]> {
    const [q] = await embed([query])
    const scored: Hit[] = this.chunks.map((c, i) => {
      const v = this.vectors[i]
      const dot = v.reduce((sum, x, j) => sum + x * q[j], 0) // vetores normalizados -> cosseno
      return { ...c, score: dot }
    })
    return scored.sort((a, b) => b.score - a.score).slice(0, topK)
  }
}
