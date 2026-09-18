import { useEffect, useState } from 'react'
import { Ent, NodeBox, Statement, Pill, Bubble, cx } from '../components/ui'
import { palette, rgba } from '../theme'
import { requests, tools } from '../data/services'

/* ---------------------------------------------------------------- s14 */
export function s14({ step }: { step: number }) {
  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="split" style={{ gap: 80 }}>
        <div className="col" style={{ gap: 18, alignItems: 'center' }}>
          <Ent show={step >= 0}>
            <Bubble who="USUÁRIO" kind="user">Qual é o público do Vestido Aurora?</Bubble>
            <div className="rowc" style={{ gap: 20, marginTop: 22 }}>
              <Pill accent={palette.rag}>RAG</Pill>
              <span className="mono" style={{ color: 'var(--faint)' }}>→</span>
              <Pill accent={palette.good}>resposta correta ✓</Pill>
            </div>
          </Ent>
        </div>
        <div className="col" style={{ gap: 18, alignItems: 'center' }}>
          <Ent show={step >= 1}>
            <Bubble who="USUÁRIO" kind="user">Crie um vídeo do Vestido Aurora.</Bubble>
            <div className="rowc" style={{ gap: 20, marginTop: 22 }}>
              <Pill accent={palette.rag} dim>RAG</Pill>
              <span className="mono" style={{ color: 'var(--faint)' }}>→</span>
              <Pill accent={palette.bad} dim>???</Pill>
            </div>
          </Ent>
        </div>
      </div>

      {step >= 2 && (
        <Ent show kind="fade">
          <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--overlay)', padding: '0 90px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36, width: '100%' }}>
              <div
                className="statement st-xl"
                style={{
                  fontSize: 168,
                  letterSpacing: '-0.05em',
                  whiteSpace: 'nowrap',
                  opacity: step >= 3 ? 0.4 : 1,
                  transition: 'opacity var(--d) ease',
                  color: 'var(--text)',
                }}
              >
                SABER <span style={{ color: palette.bad }}>≠</span> FAZER
              </div>
              {step >= 3 && (
                <div
                  style={{
                    border: '1px solid rgba(88,166,255,0.35)',
                    background: 'var(--overlay-panel)',
                    borderRadius: 18,
                    padding: '30px 52px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    maxWidth: 1200,
                  }}
                >
                  <div className="qline" style={{ fontSize: 33 }}>Agora não precisamos apenas de conhecimento.</div>
                  <div className="qline" style={{ fontSize: 33 }}>
                    Precisamos <strong style={{ color: palette.tool }}>executar ações</strong>.
                  </div>
                </div>
              )}
            </div>
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s15 Tools */
export function s15({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 36 }}>Disponibilizamos três capacidades para a IA.</div>
      </Ent>

      <div className="col" style={{ gap: 16 }}>
        {tools.slice(0, 3).map((t, i) => (
          <Ent key={t.id} show={step >= 1} delay={i * 220}>
            <div className="rowc" style={{ gap: 22, justifyContent: 'center' }}>
              <span className="mono" style={{ fontSize: 25, color: palette.tool, minWidth: 360, textAlign: 'right' }}>{t.fn}</span>
              <span className="mono" style={{ color: 'var(--faint)' }}>→</span>
              <span className="mono" style={{ color: palette.ms, fontSize: 18, minWidth: 170 }}>{t.endpoint}</span>
              <span className="mono" style={{ color: palette.rag, fontSize: 18 }}>· {t.executedBy}</span>
            </div>
          </Ent>
        ))}
      </div>

      {step >= 2 && (
        <Ent show kind="pop">
          <div className="note-line" style={{ maxWidth: 1000, marginTop: 12 }}>
            Uma Tool é uma <strong style={{ color: palette.tool }}>capacidade que disponibilizamos</strong> para a IA utilizar.
          </div>
        </Ent>
      )}

      {step >= 3 && (
        <Ent show kind="pop">
          <Statement size="md" style={{ fontSize: 56 }}>A IA não gera a imagem magicamente.</Statement>
        </Ent>
      )}

      {step >= 4 && (
        <Ent show>
          <div className="rowc" style={{ gap: 16, flexWrap: 'wrap' }}>
            {['AGENT', 'TOOL', 'HTTP', 'MICROSSERVIÇO', 'RESULTADO'].map((s, i) => (
              <div key={s} className="rowc" style={{ gap: 12 }}>
                {i > 0 && <span className="mono" style={{ color: 'var(--faint)', fontSize: 24 }}>↓</span>}
                <Pill accent={i === 2 ? palette.ms : i === 4 ? palette.good : palette.agent}>{s}</Pill>
              </div>
            ))}
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s15b Tool Inspector */
export function s15b() {
  const [active, setActive] = useState(tools[0])
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show>
        <div className="qline" style={{ fontSize: 32 }}>TOOL INSPECTOR · clique em uma capacidade</div>
      </Ent>

      <div className="rowc" style={{ gap: 16, flexWrap: 'wrap' }}>
        {tools.slice(0, 3).map((t) => (
          <button key={t.id} onClick={() => setActive(t)} className={cx('ctrl')} style={{ fontSize: 18, padding: '14px 22px', height: 'auto', borderRadius: 12, ...(active.id === t.id ? { color: palette.tool, borderColor: palette.tool } : {}) }}>
            <span className="mono">{t.fn}</span>
          </button>
        ))}
      </div>

      <div className="rowc" style={{ gap: 40, alignItems: 'stretch', minHeight: 340 }}>
        <div className="doc-card" style={{ width: 520, background: rgba(palette.tool, 0.04), fontSize: 18 }}>
          <div className="f" style={{ color: palette.tool }}>O que faz?</div>
          <p style={{ color: 'var(--text)', fontSize: 24, lineHeight: 1.4 }}>{active.what}</p>
          <div className="f" style={{ marginTop: 18 }}>Entrada</div>
          <pre className="mono" style={{ color: palette.rag }}>{active.params}</pre>
        </div>
        <div className="doc-card" style={{ width: 420, fontSize: 18 }}>
          <div className="f" style={{ color: palette.rag }}>Por baixo</div>
          <div className="mono" style={{ color: palette.ms, fontSize: 24, margin: '10px 0' }}>{active.endpoint}</div>
          <div className="f" style={{ marginTop: 18 }}>Executado por</div>
          <div className="mono" style={{ color: palette.text, fontSize: 24, margin: '10px 0' }}>{active.executedBy}</div>
        </div>
      </div>
      <div className="note-line" style={{ fontSize: 17 }}>A IA decide <strong>qual</strong> capacidade usar — quem <strong>executa</strong> é o serviço de verdade.</div>
    </div>
  )
}

/* ---------------------------------------------------------------- s16 O que é Agent */
export function s16({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
      {step >= 0 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 30 }}>De volta aos pedidos:</div>
          <div className="rowc" style={{ gap: 18, flexWrap: 'wrap', marginTop: 18 }}>
          {requests.map((r) => (
            <Pill key={r.id} accent={palette.rag}>{r.long}</Pill>
          ))}
          </div>
        </Ent>
      )}
      {step >= 1 && (
        <Ent show kind="pop">
          <div className="qline" style={{ fontSize: 40 }}>“Quem escolhe qual ferramenta usar?”</div>
        </Ent>
      )}
      {step >= 2 && (
        <Ent show kind="pop">
          <div className="col" style={{ gap: 14, alignItems: 'center', maxWidth: 900 }}>
            {[
              { label: 'LLM', desc: 'DeepSeek Chat interpreta e decide', color: palette.llm },
              { label: 'Instruções', desc: 'System prompt ou skill.md: papel, regras e restrições', color: palette.rag },
              { label: 'Estado', desc: 'messages[]: histórico da conversa acumulado', color: palette.tool },
              { label: 'Tools disponíveis', desc: 'search_knowledge, generate_image, etc.', color: palette.good },
            ].map((p, i) => (
              <Ent key={p.label} show={step >= i + 2} delay={i * 160} kind="pop">
                <NodeBox accent={p.color} title={p.label} titleMono={false} small style={{ padding: '12px 28px', minWidth: 600 }}>
                  <span className="small" style={{ color: 'var(--muted)' }}>{p.desc}</span>
                </NodeBox>
              </Ent>
            ))}
          </div>
        </Ent>
      )}
      {step >= 6 && (
        <Ent show kind="pop">
          <div className="note-line" style={{ maxWidth: 900, marginTop: 6 }}>
            O Agent usa a LLM para interpretar o objetivo, consultar o <strong style={{ color: palette.tool }}>estado</strong> (o que já aconteceu), seguir as <strong style={{ color: palette.rag }}>instruções</strong> (system prompt ou skill.md) e escolher qual <strong style={{ color: palette.good }}>tool</strong> executar.
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s16b loop do agent */
export function s16b({ step }: { step: number }) {
  const loop = ['USUÁRIO', 'OBJETIVO', 'AGENT', 'DECIDE', 'SELECIONA TOOL', 'EXECUTA', 'OBSERVA RESULTADO', 'PRÓXIMO PASSO']
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (step < 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIdx((i) => (i + 1) % loop.length), 1000)
    return () => clearInterval(id)
  }, [step, loop.length])
  const c = (i: number) => (i === idx ? palette.agent : i < idx ? palette.good : 'var(--faint)')
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
      {step >= 0 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 30 }}>A definição visual de um Agent é um ciclo:</div>
        </Ent>
      )}
      {step >= 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 300px)', gap: 18, marginTop: 10 }}>
          {loop.map((l, i) => (
            <Ent key={l} show={step >= 1} delay={i * 120}>
              <div style={{ border: `1px solid ${rgba(c(i), 0.4)}`, background: rgba(c(i), 0.05), borderRadius: 12, padding: '16px 10px', textAlign: 'center', fontFamily: 'var(--font-m)', fontWeight: 700, fontSize: 17, letterSpacing: '0.06em', color: c(i), transition: 'all 0.5s' }}>
                {String(i + 1).padStart(2, '0')} · {l}
              </div>
            </Ent>
          ))}
        </div>
      )}
      {step >= 2 && (
        <Ent show>
          <div className="note-line">Depois do último passo… ele volta a decidir. É um loop, não uma linha reta.</div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s17 Agent trabalhando */
const agentRun: { kind: 'goal' | 'dec' | 'act' | 'obs' | 'res'; text?: string; act?: string; svc?: string; out?: string }[] = [
  { kind: 'goal', text: 'Criar um vídeo completo do Vestido Aurora.' },
  { kind: 'dec', text: '“Primeiro preciso de uma imagem.”' },
  { kind: 'act', act: 'generate_image()', svc: 'Image Service', out: 'IMG-8472' },
  { kind: 'obs', text: '“Imagem pronta.”' },
  { kind: 'dec', text: '“Agora preciso transformá-la em vídeo.”' },
  { kind: 'act', act: 'generate_video(IMG-8472)', svc: 'Video Service', out: 'VID-9321' },
  { kind: 'obs', text: '“Vídeo pronto.”' },
  { kind: 'dec', text: '“Falta a legenda.”' },
  { kind: 'act', act: 'add_caption(VID-9321, “…”)', svc: 'Caption Service', out: 'VID-9321-captioned' },
  { kind: 'res', text: 'Objetivo concluído.' },
]

export function s17({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1500 }}>
        {agentRun.map((e, i) => {
          const show = step >= i + 1
          return (
            <Ent key={i} show={show} delay={show ? 60 : 0} kind="pop">
              <div
                style={{
                  border: `1px solid ${e.kind === 'act' ? rgba(palette.tool, 0.45) : e.kind === 'res' ? rgba(palette.good, 0.5) : 'var(--line-soft)'}`,
                  background: e.kind === 'act' ? rgba(palette.tool, 0.05) : 'rgba(255,255,255,0.015)',
                  borderRadius: 12, padding: '12px 18px', minWidth: 250, maxWidth: 340, minHeight: 92,
                }}
              >
                <div className="eyebrow" style={{ marginBottom: 6, color: e.kind === 'dec' ? palette.agent : e.kind === 'act' ? palette.tool : e.kind === 'res' ? palette.good : undefined }}>
                  {e.kind === 'goal' ? 'OBJETIVO' : e.kind === 'dec' ? 'DECISÃO' : e.kind === 'act' ? 'AÇÃO' : e.kind === 'obs' ? 'OBSERVAÇÃO' : 'RESULTADO'}
                </div>
                {e.kind === 'act' ? (
                  <>
                    <div className="mono" style={{ fontSize: 20, color: palette.tool }}>{e.act}</div>
                    <div className="small" style={{ color: palette.ms }}>↓ {e.svc}</div>
                    <div className="mono" style={{ fontSize: 15, color: palette.good, marginTop: 4 }}>▸ {e.out}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 20, color: e.kind === 'res' ? palette.good : 'var(--text)', fontWeight: e.kind === 'res' ? 700 : 500, fontFamily: 'var(--font-d)' }}>{e.text}</div>
                )}
              </div>
            </Ent>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- s18 experimento */
export function s18({ step }: { step: number }) {
  const [ran, setRan] = useState<string | null>(null)
  const scenario = (r: (typeof requests)[number]) => r.steps.filter((s) => s.needed).map((s) => s.tool)
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 30 }}>O experimento principal — escolha um pedido:</div>
        <div className="rowc" style={{ gap: 16, flexWrap: 'wrap', marginTop: 20 }}>
          {requests.map((r) => (
            <button key={r.id} onClick={() => setRan(r.id)} className={cx('ctrl', ran === r.id && 'on')} style={{ fontSize: 17, padding: '16px 20px', height: 'auto', borderRadius: 14 }}>
              {r.long}
            </button>
          ))}
        </div>
      </Ent>

      {ran && (
        <div className="rowc" style={{ gap: 18, flexWrap: 'wrap' }}>
          {scenario(requests.find((r) => r.id === ran)!).map((t, i) => (
            <Ent key={t} show delay={i * 320} kind="pop">
              <div className="col" style={{ alignItems: 'center', gap: 8 }}>
                <Pill accent={palette.tool}>{t}</Pill>
                {i === scenario(requests.find((r) => r.id === ran)!).length - 1 && <span className="mono" style={{ color: palette.good, fontSize: 15 }}>concluído ✓</span>}
              </div>
            </Ent>
          ))}
        </div>
      )}

      {ran && step >= 1 && (
        <Ent show kind="pop">
          <Statement size="md" style={{ fontSize: 52 }}>O objetivo mudou.<br />O caminho também.</Statement>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s19 workflow × agent */
export function s19({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18 }}>
      <div className="split" style={{ gap: 40 }}>
        <div className="universe">
          <h3 style={{ color: palette.ms }}>WORKFLOW</h3>
          <div className="col" style={{ gap: 8, alignItems: 'center' }}>
            {['Imagem', 'Vídeo', 'Legenda'].map((s, i) => (
              <div key={s} className="col" style={{ gap: 4, alignItems: 'center' }}>
                <Pill accent={palette.ms}>{s}</Pill>
                {i < 2 && <span className="mono" style={{ color: 'var(--faint)' }}>↓</span>}
              </div>
            ))}
          </div>
          <div className="note-line" style={{ fontSize: 18 }}>O caminho já foi definido pelo desenvolvedor.</div>
          {step >= 2 && (
            <div className="row-pro" style={{ gap: 8 }}>
              {['mais previsível', 'mais simples', 'mais barato', 'mais fácil de observar'].map((t, i) => (
                <Ent key={t} show={step >= 2} delay={i * 150}>
                  <div className="it"><b style={{ color: palette.ms }}>{i + 1}</b>{t}</div>
                </Ent>
              ))}
            </div>
          )}
        </div>

        <div className="universe">
          <h3 style={{ color: palette.agent }}>AGENT</h3>
          <div className="col" style={{ gap: 8, alignItems: 'center' }}>
            {['OBJETIVO', 'DECISÃO', 'TOOL', 'RESULTADO', 'NOVA DECISÃO'].map((s, i) => (
              <div key={s} className="col" style={{ gap: 4, alignItems: 'center' }}>
                <Pill accent={palette.agent}>{s}</Pill>
                {i < 4 && <span className="mono" style={{ color: 'var(--faint)' }}>↓</span>}
              </div>
            ))}
          </div>
          <div className="note-line" style={{ fontSize: 18 }}>O caminho depende do objetivo e do estado atual.</div>
          {step >= 3 && (
            <div className="row-pro" style={{ gap: 8 }}>
              {['mais flexível', 'decisões dinâmicas', 'maior complexidade', 'mais difícil de prever'].map((t, i) => (
                <Ent key={t} show={step >= 3} delay={i * 150}>
                  <div className="it"><b style={{ color: palette.agent }}>{i + 1}</b>{t}</div>
                </Ent>
              ))}
            </div>
          )}
        </div>
      </div>

      {step >= 4 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 30 }}>Se nosso sistema <strong>SEMPRE</strong> executa Imagem → Vídeo → Legenda… precisamos de Agent?</div>
        </Ent>
      )}
      {step >= 5 && (
        <Ent show kind="pop">
          <Statement size="xl" style={{ color: palette.tool, fontSize: 96 }}>PROVAVELMENTE NÃO.</Statement>
          <div className="note-line" style={{ marginTop: 12 }}>Não use Agent só porque parece mais moderno.</div>
        </Ent>
      )}
    </div>
  )
}
