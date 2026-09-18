import { useState } from 'react'
import { Ent, NodeBox, Statement, Pill, ArrowDown, cx } from '../components/ui'
import { palette, rgba } from '../theme'
import { agentRoles, multiAgentRun } from '../data/agents'
import { trace, dataFlow, xrayRows } from '../data/scenarios'
import type { SceneProps } from '../presentation/types'

/* ---------------------------------------------------------------- s21 agent que cresce */
export function s21({ step }: SceneProps) {
  const groups: { label: string; items: string[] }[] = [
    { label: 'capacidades', items: ['RAG', 'generate_image', 'generate_video', 'add_caption'] },
    { label: 'regras', items: ['instruções de imagem', 'instruções de vídeo', 'instruções de legenda', 'regras da marca'] },
    { label: 'memória', items: ['estado', 'contexto', 'memória'] },
  ]
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 34 }}>O que acontece quando colocamos tudo dentro de um único Agent?</div>
      </Ent>

      <NodeBox accent={palette.agent} title="AGENT" glow titleMono={false} style={{ minWidth: 700, padding: '26px 40px', textAlign: 'center', transition: 'min-width .6s var(--de)' }}>
        <div className="rowc" style={{ gap: 12, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {groups.map((g, gi) => (
            <span key={g.label} className="node-tag" style={{ display: 'flex', gap: 8, padding: 0, background: 'transparent', border: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
              {g.items.map((it, ii) => (
                <span key={it} className="node-tag" style={{ color: gi === 0 ? palette.tool : gi === 1 ? palette.rag : palette.llm }}>
                  <Ent show={step >= gi + 1} delay={ii * 120} kind="pop" style={{ display: 'inline' }}>
                    {it}
                  </Ent>
                </span>
              ))}
            </span>
          ))}
        </div>
      </NodeBox>

      {step >= 4 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 34 }}>"Isso é necessariamente ruim?"</div>
        </Ent>
      )}
      {step >= 5 && (
        <Ent show kind="pop">
          <Statement size="md" style={{ fontSize: 52 }}>Não.</Statement>
          <div className="note-line" style={{ marginTop: 14 }}>
            Mas, dependendo do tamanho do problema, pode ficar difícil separar responsabilidades.
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s22 especialistas */
export function s22({ step }: SceneProps) {
  const role = (id: string) => agentRoles.find((a) => a.id === id)!
  const order = ['orchestrator', 'knowledge', 'image', 'video', 'caption']
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 34 }}>Em vez de um agente fazer tudo… criamos especialistas.</div>
      </Ent>

      <div className="col" style={{ gap: 14, alignItems: 'center' }}>
        {order.map((id, i) => {
          const a = role(id)
          const show = step >= i + 1
          return (
            <Ent key={id} show={show} delay={show ? 0 : 0} kind="pop">
              <div className="rowc" style={{ gap: 14 }}>
                {i > 0 && <span className="mono" style={{ color: 'var(--faint)', fontSize: 22 }}>↑ delega</span>}
                <NodeBox accent={id === 'knowledge' ? palette.rag : a.color} title={a.name} titleMono={false} small style={{ padding: '12px 30px' }}>
                  <span className="small" style={{ color: 'var(--muted)' }}>{a.role}</span>
                </NodeBox>
              </div>
            </Ent>
          )
        })}
      </div>

      {step >= 6 && (
        <Ent show kind="pop">
          <div className="note-line" style={{ maxWidth: 1000 }}>
            Em vez de um agente conhecer todas as regras e ferramentas, <strong>especializamos responsabilidades</strong>.
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s23 cuidado */
export function s23({ step }: SceneProps) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 36 }}>“Então cada microsserviço precisa virar um Agent?”</div>
      </Ent>
      {step >= 1 && (
        <Ent show kind="pop">
          <Statement size="xl" style={{ color: palette.good, fontSize: 120 }}>NÃO.</Statement>
        </Ent>
      )}
      {step >= 2 && (
        <div className="rowc" style={{ gap: 24 }}>
          <Pill accent={palette.agent}>IMAGE AGENT</Pill>
          <span className="mono" style={{ color: 'var(--faint)' }}>↓</span>
          <Pill accent={palette.tool}>generate_image()</Pill>
          <span className="mono" style={{ color: 'var(--faint)' }}>↓</span>
          <Pill accent={palette.ms}>IMAGE SERVICE</Pill>
        </div>
      )}
      {step >= 3 && (
        <div className="split" style={{ maxWidth: 1300 }}>
          <div className="universe" style={{ padding: '26px 30px' }}>
            <h3 style={{ color: palette.agent }}>AGENT</h3>
            <div className="row-pro" style={{ gap: 8 }}>
              {['interpreta contexto', 'decide', 'seleciona ações'].map((t, i) => (
                <div key={t} className="it" style={{ fontSize: 22 }}><b>{i + 1}</b>{t}</div>
              ))}
            </div>
          </div>
          <div className="universe" style={{ padding: '26px 30px' }}>
            <h3 style={{ color: palette.ms }}>MICROSSERVIÇO</h3>
            <div className="row-pro" style={{ gap: 8 }}>
              <div className="it" style={{ fontSize: 22 }}><b style={{ color: palette.ms }}>1</b>executa uma capacidade bem definida</div>
            </div>
          </div>
        </div>
      )}
      {step >= 4 && (
        <Ent show>
          <div className="note-line">O Image Agent decide como utilizar a capacidade.<br />O Image Service continua sendo quem <strong>realmente gera a imagem</strong>.</div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s24 orchestrator */
export function s24({ step }: SceneProps) {
  const specials = ['Knowledge Agent', 'Image Agent', 'Video Agent', 'Caption Agent']
  const no = ['gerar imagem', 'gerar vídeo', 'adicionar legenda']
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20 }}>
      <div className="rowc" style={{ gap: 22 }}>
        <Pill accent={palette.text}>USER</Pill>
        <span className="mono" style={{ color: 'var(--faint)' }}>↓</span>
        <Pill accent={palette.agent}>ORCHESTRATOR</Pill>
      </div>
      {step >= 1 && (
        <Ent show>
          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 6 }}>especialistas disponíveis</div>
          <div className="rowc" style={{ gap: 14, flexWrap: 'wrap' }}>
            {specials.map((s) => (
              <Pill key={s} accent={palette.agent}>{s}</Pill>
            ))}
          </div>
        </Ent>
      )}
      {step >= 2 && (
        <Ent show>
          <div className="rowc" style={{ gap: 26, flexWrap: 'wrap', justifyContent: 'center' }}>
            {no.map((n) => (
              <div key={n} className="col" style={{ gap: 6, alignItems: 'center' }}>
                <Pill accent={palette.rag}>Orchestrator</Pill>
                <span className="mono" style={{ color: palette.bad }}>✕ {n}</span>
              </div>
            ))}
          </div>
        </Ent>
      )}
      {step >= 3 && (
        <Ent show kind="pop">
          <Statement size="lg" style={{ color: palette.agent, fontSize: 78 }}>Ele coordena.</Statement>
        </Ent>
      )}
      {step >= 4 && (
        <Ent show>
          <div className="row-pro" style={{ maxWidth: 760 }}>
            {['interpretar o objetivo', 'descobrir quais especialistas são necessários', 'delegar', 'receber resultados', 'decidir o próximo passo', 'manter o contexto da execução'].map((t, i) => (
              <Ent key={t} show={step >= 4} delay={i * 130}>
                <div className="it" style={{ fontSize: 22 }}><b style={{ color: palette.agent }}>{i + 1}</b>{t}</div>
              </Ent>
            ))}
          </div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s25/s26/s27/s28 chains */
export function s25({ step }: SceneProps) {
  if (step <= 4) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18 }}>
        <div className="col" style={{ gap: 0, alignItems: 'center' }}>
          <Pill accent={palette.agent}>ORCHESTRATOR</Pill>
          {step >= 1 && (
            <Ent show delay={120}>
              <div className="col" style={{ gap: 0, alignItems: 'center' }}>
                <ArrowDown label="delega" color={palette.agent} />
                <Pill accent={palette.rag}>KNOWLEDGE AGENT</Pill>
              </div>
            </Ent>
          )}
          {step >= 2 && (
            <Ent show delay={120}>
              <div className="col" style={{ gap: 0, alignItems: 'center' }}>
                <ArrowDown label="executa" color={palette.tool} />
                <Pill accent={palette.tool}>search_knowledge()</Pill>
              </div>
            </Ent>
          )}
          {step >= 3 && (
            <Ent show delay={120}>
              <div className="col" style={{ gap: 0, alignItems: 'center' }}>
                <ArrowDown label="mecanismo" color={palette.rag} />
                <Pill accent={palette.rag}>RAG</Pill>
              </div>
            </Ent>
          )}
          {step >= 4 && (
            <Ent show delay={120}>
              <div className="rowc" style={{ gap: 18, marginTop: 14 }}>
                <Pill accent={palette.rag}>VECTOR DB</Pill>
                <span className="mono" style={{ color: 'var(--faint)' }}>→</span>
                <Pill accent={palette.ms}>DOCUMENTOS</Pill>
              </div>
            </Ent>
          )}
        </div>
      </div>
    )
  }
  if (step === 5) {
    return (
      <Ent key="q" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="qline" style={{ fontSize: 40 }}>“Knowledge Agent é o próprio RAG?”</div>
      </Ent>
    )
  }
  return (
    <Ent key="ans" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="rowc" style={{ gap: 40 }}>
        <Statement size="md" style={{ fontSize: 72, color: palette.bad }}>Não.</Statement>
        <div className="note-line" style={{ maxWidth: 680, textAlign: 'left', fontSize: 26 }}>
          RAG é o mecanismo usado por esse agente para encontrar conhecimento.
        </div>
      </div>
    </Ent>
  )
}

function SpecializedChain({ step, agent, color, tool, service, out }: SceneProps & { agent: string; color: string; tool: string; service: string; out: string }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
      <div className="col" style={{ gap: 0, alignItems: 'center' }}>
        <Pill accent={palette.agent}>ORCHESTRATOR</Pill>
        {step >= 1 && (
          <Ent show>
            <div className="col" style={{ gap: 0, alignItems: 'center' }}>
              <ArrowDown label="delega" color={palette.agent} />
              <Pill accent={color}>{agent}</Pill>
            </div>
          </Ent>
        )}
        {step >= 2 && (
          <Ent show>
            <div className="col" style={{ gap: 0, alignItems: 'center' }}>
              <ArrowDown label="decide + tool" color={palette.tool} />
              <Pill accent={palette.tool}>{tool}</Pill>
            </div>
          </Ent>
        )}
        {step >= 3 && (
          <Ent show>
            <div className="col" style={{ gap: 0, alignItems: 'center' }}>
              <ArrowDown label="chamada real" color={palette.ms} />
              <Pill accent={palette.ms}>{service}</Pill>
            </div>
          </Ent>
        )}
      </div>
      {step >= 4 && (
        <Ent show delay={150} kind="pop">
          <div className="mono" style={{ fontSize: 26, color: palette.good }}>▸ {out}</div>
        </Ent>
      )}
      {step >= 5 && (
        <Ent show>
          <div className="mono" style={{ fontSize: 19, color: palette.agent }}>↑ resultado volta para o ORCHESTRATOR</div>
        </Ent>
      )}
    </div>
  )
}

export const s26 = ({ step }: SceneProps) => (
  <SpecializedChain step={step} agent="IMAGE AGENT" color={palette.agent} tool="generate_image()" service="Image Service" out="IMG-8472" total={0} />
)
export const s27 = ({ step }: SceneProps) => (
  <SpecializedChain step={step} agent="VIDEO AGENT" color={palette.agent} tool="generate_video(IMG-8472)" service="Video Service" out="VID-9321" total={0} />
)
export const s28 = ({ step }: SceneProps) => (
  <SpecializedChain step={step} agent="CAPTION AGENT" color={palette.agent} tool="add_caption(VID-9321, texto)" service="Caption Service" out="VID-9321-captioned" total={0} />
)

/* ---------------------------------------------------------------- s29 execução multi-agent */
export function s29({ step }: SceneProps) {
  const at = step - 1
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'flex-start', gap: 8, maxWidth: 1560, margin: '0 auto', width: '100%', height: '100%', paddingTop: 6 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 26 }}>Usuário: “Crie um vídeo de 15 segundos para divulgar o Vestido Aurora.”</div>
      </Ent>

      <div className="rowc" style={{ gap: 14 }}>
        <Pill accent={palette.text}>USER</Pill>
        <span className="mono" style={{ color: 'var(--faint)', fontSize: 20 }}>→</span>
        <Pill accent={palette.agent}>ORCHESTRATOR</Pill>
      </div>

      <div style={{ width: '100%', overflow: 'hidden' }}>
        {multiAgentRun.map((m, i) => {
          const show = step >= i + 1
          if (!show) return null
          return (
            <Ent key={i} show kind="pop" style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap',
                  padding: i === at && step < multiAgentRun.length + 1 && i === multiAgentRun.length - 1 ? '12px 18px' : '7px 16px',
                  borderRadius: 10, marginTop: 5,
                  border: '1px solid var(--line-soft)',
                  background: step - 1 === i ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                }}
              >
                <span className="eyebrow" style={{ minWidth: 150, fontSize: 11 }}>{m.label}</span>
                {m.orchestratorSay && <span className="mono" style={{ color: palette.agent, fontSize: 14.5 }}>Orchestrator: {m.orchestratorSay}</span>}
                {m.agent && <Pill accent={m.agentColor ?? palette.agent}>{m.agent}</Pill>}
                {m.tool && <Pill accent={palette.tool}>{m.tool}</Pill>}
                {m.resultLabel && m.resultLabel === 'RAG' && <Pill accent={palette.rag}>{m.resultLabel}</Pill>}
                {m.service && <Pill accent={m.serviceColor ?? palette.ms}>{m.service}</Pill>}
                {m.result && <span className="mono" style={{ color: palette.good, fontSize: 16 }}>▸ {m.result}</span>}
                {m.docs && (
                  <span className="small" style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {m.docs.map((d) => `${d.file} · ${d.note}`).join('  ·  ')}
                  </span>
                )}
              </div>
            </Ent>
          )
        })}
      </div>

      {step >= multiAgentRun.length + 1 && (
        <Ent show kind="pop" style={{ marginTop: 6 }}>
          <Statement size="md" style={{ color: palette.good, fontSize: 50 }}>OBJETIVO CONCLUÍDO</Statement>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s30 trace */
export function s30({ step }: SceneProps) {
  const [n, setN] = useState(1)
  const shown = step >= 1 ? trace.slice(0, n) : []
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
      <Ent show={step >= 0}>
          <div className="qline" style={{ fontSize: 30 }}>Como vemos essa execução? Um <strong style={{ color: palette.agent }}>distributed trace</strong>.</div>
      </Ent>
      {step >= 1 && (
        <Ent show>
          <div className="trace" style={{ maxWidth: 1240, maxHeight: 560, overflowY: 'auto' }}>
            {shown.map((e, i) => (
              <div key={i} className="trace-row" style={{ borderTop: 'none', padding: '10px 0' }}>
                <span className="t">{e.t}</span>
                <span className="a" style={{ color: e.actorColor }}>{e.actor}</span>
                <span className="e">{e.action}{e.detail ? ` · ${e.detail}` : ''}</span>
              </div>
            ))}
          </div>
          <div className="rowc" style={{ marginTop: 10, gap: 16 }}>
            <button className="ctrl" style={{ fontSize: 16, padding: '10px 20px' }} onClick={() => setN((x) => Math.min(trace.length, x + 1))}>
              {n >= trace.length ? 'fim do trace' : '▸ próximo evento'}
            </button>
            {n < trace.length && <span className="small" style={{ color: 'var(--faint)' }}>{trace.length - n} eventos restantes</span>}
          </div>
        </Ent>
      )}
      {step >= 2 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 28 }}>Em cada linha: quem decidiu e quem executou?</div>
        </Ent>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- s30b follow data / decisions / x-ray */
export function s30b({ step }: SceneProps) {
  const [mode, setMode] = useState<'dados' | 'decisoes' | 'xray'>('dados')
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 28 }}>Escolha uma lente para reler a mesma execução:</div>
        <div className="rowc" style={{ gap: 14, marginTop: 16 }}>
          {([
            ['dados', 'SEGUIR OS DADOS', palette.rag],
            ['decisoes', 'SEGUIR AS DECISÕES', palette.agent],
            ['xray', 'RAIO-X DO SISTEMA', palette.tool],
          ] as const).map(([m, l, c]) => (
            <button key={m} className={cx('ctrl', mode === m && 'on')} style={{ fontSize: 16, padding: '12px 20px', height: 'auto', color: mode === m ? c : undefined, borderColor: mode === m ? c : undefined }} onClick={() => setMode(m)}>
              {l}
            </button>
          ))}
        </div>
      </Ent>

      {step >= 1 && (
        <Ent show>
          <div style={{ display: 'flex', gap: 44, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {mode === 'dados' && (
              <div className="col" style={{ gap: 0, alignItems: 'center' }}>
                {dataFlow.map((d, i) => {
                  const tipo = { contexto: 'contexto', prompt: 'prompt', asset: 'imagem', asset2: 'vídeo', final: 'vídeo final' }[d.kind]
                  return (
                    <div key={i} className="col" style={{ gap: 6, alignItems: 'center' }}>
                      <div className="doc-card" style={{ padding: '12px 26px', fontSize: 22, background: rgba(d.kind.includes('final') ? palette.good : palette.rag, 0.05) }}>
                        <span className="mono" style={{ color: d.kind.includes('final') ? palette.good : palette.rag }}>{d.label}</span>
                        <span className="small" style={{ display: 'block', color: 'var(--faint)' }}>{d.sub} · tipo: {tipo}</span>
                      </div>
                      {i < dataFlow.length - 1 && <span className="mono" style={{ color: palette.rag }}>↓</span>}
                    </div>
                  )
                })}
              </div>
            )}

            {mode === 'decisoes' && (
              <div className="col" style={{ gap: 10 }}>
                {['Objetivo do usuário', 'decisão do Orchestrator', 'delegação', 'Agent', 'seleção da Tool', 'observação', 'próxima decisão'].map((s, i) => (
                  <Ent key={s} show delay={i * 160}>
                    <div className="rowc" style={{ gap: 14 }}>
                      <Pill accent={palette.agent}>{s}</Pill>
                      {i < 6 && <span className="mono" style={{ color: 'var(--faint)' }}>↓</span>}
                    </div>
                  </Ent>
                ))}
              </div>
            )}

            {mode === 'xray' && (
              <div className="trace" style={{ maxWidth: 1000 }}>
                {xrayRows.map((r, i) => (
                  <Ent key={r.label} show delay={i * 160}>
                    <div className="trace-row" style={{ gridTemplateColumns: '340px 1fr', borderTop: 'none' }}>
                      <span className="eyebrow">{r.label}</span>
                      <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: r.color }}>{r.value}</span>
                    </div>
                  </Ent>
                ))}
              </div>
            )}
          </div>
        </Ent>
      )}

      {step >= 2 && mode !== 'xray' && (
        <Ent show>
          <div className="qline" style={{ fontSize: 28 }}>Percebem que decisão e dado não são a mesma coisa?</div>
        </Ent>
      )}
      {step >= 2 && mode === 'xray' && (
        <Ent show>
          <div className="qline" style={{ fontSize: 28 }}>O Agent decide. O serviço executa. Impossível confundir agora.</div>
        </Ent>
      )}
    </div>
  )
}
