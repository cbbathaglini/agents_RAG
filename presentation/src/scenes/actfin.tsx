import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Ent, Statement, Pill, cx } from '../components/ui'
import { palette, rgba } from '../theme'
import { whoDoesTasks, useCases, myths, mythPalette, matrixCols, matrixColColors, matrixRows, ecosystem } from '../data/quiz'
import { glossary } from '../data/glossary'
import type { SceneProps } from '../presentation/types'

/* ---------------------------------------------------------------- s00 capa */
export function s00() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
      <div className="eyebrow" style={{ letterSpacing: '0.3em' }}>uma conversa guiada</div>
      <Ent show delay={120}>
        <Statement size="xl" style={{ fontSize: 130, lineHeight: 0.98 }}>
          RAG · AGENTES<br />· MULTI-AGENTE
        </Statement>
      </Ent>
      <Ent show delay={420}>
        <div className="qline" style={{ fontSize: 34, color: 'var(--muted)', fontWeight: 400 }}>
          Do dado à decisão: quando o sistema aprende a conhecer e a agir.
        </div>
      </Ent>
      <Ent show delay={700}>
        <div className="rowc" style={{ gap: 14, marginTop: 10 }}>
          {[
            ['LLM', palette.llm],
            ['RAG', palette.rag],
            ['Tool', palette.tool],
            ['Agent', palette.agent],
            ['Multi-Agent', palette.agent],
          ].map(([t, c]) => (
            <span key={t as string} className="pill" style={{ color: c as string, borderColor: rgba(c as string, 0.4), fontSize: 15 }}>
              {t}
            </span>
          ))}
        </div>
      </Ent>
    </div>
  )
}

/* ---------------------------------------------------------------- s33 quem faz o quê */
export function s33() {
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const task = whoDoesTasks[i]
  const done = i >= whoDoesTasks.length
  if (done) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18 }}>
        <Ent show kind="pop">
          <Statement size="lg" style={{ fontSize: 64 }}>Quem decide ≠ quem executa.</Statement>
          <div className="note-line" style={{ marginTop: 12 }}>Deu para separar as responsabilidades de cada peça?</div>
        </Ent>
      </div>
    )
  }
  const correct = task.answerIndex
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
      <Ent show>
        <div className="eyebrow" style={{ textAlign: 'center' }}>QUEM FAZ O QUÊ · {i + 1}/{whoDoesTasks.length}</div>
        <div className="qline" style={{ fontSize: 40 }}>{task.task}</div>
      </Ent>
      <div className="rowc" style={{ gap: 18, flexWrap: 'wrap' }}>
        {task.options.map((o, oi) => {
          const state = pick === null ? 'idle' : oi === correct ? 'ok' : oi === pick ? 'bad' : 'dim'
          return (
            <button
              key={o.label}
              onClick={() => pick === null && setPick(oi)}
              className={cx('ctrl')}
              style={{
                fontSize: 24, padding: '16px 34px', height: 'auto', borderRadius: 14,
                borderColor: state === 'ok' ? palette.good : state === 'bad' ? palette.bad : rgba(o.color, 0.5),
                color: state === 'ok' ? palette.good : state === 'bad' ? palette.bad : o.color,
                opacity: state === 'dim' ? 0.35 : 1,
              }}
            >
              {state === 'ok' && '✓ '}
              {state === 'bad' && '✕ '}
              {o.label}
            </button>
          )
        })}
      </div>
      {pick !== null && (
        <Ent show kind="pop">
          <div className="note-line" style={{ maxWidth: 800, fontSize: 22 }}>
            {pick === correct ? 'Correto! ' : 'Atenção: '}
            {task.why}
          </div>
          <button className="ctrl" style={{ fontSize: 16, marginTop: 12 }} onClick={() => { setPick(null); setI((x) => x + 1) }}>
            próxima tarefa →
          </button>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s34 o que devo usar */
export function s34() {
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<string | null>(null)
  const c = useCases[i]
  const done = i >= useCases.length
  if (done) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18 }}>
        <Ent show kind="pop">
          <Statement size="lg" style={{ fontSize: 58 }}>Comece simples.<br />Adicione inteligência onde existe decisão de verdade.</Statement>
        </Ent>
      </div>
    )
  }
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 22 }}>
      <Ent show>
        <div className="eyebrow" style={{ textAlign: 'center' }}>O QUE DEVO USAR · {i + 1}/{useCases.length}</div>
        <div className="qline" style={{ fontSize: 36 }}>{c.title}</div>
      </Ent>
      <div className="rowc" style={{ gap: 16, flexWrap: 'wrap' }}>
        {c.options.map((o) => {
          const decided = pick !== null
          const ok = decided && o === c.answer
          const bad = decided && pick === o && o !== c.answer
          return (
            <button key={o} onClick={() => pick === null && setPick(o)} className={cx('ctrl')} style={{
              fontSize: 22, padding: '14px 26px', height: 'auto', borderRadius: 12,
              borderColor: ok ? palette.good : bad ? palette.bad : undefined,
              color: ok ? palette.good : bad ? palette.bad : undefined,
            }}>
              {ok && '✓ '}{bad && '✕ '}{o}
            </button>
          )
        })}
      </div>
      {pick !== null && (
        <Ent show kind="pop">
          <div className="note-line" style={{ maxWidth: 860, fontSize: 23 }}>
            {pick === c.answer ? 'Correto. ' : `Na verdade: ${c.answer}. `}
            {c.why}
          </div>
          <button className="ctrl" style={{ fontSize: 16, marginTop: 12 }} onClick={() => { setPick(null); setI((x) => x + 1) }}>próximo caso →</button>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s35 mito ou verdade */
export function s35() {
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<boolean | null>(null)
  const m = myths[i]
  const done = i >= myths.length
  if (done) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18 }}>
        <Ent show kind="pop">
          <Statement size="lg" style={{ fontSize: 60 }}>O Agent não ganha superpoderes.</Statement>
          <div className="note-line" style={{ marginTop: 12 }}>Nem o RAG. Nem o Agent. Cada peça no seu lugar.</div>
        </Ent>
      </div>
    )
  }
  const truth = m.truth
  const res = mythPalette[truth ? 'true' : 'false']
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 22 }}>
      <Ent show>
        <div className="eyebrow" style={{ textAlign: 'center' }}>MITO OU VERDADE · {i + 1}/{myths.length}</div>
        <div className="qline" style={{ fontSize: 38 }}>“{m.text}”</div>
      </Ent>
      {pick === null ? (
        <div className="rowc" style={{ gap: 18 }}>
          <button className="btn btn--big" style={{ color: palette.bad, borderColor: rgba(palette.bad, 0.5) }} onClick={() => setPick(false)}>MITO</button>
          <button className="btn btn--big" style={{ color: palette.good, borderColor: rgba(palette.good, 0.5) }} onClick={() => setPick(true)}>VERDADE</button>
        </div>
      ) : (
        <Ent show kind="pop">
          <div className="rowc" style={{ gap: 18 }}>
            <span className="mono" style={{ fontSize: 40, color: res.color, fontWeight: 700 }}>
              {res.glyph} {res.label}
            </span>
            <div className="note-line" style={{ maxWidth: 720, textAlign: 'left', fontSize: 21 }}>{m.why}</div>
          </div>
          <div className="rowc" style={{ marginTop: 16 }}>
            <button className="ctrl" style={{ fontSize: 16 }} onClick={() => { setPick(null); setI((x) => x + 1) }}>próxima frase →</button>
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s36 ecossistema real */
export function s36() {
  const [gi, setGi] = useState(0)
  const g = ecosystem[gi]
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18, maxWidth: 1500, margin: '0 auto' }}>
      <Ent show>
        <div className="qline" style={{ fontSize: 30 }}>Ferramentas reais — agora que os conceitos já fazem sentido.</div>
      </Ent>
      <div className="rowc" style={{ gap: 12, flexWrap: 'wrap' }}>
        {ecosystem.map((eg, i) => (
          <button key={eg.group} onClick={() => setGi(i)} className={cx('ctrl')} style={{ fontSize: 16, padding: '10px 18px', height: 'auto', color: gi === i ? eg.color : undefined, borderColor: gi === i ? eg.color : undefined }}>
            {eg.group}
          </button>
        ))}
      </div>

      <div className="rowc" style={{ gap: 14, alignItems: 'center' }}>
        <span style={{ width: 12, height: 12, borderRadius: 4, background: g.color }} />
        <span className="qline" style={{ fontSize: 24, textAlign: 'left' }}>{g.group}</span>
        <span className="small" style={{ color: 'var(--muted)', fontSize: 17 }}>{g.note}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, width: '100%' }}>
        {g.items.map((it) => (
          <div key={it.name} style={{ border: `1px solid ${rgba(g.color, 0.28)}`, borderRadius: 14, padding: '18px 22px', background: rgba(g.color, 0.03) }}>
            <div className="mono" style={{ fontSize: 21, color: g.color, fontWeight: 600 }}>{it.name}</div>
            <div className="note-line" style={{ textAlign: 'left', fontSize: 17, marginTop: 8 }}>{it.desc}</div>
          </div>
        ))}
      </div>

      <Ent show kind="fade">
        <div className="note-line" style={{ fontSize: 17 }}>Uma frase por ferramenta. O objetivo é reconhecer categorias, não decorar catálogo.</div>
      </Ent>
    </div>
  )
}

/* ---------------------------------------------------------------- s37 matriz */
const glyphLegend: [string, string][] = [
  ['✓✓', 'papel central'],
  ['✓', 'consegue / participa'],
  ['○', 'só com outra peça por dentro'],
  ['—', 'não faz'],
]

export function s37({ step }: SceneProps) {
  const [ex, setEx] = useState<string | null>(null)
  const rowsToShow = step >= 1 ? (step >= 2 ? (step >= 3 ? matrixRows.length : 6) : 3) : 0
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, maxWidth: 1580, margin: '0 auto' }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 28 }}>Quando usar o quê?</div>
      </Ent>
      <div className="rowc" style={{ gap: 22, flexWrap: 'wrap' }}>
        {glyphLegend.map(([g, l]) => (
          <span key={g} className="rowc" style={{ gap: 7, fontFamily: 'var(--font-m)', fontSize: 14, color: 'var(--muted)' }}>
            <b style={{ color: 'var(--text)', fontSize: 16 }}>{g}</b>
            {l}
          </span>
        ))}
      </div>
      <div className="note-line" style={{ fontSize: 16, minHeight: 24, color: ex ? palette.tool : 'var(--faint)' }}>
        {ex ? `Ex.: ${ex}` : 'Passe o mouse (ou toque) em uma célula para ver um exemplo.'}
      </div>
      <div className="matrix">
        <div className="col-h">
          <div className="mcell mcell--head" style={{ borderLeft: '1px solid var(--line-soft)', color: 'var(--faint)', fontSize: 14, justifyContent: 'flex-start', padding: '0 18px' }}>Capacidade \\ Peça</div>
          {matrixRows.slice(0, rowsToShow).map((r) => (
            <div key={r.row} className="mcell mcell--rowlab">{r.row}</div>
          ))}
        </div>
        {matrixCols.map((col, ci) => (
          <div className="col" key={col}>
            <div className="mcell mcell--head" style={{ color: matrixColColors[ci] }}>{col}</div>
            {matrixRows.slice(0, rowsToShow).map((r) => {
              const cell = r.cells[ci]
              return (
                <div key={r.row} className="mcell" onMouseEnter={() => setEx(cell.example)} onMouseLeave={() => setEx(null)} style={{ cursor: 'help' }}>
                  {cell.value}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {step >= 4 && (
        <Ent show>
          <div className="note-line" style={{ fontSize: 18 }}>Quanto mais previsível, mais barato. Quanto mais decisão, mais você pensa em Agent.</div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s38 mapa mental */
const mapRows: { who: string; color: string; to: string[] }[] = [
  { who: 'CONHECER', color: palette.rag, to: ['RAG'] },
  { who: 'DECIDIR', color: palette.agent, to: ['AGENT'] },
  { who: 'AGIR', color: palette.tool, to: ['TOOLS', 'MICROSSERVIÇOS'] },
  { who: 'COORDENAR', color: palette.agent, to: ['MULTI-AGENT'] },
]

export function s38({ step }: SceneProps) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 30 }}>O mapa mental final — cada ideia no seu lugar.</div>
      </Ent>
      <div className="col" style={{ gap: 16, alignItems: 'center' }}>
        {mapRows.map((r, i) => {
          const show = step >= i + 1
          return (
            <Ent key={r.who} show={show} delay={show ? 0 : 0} kind="pop">
              <div className="rowc" style={{ gap: 26 }}>
                <Pill accent={r.color}>{r.who}</Pill>
                <span className="mono" style={{ color: 'var(--faint)', fontSize: 26 }}>→</span>
                <div className="rowc" style={{ gap: 12 }}>
                  {r.to.map((t, ti) => (
                    <Pill key={t} accent={r.to.length > 1 && ti === 0 ? palette.tool : r.color}>{t}</Pill>
                  ))}
                </div>
              </div>
            </Ent>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- s39 final */
const finals: { text: string; color: string }[] = [
  { text: 'RAG ajuda a IA a encontrar o que ela precisa saber.', color: palette.rag },
  { text: 'Agents ajudam a decidir o que precisa acontecer.', color: palette.agent },
  { text: 'Tools conectam decisões às capacidades reais do sistema.', color: palette.tool },
  { text: 'Microsserviços continuam executando o trabalho.', color: palette.ms },
  { text: 'Multi-Agent divide responsabilidades quando a complexidade realmente exige.', color: palette.agent },
]

export function s39({ step }: SceneProps) {
  const showFinal = step >= 6
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, maxWidth: 1560, margin: '0 auto' }}>
      <Ent show={step >= 0}>
        <div className="eyebrow" style={{ textAlign: 'center' }}>RECAPITULANDO · O QUE FICA</div>
      </Ent>

      <div className="col" style={{ gap: 2, width: '100%', maxWidth: 1380 }}>
        {finals.map((f, i) => (
          <Ent key={i} show={step >= i + 1} delay={step >= i + 1 ? 0 : 0}>
            <div
              style={{
                display: 'flex', gap: 20, alignItems: 'center',
                borderBottom: '1px solid var(--line-soft)', padding: '12px 0',
                opacity: showFinal ? 0.3 : 1,
                transition: 'opacity var(--d) ease',
              }}
            >
              <span style={{ width: 15, height: 15, borderRadius: 4, background: f.color, flex: 'none' }} />
              <span className="disp" style={{ fontSize: 31, color: 'var(--text)' }}>{f.text}</span>
            </div>
          </Ent>
        ))}
      </div>

      {step >= 5 && !showFinal && (
        <Ent show kind="fade">
          <div className="note-line" style={{ fontSize: 22 }}>Cinco peças, cada uma no seu papel.</div>
        </Ent>
      )}

      {showFinal && (
        <Ent show kind="pop">
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <Statement size="lg" style={{ fontSize: 88, maxWidth: 1520 }}>
              USE A ARQUITETURA MAIS SIMPLES<br />QUE RESOLVA O PROBLEMA.
            </Statement>
            <div className="note-line" style={{ marginTop: 20 }}>
              Comece simples. Adicione inteligência onde existe uma decisão de verdade.
            </div>
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- glossário extra (não é cena) */
export function GlossaryPreview() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="rowc" style={{ gap: 10, flexWrap: 'wrap', maxWidth: 1560, margin: '0 auto' }}>
      {glossary.map((g) => (
        <span key={g.term} onClick={() => setOpen(open === g.term ? null : g.term)} onMouseEnter={() => setOpen(g.term)} onMouseLeave={() => setOpen(null)} style={{ position: 'relative', cursor: 'help' }}>
          <span className="g-term" style={{ color: g.color, borderColor: rgba(g.color, 0.4), fontFamily: 'var(--font-m)', fontSize: 24 }}>{g.term}</span>
          {open === g.term && (
            <span className="g-pop">
              <h4 style={{ color: g.color }}>{g.term}</h4>
              <p><b>O que é?</b> {g.oque}</p>
              <p><b>Para que serve?</b> {g.para}</p>
              <p className="ex"><b>Exemplo:</b> {g.exemplo}</p>
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

export function sGloss() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div className="eyebrow" style={{ textAlign: 'center' }}>glossário rápido</div>
      <div className="qline" style={{ fontSize: 30, marginBottom: 6 }}>Passe o mouse (ou toque) em um termo.</div>
      <GlossaryPreview />
      <div className="note-line" style={{ fontSize: 16 }}>O que é · Para que serve · Exemplo no nosso sistema.</div>
    </div>
  )
}

/* ---------------------------------------------------------------- s40 contato final */
const linkedinUrl = 'https://www.linkedin.com/in/carine-bertagnolli-945038148/'

export function s40() {
  const [qr, setQr] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    QRCode.toDataURL(linkedinUrl, {
      width: 360,
      margin: 1,
      color: { dark: '#10121a', light: '#f7f8fb' },
      errorCorrectionLevel: 'M',
    }).then((u) => {
      if (alive) setQr(u)
    })
    return () => {
      alive = false
    }
  }, [])
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <div className="eyebrow" style={{ textAlign: 'center' }}>ACHEI ÚTIL? VAMOS CONVERSAR</div>
      <div className="qline" style={{ fontSize: 44 }}>
        Me chama no LinkedIn — adoro falar sobre<br />RAG, agents e arquiteturas de IA!
      </div>

      <div className="rowc" style={{ gap: 64, alignItems: 'center', marginTop: 4 }}>
        <div className="col" style={{ gap: 16, alignItems: 'flex-start', maxWidth: 640 }}>
          <div className="disp" style={{ fontSize: 44, fontWeight: 700 }}>Carine Bertagnolli</div>
          <div className="note-line" style={{ textAlign: 'left', fontSize: 23 }}>
            Dúvidas, projetos e parcerias são bem-vindos — pode me chamar por lá para bater um papo.
          </div>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ color: '#4fa0ff', borderColor: 'rgba(88,166,255,0.5)', fontSize: 22 }}
          >
            linkedin.com/in/carine-bertagnolli-945038148 ↗
          </a>
        </div>

        <div className="col" style={{ alignItems: 'center', gap: 12 }}>
          <div
            style={{
              background: '#f7f8fb',
              padding: 14,
              borderRadius: 18,
              boxShadow: '0 30px 90px -30px rgba(88,166,255,0.55)',
              width: 336,
              height: 336,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {qr ? (
              <img src={qr} alt="QR code com o link do LinkedIn da Carine Bertagnolli" width={308} height={308} style={{ display: 'block' }} />
            ) : (
              <span className="mono" style={{ color: '#333' }}>
                gerando QR…
              </span>
            )}
          </div>
          <div className="note-line" style={{ fontSize: 17 }}>Aponte a câmera do celular</div>
        </div>
      </div>
    </div>
  )
}
