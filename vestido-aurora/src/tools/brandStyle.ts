// Direção visual oficial da marca, derivada de docsData/brand-identity.md.
// É anexada automaticamente a todo prompt de geração de imagem para que a
// saída siga a identidade (paleta + direção de fotografia) mesmo quando o
// Agent não lembra de consultar o RAG.
export const BRAND_IDENTITY_STYLE =
  'Estilo da marca Vestido Aurora: paleta oficial Vermelho Seda (#9E1B32), ' +
  'Champanhe (#E8DCC7) e Noite (#17121A), com detalhes Dourado (#C9A227); ' +
  'fotografia elegante e sofisticada com luz suave e difusa; tecido de seda ' +
  'com silhueta fluida; composição minimalista sobre fundo escuro ou neutro.'

const MARKERS = ['#9E1B32', 'Vermelho Seda', 'paleta oficial', 'Estilo da marca']

/** Acrescenta a identidade visual ao prompt (sem duplicar se já estiver lá). */
export function withBrandIdentity(prompt: string): string {
  const p = prompt.trim()
  if (!p) return p
  const lower = p.toLowerCase()
  const alreadyBranded = MARKERS.some((m) => lower.includes(m.toLowerCase()))
  if (alreadyBranded) return p
  return `${p}. ${BRAND_IDENTITY_STYLE}`
}
