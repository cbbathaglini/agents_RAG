import { useEffect, useMemo, useState } from 'react'
import { Ent, NodeBox, Statement, Pill, Bubble } from '../components/ui'
import { palette, rgba } from '../theme'
import { docCloud, moreFiles, productDoc, brandDoc, chunkSourceText, splitIntoChunks, retrievalResults } from '../data/documents'

/* ---------------------------------------------------------------- s06 */
const archiveFiles: string[] = [
  ...docCloud.map((d) => d.file),
  ...moreFiles,
  'produto-004.pdf',
  'social-media-guide.pdf',
  'collection-2026.pdf',
]

export function s06({ step }: { step: number }) {
  const dim = step >= 3
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26, position: 'relative', zIndex: 0 }}>
      {step >= 1 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            pointerEvents: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gridAutoRows: '1fr',
            alignContent: 'space-evenly',
            gap: '10px 26px',
            padding: '96px 130px 30px',
            opacity: dim ? 0.13 : 0.55,
            transition: 'opacity var(--d) ease',
          }}
        >
          {Array.from({ length: 48 }).map((_, i) => {
            const f = archiveFiles[i % archiveFiles.length]
            return (
              <div
                key={i}
                className="mono"
                style={{
                  fontSize: 13,
                  letterSpacing: '0.02em',
                  color: dim ? 'rgba(180,200,235,0.35)' : 'rgba(168, 196, 236, 0.5)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: i % 3 === 1 ? 'center' : 'left',
                }}
              >
                {f}
              </div>
            )
          })}
        </div>
      )}

      <Ent show={step >= 0} style={{ maxWidth: 900, zIndex: 1 }}>
        <div className="qline" style={{ fontSize: 40 }}>Agora imagine que temos <span style={{ color: palette.rag }}>50 mil documentos</span> internos.</div>
      </Ent>

      {step >= 2 && (
        <Ent show delay={120}>
          <Bubble who="USUÁRIO" kind="user">Qual é o público do Vestido Aurora?</Bubble>
        </Ent>
      )}

      {step >= 3 && (
        <Ent show delay={160}>
          <div className="rowc" style={{ gap: 30, marginTop: 8 }}>
            <NodeBox accent={palette.llm} title="LLM" small />
            <span className="mono" style={{ fontSize: 30, color: palette.bad }}>?</span>
            <Pill accent={palette.ms}>50.000 documentos</Pill>
          </div>
        </Ent>
      )}

      {step >= 4 && (
        <Ent show>
          <div className="note-line" style={{ maxWidth: 1000 }}>Ela precisa mesmo ler todos eles, toda vez? <strong>Não seria uma boa ideia.</strong></div>
        </Ent>
      )}

      {step >= 5 && (
        <Ent show kind="pop">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
            <Statement size="xl" style={{ color: palette.rag, fontSize: 120 }}>RAG</Statement>
            <div className="note-line">Antes de responder, procuramos apenas as informações relevantes.</div>
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s07 */
export function s07({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 30 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 36, marginBottom: 24 }}>Um documento de verdade.</div>
        <div className="rowc" style={{ gap: 40, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <Ent show={step >= 1}>
            <DocContentCard doc={productDoc} />
          </Ent>
          <Ent show={step >= 2} delay={300}>
            <DocContentCard doc={brandDoc} />
          </Ent>
        </div>
      </Ent>
      {step >= 3 && (
        <Ent show kind="pop">
          <div className="qline" style={{ fontSize: 38 }}>“Como transformamos documentos assim em algo pesquisável por significado?”</div>
        </Ent>
      )}
    </div>
  )
}

function DocContentCard({ doc }: { doc: typeof productDoc }) {
  return (
    <div className="doc-card" style={{ minWidth: 460, padding: '20px 26px' }}>
      <div className="f">{doc.file}</div>
      <div style={{ color: 'var(--text)', fontSize: 20, fontFamily: 'var(--font-d)', marginBottom: 12 }}>{doc.title}</div>
      {doc.lines.map((l) => (
        <div key={l.k} style={{ display: 'flex', gap: 16, fontSize: 18, lineHeight: 1.8 }}>
          <span style={{ color: 'var(--faint)', minWidth: 110 }}>{l.k}:</span>
          <span style={{ color: '#cfe0f5' }}>{l.v}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- s08 */
export function s08({ step }: { step: number }) {
  const big = [
    'manual-de-produtos.pdf', 'linhas: 12.840', 'TOC · seções · anexos · notas de rodapé',
    'descreve 1.200 produtos com públicos, posições e campanhas',
  ]
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 36 }}>Alguns documentos são enormes. Será que precisamos recuperá-los inteiros?</div>
      </Ent>

      {step >= 1 && (
        <Ent show>
          <div className="doc-card" style={{ width: 720, padding: '18px 26px' }}>
            <div className="f">manual-de-produtos.pdf</div>
            {big.slice(1).map((_l, i) => (
              <div key={i} style={{ height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, margin: '10px 0', width: `${92 - i * 14}%` }} />
            ))}
          </div>
        </Ent>
      )}

      {step >= 2 && (
        <Ent show kind="pop">
          <div className="qline" style={{ fontSize: 40 }}>Cortamos o documento em pedaços menores.</div>
        </Ent>
      )}

      {step >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 260px)', gap: 22, marginTop: 6 }}>
          {['...seda natural, público 25 a 40 anos...', '...campanhas em tom elegante...', '...clareza e minimalismo...', '...evitar gírias excessivas...'].map((t, i) => (
            <Ent key={i} show delay={i * 200} kind="pop">
              <div className="chunk" style={{ fontSize: 15, padding: '16px 14px' }}>
                <span className="lab">CHUNK 0{i + 1}</span>
                {t}
              </div>
            </Ent>
          ))}
        </div>
      )}

      {step >= 4 && (
        <Ent show>
          <div className="rowc" style={{ gap: 26 }}>
            <Statement size="lg" style={{ color: palette.rag, fontSize: 76 }}>CHUNK</Statement>
            <div className="note-line" style={{ maxWidth: 620, textAlign: 'left' }}>
              Um chunk é apenas um trecho do conteúdo que poderá ser recuperado depois.
            </div>
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s08b Chunking Lab */
export function s08b() {
  const [size, setSize] = useState(12)
  const [overlap, setOverlap] = useState(0)
  const maxOverlap = Math.max(0, size - 1)
  const effectiveOverlap = Math.min(overlap, maxOverlap)
  const allChunks = useMemo(() => splitIntoChunks(chunkSourceText, size, effectiveOverlap), [size, effectiveOverlap])
  const visibleLimit = size <= 5 ? 14 : size <= 8 ? 10 : 7
  const chunks = allChunks.slice(0, visibleLimit)
  const hiddenChunks = allChunks.length - chunks.length
  const sizeTradeoff = getChunkSizeTradeoff(size)
  const overlapTradeoff = getOverlapTradeoff(effectiveOverlap, size)

  useEffect(() => {
    setOverlap((current) => Math.min(current, maxOverlap))
  }, [maxOverlap])

  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, maxWidth: 1540, margin: '0 auto', width: '100%' }}>
      <Ent show>
        <div className="qline" style={{ fontSize: 30 }}>CHUNKING LAB · observe o texto se dividindo em tempo real</div>
      </Ent>

      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 34, alignItems: 'stretch' }}>
        <div>
          <div className="doc-card" style={{ minHeight: 184, fontSize: 15, lineHeight: 1.55 }}>
            <div className="f">produtos.pdf · documento original</div>
            {chunkSourceText}
          </div>
          <div style={{ display: 'flex', gap: 34, marginTop: 18 }}>
            <LabSlider label="Tamanho do chunk" min={3} max={30} value={size} onChange={setSize} />
            <LabSlider label="Sobreposição" min={0} max={maxOverlap} value={effectiveOverlap} onChange={setOverlap} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            <TradeoffCard title="Tamanho" good={sizeTradeoff.good} bad={sizeTradeoff.bad} />
            <TradeoffCard title="Sobreposição" good={overlapTradeoff.good} bad={overlapTradeoff.bad} />
          </div>
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: size <= 5 ? '1fr 1fr' : '1fr', gap: 8 }}>
            {chunks.map((c, i) => (
              <div key={i} className="chunk" style={{ fontSize: size <= 5 ? 12 : 14, padding: size <= 5 ? '7px 10px' : '10px 14px' }}>
                <span className="lab" style={{ color: effectiveOverlap > 0 && c.overlap ? palette.tool : palette.rag }}>CHUNK {String(i + 1).padStart(2, '0')}</span>
                <HighlightOverlap text={c.text} overlay={effectiveOverlap > 0 && c.overlap} count={effectiveOverlap} />
              </div>
            ))}
            {hiddenChunks > 0 && (
              <div className="chunk" style={{ fontSize: 13, padding: '10px 14px', borderStyle: 'dashed', textAlign: 'center', color: palette.muted }}>
                <span className="lab" style={{ color: palette.muted }}>...</span>
                +{hiddenChunks} chunks fora da tela
              </div>
            )}
          </div>
          {effectiveOverlap > 0 && (
            <Ent show kind="fade" style={{ marginTop: 10 }}>
              <div className="note-line" style={{ textAlign: 'left', fontSize: 18, color: palette.tool }}>
                Trechos repetidos no início do chunk seguinte mantêm o contexto exato da divisão.
              </div>
            </Ent>
          )}
          <Ent show={effectiveOverlap === 0}>
            <div className="note-line" style={{ textAlign: 'left', fontSize: 17 }}>Experimente aumentar a sobreposição para ver palavras repetidas entre chunks.</div>
          </Ent>
        </div>
      </div>
    </div>
  )
}

function getChunkSizeTradeoff(size: number) {
  if (size <= 5) {
    return { good: 'recorte preciso', bad: 'muitos pedaços e pouco contexto' }
  }
  if (size >= 20) {
    return { good: 'mais contexto por chunk', bad: 'pode misturar assuntos demais' }
  }
  return { good: 'bom equilíbrio de contexto', bad: 'ainda exige ajuste por domínio' }
}

function getOverlapTradeoff(overlap: number, size: number) {
  if (overlap === 0) {
    return { good: 'menos custo e duplicação', bad: 'pode cortar uma ideia no meio' }
  }
  if (overlap / size >= 0.45) {
    return { good: 'quase não perde contexto', bad: 'muita repetição no índice' }
  }
  return { good: 'preserva transições', bad: 'aumenta chunks e custo' }
}

function TradeoffCard({ title, good, bad }: { title: string; good: string; bad: string }) {
  return (
    <div className="doc-card" style={{ padding: '12px 14px', fontSize: 14, lineHeight: 1.35, background: rgba(palette.rag, 0.04) }}>
      <div className="f" style={{ marginBottom: 6 }}>{title}</div>
      <div style={{ color: palette.good }}>✓ {good}</div>
      <div style={{ color: palette.bad, marginTop: 4 }}>✕ {bad}</div>
    </div>
  )
}

function LabSlider({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (n: number) => void }) {
  return (
    <label className="grow" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span className="eyebrow" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {label} <b style={{ color: 'var(--rag)' }}>{value}</b>
      </span>
      <input type="range" className="slider" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}

function HighlightOverlap({ text, overlay, count }: { text: string; overlay: boolean; count: number }) {
  if (!overlay) return <span>{text}</span>
  const words = text.split(' ')
  const highlightCount = Math.min(count, words.length)
  const lastWords = words.slice(0, highlightCount).join(' ')
  const rest = words.slice(highlightCount).join(' ')
  return (
    <span>
      <span className="ov">{lastWords}</span> {rest}
    </span>
  )
}

/* ---------------------------------------------------------------- s09 */
export function s09({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 30 }}>
      <div className="rowc" style={{ gap: 60, alignItems: 'flex-start' }}>
        <Ent show={step >= 0}>
          <div className="doc-card" style={{ width: 470, fontSize: 19, padding: '22px 28px' }}>
            <div className="f">Trecho de um documento</div>
            O Vestido Aurora possui posicionamento sofisticado.
          </div>
        </Ent>
        <Ent show={step >= 0} delay={200}>
          <div className="doc-card" style={{ width: 470, fontSize: 19, padding: '22px 28px', background: 'rgba(18,21,40,0.6)' }}>
            <div className="f" style={{ color: palette.llm }}>Consulta do usuário</div>
            Quero uma roupa elegante.
          </div>
        </Ent>
      </div>

      {step >= 1 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 38 }}>“As palavras são exatamente iguais?”</div>
        </Ent>
      )}
      {step >= 2 && (
        <Ent show kind="pop">
          <Statement size="md" style={{ color: palette.text }}>Não.</Statement>
        </Ent>
      )}
      {step >= 3 && (
        <Ent show kind="pop">
          <div className="qline" style={{ fontSize: 34 }}>Mas o significado é parecido.</div>
        </Ent>
      )}
      {step >= 4 && (
        <Ent show kind="pop">
          <Pill accent={palette.rag} big>EMBEDDINGS</Pill>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s10 Embeddings + mapa 2D */
interface ClusterDef {
  name: string
  x: number
  y: number
  color: string
  words: string[]
  terms: string[]
}

const clusters: ClusterDef[] = [
  {
    name: 'moda', x: 350, y: 200, color: palette.rag,
    words: ['vestido elegante', 'vestido sofisticado', 'roupa social', 'moda'],
    terms: ['vestido', 'elegante', 'sofisticado', 'roupa', 'social', 'moda', 'look', 'estilo', 'blusa', 'camisa', 'sapato'],
  },
  {
    name: 'animais', x: 1030, y: 200, color: palette.agent,
    words: ['gato', 'cachorro', 'pet', 'animal'],
    terms: ['gato', 'cachorro', 'animal', 'animais', 'pet', 'pets', 'bicho', 'bichos', 'hamster', 'coelho', 'passaro', 'peixe', 'cao', 'gata', 'dog', 'cat'],
  },
  {
    name: 'pagamentos', x: 350, y: 430, color: palette.tool,
    words: ['cartão', 'pix', 'pagamento', 'cobrança'],
    terms: ['cartao', 'pix', 'pagamento', 'pagamentos', 'cobranca', 'boleto', 'checkout', 'transacao', 'transacoes'],
  },
  {
    name: 'banco de dados', x: 1030, y: 430, color: palette.llm,
    words: ['postgres', 'pgvector', 'banco de dados', 'query', 'tabelas'],
    terms: ['postgres', 'postgresql', 'pgvector', 'sql', 'banco', 'dados', 'database', 'query', 'tabela', 'tabelas', 'bd', 'relacional', 'select'],
  },
]

export function s10({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
        <div className="qline" style={{ fontSize: 34, maxWidth: 1200 }}>
          Embedding é uma forma de representar significado usando números.
        </div>
        <div className="rowc" style={{ gap: 26 }}>
          <Pill accent={palette.rag}>“vestido elegante”</Pill>
          <span className="mono" style={{ fontSize: 26, color: palette.faint }}>→</span>
          <span className="mono" style={{ fontSize: 24, color: palette.rag }}>[0.21, -0.83, 0.47, 0.12, …]</span>
        </div>
        <div className="note-line">O vetor real pode ter centenas ou milhares de dimensões.</div>
      </div>
    )
  }
  if (step === 1) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
        <div className="qline" style={{ fontSize: 34 }}>Para enxergarmos, vamos simplificar para 2D.</div>
        <div className="note-line" style={{ fontSize: 22 }}>Palavras com sentido parecido ficam perto. Digite uma frase e observe onde ela cai.</div>
      </div>
    )
  }
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
      <div className="qline" style={{ fontSize: 26 }}>Espaço simplificado de embeddings (2D):</div>
      <EmbeddingMap />
    </div>
  )
}

function EmbeddingMap() {
  const [q, setQ] = useState('')
  const norm = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const hit = clusters.find((c) => c.terms.some((w) => norm.includes(w)))
  const px = hit ? hit.x + ((norm.length * 37) % 80) - 40 : 640
  const py = hit ? hit.y + ((norm.length * 23) % 70) - 35 : 240

  const wordPos = (c: ClusterDef, wi: number) => {
    const w = c.words[wi]
    const W = c.words.length
    const angle = ((-90 + wi * (360 / W) + (w.length > 12 ? 14 : 0)) * Math.PI) / 180
    const r = 100
    return { x: c.x + r * Math.cos(angle), y: c.y + r * Math.sin(angle) }
  }

  return (
    <div style={{ width: '100%', maxWidth: 1250 }}>
      <div style={{ position: 'relative', height: 560, border: '1px solid var(--line-soft)', borderRadius: 16, background: 'radial-gradient(circle at center, rgba(88,166,255,0.04), transparent 70%)', overflow: 'hidden' }}>
        {clusters.map((c) => (
          <div key={c.name}>
            <div
              style={{
                position: 'absolute', left: c.x - 118, top: c.y - 118, width: 236, height: 236, borderRadius: '50%',
                border: `1px dashed ${rgba(c.color, 0.28)}`,
                boxShadow: `inset 0 0 60px ${rgba(c.color, 0.06)}`,
                pointerEvents: 'none',
              }}
            />
            {c.words.map((w, wi) => {
              const p = wordPos(c, wi)
              return (
                <button
                  key={w}
                  onClick={() => setQ(w)}
                  style={{
                    position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -50%)',
                    background: rgba(c.color, 0.16), color: c.color,
                    border: `1px solid ${rgba(c.color, 0.45)}`, borderRadius: 999,
                    padding: '7px 16px', fontFamily: 'var(--font-m)', fontSize: 15, cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {w}
                </button>
              )
            })}
            <div style={{ position: 'absolute', left: c.x - 12, top: c.y - 12, width: 24, height: 24, borderRadius: '50%', background: c.color, opacity: 0.95 }} />
            <div style={{ position: 'absolute', left: c.x, top: c.y - 52, transform: 'translateX(-50%)', fontFamily: 'var(--font-m)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: rgba(c.color, 0.8) }}>
              {c.name}
            </div>
          </div>
        ))}

        {q.trim() !== '' && hit && (
          <div
            style={{
              position: 'absolute', left: px, top: py, width: 18, height: 18, borderRadius: '50%', background: '#fff',
              boxShadow: `0 0 0 6px ${rgba(palette.rag, 0.3)}`, transition: 'left 0.7s var(--de), top 0.7s var(--de)',
            }}
          >
            <div style={{ position: 'absolute', top: -40, left: 10, width: 260, color: '#fff', fontFamily: 'var(--font-m)', fontSize: 14, whiteSpace: 'nowrap' }}>← sua frase: “{q}”</div>
          </div>
        )}
        {q.trim() !== '' && !hit && (
          <div style={{ position: 'absolute', left: 470, top: 6, color: 'var(--faint)', fontFamily: 'var(--font-m)', fontSize: 15 }}>
            nenhum grupo próximo… tente: vestido elegante · cachorro · pagamento · postgres
          </div>
        )}
      </div>

      <div className="rowc" style={{ marginTop: 16, gap: 20 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Digite uma frase… ex.: vestido elegante"
          style={{ flex: 1, maxWidth: 640, background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: '15px 20px', fontSize: 20, color: 'var(--text)', fontFamily: 'var(--font-m)' }}
        />
        <span className="small" style={{ color: 'var(--faint)' }}>Visualização simplificada para fins didáticos.</span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- s11 */
export function s11({ step }: { step: number }) {
  if (step <= 3) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
        <Ent show={step >= 0}>
          <div className="qline" style={{ fontSize: 32 }}>Precisamos guardar esses vetores em algum lugar para pesquisá-los rápido.</div>
        </Ent>

        <div className="rowc" style={{ gap: 26, alignItems: 'center' }}>
          <div className="col" style={{ gap: 12 }}>
            {['CHUNK 01', 'CHUNK 02', 'CHUNK 03', 'CHUNK 04'].map((c, i) => (
              <Ent key={c} show={step >= 1} delay={i * 150}>
                <div className="chunk" style={{ fontSize: 14, display: 'flex', gap: 12, alignItems: 'center', padding: '7px 14px' }}>
                  <span className="lab" style={{ left: 8 }}>{c}</span>
                  <span className="small" style={{ color: palette.rag }}>VETOR · [· · · · · ·]</span>
                </div>
              </Ent>
            ))}
          </div>
          <span className="mono" style={{ fontSize: 34, color: palette.rag }}>→</span>
          <Ent show={step >= 2} delay={200} kind="pop">
            <NodeBox accent={palette.rag} title="VECTOR DATABASE" glow titleMono={false} style={{ minWidth: 320, padding: '24px 34px' }}>
              {step >= 3 && (
                <div className="mono" style={{ marginTop: 12, fontSize: 15, lineHeight: 1.9, color: palette.muted }}>
                  <div style={{ color: palette.rag }}>VECTOR</div>
                  <div style={{ color: palette.text }}>METADATA · fonte do chunk</div>
                  <div style={{ color: palette.text }}>DOCUMENT · products.pdf</div>
                  <div style={{ color: palette.text }}>CHUNK · #17</div>
                </div>
              )}
            </NodeBox>
          </Ent>
        </div>
      </div>
    )
  }
  if (step === 4) {
    return (
      <Ent key="q" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="qline" style={{ fontSize: 40 }}>“Então RAG é um Vector Database?”</div>
      </Ent>
    )
  }
  return (
    <Ent key="ans" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="rowc" style={{ gap: 60 }}>
        <Statement size="lg" style={{ color: palette.rag, fontSize: 96 }}>NÃO.</Statement>
        <div className="col" style={{ gap: 12, textAlign: 'left', maxWidth: 620 }}>
          <div className="note-line" style={{ textAlign: 'left', fontSize: 27 }}>
            <strong style={{ color: palette.rag }}>RAG</strong> é o processo.
          </div>
          <div className="note-line" style={{ textAlign: 'left', fontSize: 27 }}>
            Vector Database é uma peça que pode fazer parte desse processo.
          </div>
        </div>
      </div>
    </Ent>
  )
}

/* ---------------------------------------------------------------- s12 busca */
export function s12({ step }: { step: number }) {
  const [topK, setTopK] = useState(3)
  const [thr, setThr] = useState(0.55)
  const included = retrievalResults.filter((r) => r.score >= thr).slice(0, topK)
  const inIds = included.map((r) => r.id)
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20 }}>
      <Ent show={step >= 0}>
        <Bubble who="USUÁRIO" kind="user">Qual é o público do Vestido Aurora?</Bubble>
      </Ent>

      {step >= 1 && (
        <Ent show>
          <div className="rowc" style={{ gap: 14 }}>
            {[
              { t: 'PERGUNTA', c: palette.rag },
              { t: 'EMBEDDING DA PERGUNTA', c: palette.rag },
              { t: 'BUSCA POR SIMILARIDADE', c: palette.tool },
              { t: 'VECTOR DATABASE', c: palette.rag },
            ].map((s, i) => (
              <div key={s.t} className="rowc" style={{ gap: 14 }}>
                {i > 0 && <span className="mono" style={{ color: 'var(--faint)', fontSize: 24 }}>→</span>}
                <Ent show={step >= i + 1} delay={i * 200}>
                  <Pill accent={s.c}>{s.t}</Pill>
                </Ent>
              </div>
            ))}
          </div>
        </Ent>
      )}

      {step >= 3 && (
        <div className="rowc" style={{ gap: 44, alignItems: 'flex-start' }}>
          <div className="col" style={{ width: 560 }}>
            {retrievalResults.map((r, i) => (
              <Ent key={r.id} show={step >= 3} delay={i * 220}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', margin: '6px 0',
                    borderRadius: 10, border: '1px solid var(--line-soft)',
                    background: inIds.includes(r.id) ? rgba(palette.rag, 0.08) : 'transparent',
                    opacity: inIds.includes(r.id) ? 1 : 0.4,
                    transition: 'opacity .4s, background .4s, border-color .4s',
                    borderColor: inIds.includes(r.id) ? rgba(palette.rag, 0.4) : undefined,
                  }}
                >
                  <span className="mono" style={{ color: palette.rag, fontSize: 15 }}>{r.id}</span>
                  <span style={{ flex: 1, fontSize: 16, color: 'var(--muted)' }}>{r.text}</span>
                  <span className="mono" style={{ color: r.score >= thr ? palette.good : palette.bad, fontSize: 17 }}>{r.score.toFixed(2)}</span>
                  <span className="small" style={{ width: 96 }}>{inIds.includes(r.id) ? '→ contexto' : 'fora'}</span>
                </div>
              </Ent>
            ))}
            <div className="rowc" style={{ justifyContent: 'flex-start', gap: 14, marginTop: 8 }}>
              <span className="eyebrow">Top-K</span>
              {[1, 3, 5].map((k) => (
                <button key={k} onClick={() => setTopK(k)} className="ctrl" style={topK === k ? { color: palette.rag, borderColor: palette.rag } : {}}>{k}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 10 }}>
              <span className="eyebrow">Similarity threshold · {thr.toFixed(2)}</span>
              <input type="range" className="slider" style={{ flex: 1 }} min={0.4} max={0.95} step={0.01} value={thr} onChange={(e) => setThr(Number(e.target.value))} />
            </div>
          </div>
          <Ent show={step >= 4}>
            <div className="col" style={{ gap: 10, paddingTop: 6 }}>
              <span className="eyebrow">ENTRA NO CONTEXTO</span>
              <div className="col" style={{ gap: 10 }}>
                {included.map((r) => (
                  <div key={r.id} className="chunk" style={{ fontSize: 14, background: rgba(palette.good, 0.06) }}>
                    <span className="lab" style={{ color: palette.good }}>{r.id}</span>
                    {r.text}
                  </div>
                ))}
              </div>
            </div>
          </Ent>
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s13 RAG completo */
export function s13({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
      {step >= 0 && (
        <Ent show>
          <Bubble who="USUÁRIO" kind="user">Qual é o público do Vestido Aurora?</Bubble>
        </Ent>
      )}

      {step >= 1 && (
        <div className="rowc" style={{ gap: 26 }}>
          <Ent show delay={100}>
            <Pill accent={palette.rag}>buscar informações relevantes</Pill>
          </Ent>
          {step >= 2 && (
            <Ent show delay={300}>
              <div className="col" style={{ gap: 4 }}>
                <Pill accent={palette.tool}>products.pdf</Pill>
                <span className="eyebrow" style={{ textAlign: 'center' }}>Chunk #17</span>
              </div>
            </Ent>
          )}
        </div>
      )}

      {step >= 3 && (
        <Ent show delay={250}>
          <div className="rowc" style={{ gap: 24 }}>
            <Pill accent={palette.llm}>pergunta + contexto → LLM</Pill>
          </div>
        </Ent>
      )}

      {step >= 4 && (
        <Ent show delay={300} kind="pop">
          <div className="doc-card" style={{ width: 880, fontSize: 24, padding: '22px 30px', background: rgba(palette.llm, 0.05) }}>
            O Vestido Aurora é direcionado principalmente para pessoas entre 25 e 40 anos e possui um posicionamento elegante e sofisticado.
            <div style={{ marginTop: 16, color: 'var(--faint)', fontSize: 16 }}>fonte: products.pdf · Chunk #17</div>
          </div>
        </Ent>
      )}

      {step >= 5 && (
        <Ent show kind="pop">
          <Statement size="lg" style={{ fontSize: 62 }}>RAG ajuda a IA a encontrar o que ela precisa saber.</Statement>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s13b pause RAG */
export function s13b({ step }: { step: number }) {
  const ok = ['recupera conhecimento relevante', 'adiciona contexto à LLM', 'pode trabalhar com dados privados']
  const no = ['não é um agente', 'não executa automaticamente ações nos nossos serviços']
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 44 }}>
      <Ent show={step >= 0}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 8 }}>PAUSA CONCEITUAL</div>
        <NodeBox accent={palette.rag} title="RAG" glow style={{ padding: '26px 96px', textAlign: 'center' }} />
      </Ent>
      <div className="rowc" style={{ gap: 70, alignItems: 'flex-start' }}>
        <div className="col" style={{ gap: 14 }}>
          {ok.map((t, i) => (
            <Ent key={t} show={step >= 1} delay={i * 180}>
              <div className="row" style={{ gap: 12, fontSize: 25 }}>
                <span className="ok">✓</span> <span style={{ color: 'var(--text)' }}>{t}</span>
              </div>
            </Ent>
          ))}
        </div>
        <div className="col" style={{ gap: 14 }}>
          {no.map((t, i) => (
            <Ent key={t} show={step >= 2} delay={i * 180}>
              <div className="row" style={{ gap: 12, fontSize: 25 }}>
                <span className="no">✕</span> <span style={{ color: 'var(--muted)' }}>{t}</span>
              </div>
            </Ent>
          ))}
        </div>
      </div>
    </div>
  )
}
