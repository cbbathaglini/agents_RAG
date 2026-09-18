import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export type DocChunk = { file: string; chunkId: string; text: string }

export function docsFolder(): string {
  return process.env.DOCS_FOLDER ?? join(process.cwd(), 'src', 'docsData')
}

export function loadDocs(folder = docsFolder()): { file: string; text: string }[] {
  return readdirSync(folder)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => ({ file, text: readFileSync(join(folder, file), 'utf-8') }))
}

/** Divide o texto em palavras, preservando a contagem para janelas. */
function wordsOf(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

/**
 * Divide o documento em seções pelos títulos markdown `# ...` (H1).
 * Cada seção é { title, body }: o title é o cabeçalho da seção; o body é o texto
 * logo após ele. O conteúdo antes do primeiro título vira uma seção sem título.
 */
export function splitSections(text: string): { title: string; body: string }[] {
  const sections: { title: string; body: string }[] = []
  let current: { title: string; body: string[] } | null = null

  for (const raw of text.split(/\r?\n/)) {
    const h1 = raw.match(/^\s*#\s+(.+?)\s*$/)
    if (h1) {
      if (current) sections.push({ title: current.title, body: current.body.join(' ').trim() })
      current = { title: h1[1].trim(), body: [] }
    } else if (current) {
      current.body.push(raw)
    } else {
      // texto antes do primeiro título
      if (raw.trim()) {
        if (!current) current = { title: '', body: [] }
        current.body.push(raw)
      }
    }
  }
  if (current) sections.push({ title: current.title, body: current.body.join(' ').trim() })
  return sections.filter((s) => s.body.length > 0 || s.title)
}

/**
 * Janela deslizante por palavras (mesmo conceito do chunking por contagem),
 * com um prefixo opcional repetido no início de cada pedaço.
 */
function windowed(text: string, size: number, overlap: number, prefix = ''): string[] {
  const words = wordsOf(text)
  const chunks: string[] = []
  let start = 0
  while (start < words.length) {
    const body = words.slice(start, start + size).join(' ')
    chunks.push(prefix ? `${prefix} ${body}` : body)
    start += Math.max(1, size - overlap)
  }
  return chunks
}

/**
 * Chunking consciente de estrutura:
 * 1. Divide nas seções `#` do markdown.
 * 2. Seção que cabe no tamanho vira um único chunk.
 * 3. Seção maior que o tamanho é subdividida em janelas, porém cada sub-chunk
 *    repete o título da seção no início — preservando a associação entidade→atributo
 *    (ex.: o público do "Vestido Luna" não se perde do nome do produto).
 */
export function buildChunks(
  docs: { file: string; text: string }[],
  chunkSize = 10,
  overlap = 2,
): DocChunk[] {
  const out: DocChunk[] = []
  for (const doc of docs) {
    let i = 0
    const push = (text: string) => {
      out.push({ file: doc.file, chunkId: `#${String(i++).padStart(3, '0')}`, text })
    }
    for (const section of splitSections(doc.text)) {
      const title = section.title ? `# ${section.title}` : ''
      const prefix = title
      if (wordsOf(section.body).length <= chunkSize) {
        push([title, section.body].filter(Boolean).join('\n').trim())
      } else {
        for (const text of windowed(section.body, chunkSize, overlap, title ? `${title}:` : '')) {
          push(text)
        }
      }
    }
  }
  return out
}
