export interface DocRef {
  file: string
  kind: 'pdf' | 'guide'
  title: string
}

export const docCloud: DocRef[] = [
  { file: 'products.pdf', kind: 'pdf', title: 'Catálogo de produtos' },
  { file: 'brand-guide.pdf', kind: 'guide', title: 'Guia da marca' },
  { file: 'campaigns.pdf', kind: 'pdf', title: 'Campanhas anteriores' },
  { file: 'communication-guide.pdf', kind: 'guide', title: 'Guia de comunicação' },
]

export const moreFiles: string[] = [
  'produto-001.pdf',
  'produto-002.pdf',
  'produto-003.pdf',
  'vestidos.pdf',
  'sapatos.pdf',
  'lookbook.pdf',
  'prices-2026.pdf',
  'suppliers.pdf',
]

export interface DocContent {
  file: string
  title: string
  lines: { k: string; v: string }[]
}

export const productDoc: DocContent = {
  file: 'products.pdf',
  title: 'Produto: Vestido Aurora',
  lines: [
    { k: 'Tipo', v: 'vestido longo de festa' },
    { k: 'Cor', v: 'vermelho' },
    { k: 'Material', v: 'seda natural com forro de acetato' },
    { k: 'Público', v: '25–40 anos' },
    { k: 'Posicionamento', v: 'elegante e sofisticado' },
    { k: 'Preço', v: 'R$ 1.290 · 10x sem juros' },
    { k: 'Tamanhos', v: 'PP ao GG' },
  ],
}

export const brandDoc: DocContent = {
  file: 'brand-guide.pdf',
  title: 'Tom da marca',
  lines: [
    { k: 'Tom', v: 'elegante, próximo e moderno' },
    { k: 'Evitar', v: 'gírias excessivas' },
    { k: 'Priorizar', v: 'minimalismo, sofisticação e clareza' },
  ],
}

// Texto usado no Chunking Lab
export const chunkSourceText = [
  'O Vestido Aurora é o produto principal da coleção de verão. A peça é feita de seda natural e foi desenhada para eventos formais. O posicionamento da marca é elegante e sofisticado.',
  'A campanha de inverno terá foco em comunicação próxima e moderna. As redes sociais devem priorizar clareza e minimalismo nas peças de divulgação.',
  'O público-alvo do Vestido Aurora é composto por pessoas entre 25 e 40 anos. Por isso, o tom das campanhas precisa conversar com esse perfil sem perder sofisticação.',
].join(' ')

export function splitIntoChunks(
  text: string,
  size: number,
  overlap: number,
): { text: string; overlap: boolean }[] {
  const words = text.split(' ')
  const chunks: { text: string; overlap: boolean }[] = []
  if (size <= 0 || words.length === 0) return chunks
  let start = 0
  while (start < words.length) {
    const slice = words.slice(start, start + size)
    const isOverlap = start > 0 && overlap > 0
    chunks.push({
      text: slice.join(' '),
      overlap: isOverlap,
    })
    if (start + size >= words.length) break
    const step = Math.max(1, size - overlap)
    start += step
  }
  return chunks
}

export interface RetrievedChunk {
  id: string
  file: string
  text: string
  score: number
}

export const retrievalResults: RetrievedChunk[] = [
  {
    id: 'Chunk #17',
    file: 'products.pdf',
    text: 'Público: 25–40 anos. A peça é direcionada a eventos formais.',
    score: 0.94,
  },
  {
    id: 'Chunk #03',
    file: 'products.pdf',
    text: 'Posicionamento elegante e sofisticado, feito em seda natural.',
    score: 0.81,
  },
  {
    id: 'Chunk #42',
    file: 'campaigns.pdf',
    text: 'Campanhas anteriores priorizaram o público feminino urbano.',
    score: 0.63,
  },
  {
    id: 'Chunk #55',
    file: 'communication-guide.pdf',
    text: 'Evitar gírias excessivas. Tom próximo e moderno.',
    score: 0.57,
  },
]
