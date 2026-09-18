export const palette = {
  bg: '#08080d',
  bgRaised: '#0d0d14',
  panel: '#11121a',
  panel2: '#171926',
  line: '#262a3a',
  text: '#eceef4',
  muted: '#99a0b1',
  faint: '#5b6378',

  llm: '#9b8cff', // violeta discreto
  rag: '#58a6ff', // azul / conhecimento
  agent: '#3ecf8e', // verde / agents
  tool: '#f2b33d', // amarelo/âmbar / tools
  ms: '#c7cdd8', // cinza claro / microsserviços
  kafka: '#ff8a4c', // laranja / eventos
  good: '#3ecf8e',
  bad: '#ff7a8a',
} as const

export type Accent = keyof typeof palette

export const rgba = (hex: string, a = 1) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

export const font = {
  display: `'Space Grotesk', 'Inter', system-ui, sans-serif`,
  body: `'Inter', system-ui, -apple-system, sans-serif`,
  mono: `'JetBrains Mono', ui-monospace, 'SF Mono', monospace`,
} as const
