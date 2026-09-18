import { Ent, NodeBox, Pill, Statement, ArrowDown } from '../components/ui'
import { palette } from '../theme'
import { services, requests } from '../data/services'

/* ================================================================
   s01 — uma pergunta simples (cada passo reframeia a "câmera")
   ================================================================ */
export function s01({ step }: { step: number }) {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {step <= 1 && (
        <Ent key="a" show kind="pop" style={{ width: '100%' }}>
          <div className="col" style={{ alignItems: 'center', gap: 40 }}>
            <Statement size="lg">Antes de falar de IA,<br />vamos construir um sistema.</Statement>
            {step >= 1 && (
              <div className="rowc" style={{ gap: 26 }}>
                {['Imagem', 'Vídeo', 'Legenda'].map((n, i) => (
                  <Ent key={n} show delay={i * 220}>
                    <NodeBox accent={palette.ms} title={n} small style={{ padding: '18px 40px' }} />
                  </Ent>
                ))}
              </div>
            )}
          </div>
        </Ent>
      )}

      {step === 2 && (
        <Ent key="b" show kind="pop">
          <div className="col" style={{ alignItems: 'center', gap: 24 }}>
            <div className="qline" style={{ fontSize: 30 }}>
              Um pedido transforma uma descrição em um vídeo com legenda:
            </div>
            <PipelineDemo />
          </div>
        </Ent>
      )}

      {step === 3 && (
        <Ent key="c" show kind="pop">
          <div className="qline" style={{ fontSize: 46 }}>“Precisamos de IA para coordenar isso?”</div>
        </Ent>
      )}

      {step >= 4 && (
        <Ent key="d" show kind="pop">
          <div className="col" style={{ alignItems: 'center', gap: 24 }}>
            <Statement size="xl" style={{ fontSize: 96 }}>Não necessariamente.</Statement>
            <div className="note-line">Não é que IA não possa ajudar — só ainda não precisamos dela aqui.</div>
          </div>
        </Ent>
      )}
    </div>
  )
}

function PipelineDemo() {
  const nodes = ['DESCRIÇÃO', 'IMAGEM', 'VÍDEO', 'VÍDEO COM LEGENDA']
  return (
    <div className="rowc" style={{ gap: 0 }}>
      {nodes.map((n, i) => (
        <div className="row" key={n} style={{ gap: 0 }}>
          {i > 0 && <div style={{ fontSize: 34, color: palette.faint, padding: '0 20px', fontFamily: 'var(--font-m)' }}>→</div>}
          <NodeBox accent={i === 3 ? palette.tool : palette.rag} title={n} titleMono={false} small style={{ padding: '16px 28px' }} />
        </div>
      ))}
    </div>
  )
}

/* ================================================================
   s02 — os três microsserviços
   ================================================================ */
export function s02({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 26 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 36 }}>Por trás disso, existem três serviços especializados.</div>
      </Ent>

      <div className="rowc" style={{ gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {services.map((svc, i) => (
          <Ent show={step >= i + 1} key={svc.id} delay={i * 300}>
            <ServiceCard service={svc} expand={step >= 4} />
          </Ent>
        ))}
      </div>

      {step >= 5 && (
        <Ent show kind="pop" delay={150}>
          <div className="note-line" style={{ maxWidth: 1100 }}>
            Microsserviço é <strong>software especializado</strong>.<br />Isso ainda <strong>não é um agente</strong>.
          </div>
        </Ent>
      )}
    </div>
  )
}

function ServiceCard({ service, expand }: { service: (typeof services)[number]; expand: boolean }) {
  return (
    <NodeBox accent={service.color} title={service.name} sub={service.responsibility} glow style={{ minWidth: 250, padding: '22px 26px' }}>
      <div className="mono" style={{ marginTop: 10, fontSize: 14, color: palette.rag }}>
        {service.endpoint}
      </div>
      {expand && (
        <div style={{ opacity: 0.55, fontSize: 13, fontFamily: 'var(--font-m)', marginTop: 14 }}>
          <div style={{ color: 'var(--faint)' }}>entrada</div>
          <div style={{ color: palette.rag }}>{service.exampleInput}</div>
          <div style={{ color: 'var(--faint)', marginTop: 8 }}>saída</div>
          <div style={{ color: palette.good }}>{service.exampleOutput}</div>
        </div>
      )}
    </NodeBox>
  )
}

/* ================================================================
   s03 — um workflow tradicional
   ================================================================ */
const wfSeq = [
  { name: 'generateImage()', out: 'IMG-8472', svc: 'Image Service' },
  { name: 'generateVideo()', out: 'VID-9321', svc: 'Video Service' },
  { name: 'addCaption()', out: 'VID-9321-captioned', svc: 'Caption Service' },
]

export function s03({ step }: { step: number }) {
  const upTo = Math.max(0, Math.min(step, 3))
  if (step <= 3) {
    return (
      <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10 }}>
        {step >= 0 && (
          <Ent show>
            <div className="qline" style={{ fontSize: 34 }}>Usuário pede: “Crie um vídeo legendado de um vestido verde militar curto.”</div>
          </Ent>
        )}
        {upTo >= 1 && (
          <div style={{ marginTop: 8 }}>
            <WorkflowStack seq={wfSeq} upTo={upTo} />
          </div>
        )}
        {upTo === 0 && <div className="note-line" style={{ fontSize: 20 }}>… e o fluxo começa a executar.</div>}
      </div>
    )
  }
  if (step === 4) {
    return (
      <Ent key="q" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="qline" style={{ fontSize: 44 }}>“Quem decidiu essa ordem?”</div>
      </Ent>
    )
  }
  if (step === 5) {
    return (
      <Ent key="dev" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="col" style={{ alignItems: 'center', gap: 16 }}>
          <Statement size="md" style={{ fontSize: 64, color: palette.ms }}>O DESENVOLVEDOR.</Statement>
          <div className="note-line" style={{ maxWidth: 900 }}>
            Programamos previamente que o fluxo seria sempre Imagem → Vídeo → Legenda.
          </div>
        </div>
      </Ent>
    )
  }
  return (
    <Ent key="con" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Statement size="lg" style={{ fontSize: 84 }}>AUTOMAÇÃO NÃO É<br />A MESMA COISA QUE AGENTE.</Statement>
    </Ent>
  )
}

function WorkflowStack({ seq, upTo }: { seq: typeof wfSeq; upTo: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {seq.slice(0, upTo).map((s, i) => (
        <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="rowc" style={{ gap: 22 }}>
            <span className="mono" style={{ fontSize: 23, color: palette.tool }}>{s.name}</span>
            <ArrowDown color={palette.faint} />
            <NodeBox accent={palette.ms} title={s.svc} small titleMono={false} style={{ padding: '10px 22px' }} />
          </div>
          <span className="mono" style={{ fontSize: 16, color: palette.good, margin: '8px 0', letterSpacing: '0.08em' }}>▸ {s.out}</span>
          {i < upTo - 1 && <ArrowDown color={palette.faint} />}
        </div>
      ))}
    </div>
  )
}

/* ================================================================
   s04 — agora os pedidos variam
   ================================================================ */
export function s04({ step }: { step: number }) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 34 }}>Agora os pedidos dos usuários começam a variar.</div>
      </Ent>

      <div className="rowc" style={{ gap: 22, flexWrap: 'wrap' }}>
        {requests.map((r, i) => (
          <Ent key={r.id} show={step >= 1} delay={i * 220} kind="pop">
            <Pill accent={palette.rag} big>{r.long}</Pill>
          </Ent>
        ))}
      </div>

      {step >= 2 && (
        <Ent show delay={300}>
          <div className="note-line" style={{ maxWidth: 1000 }}>
            O workflow fixo continua tentando executar sempre o mesmo caminho:
          </div>
          <div className="rowc" style={{ gap: 10, marginTop: 14 }}>
            <Pill accent={palette.tool}>generate_image()</Pill>
            <span style={{ color: 'var(--faint)' }}>→</span>
            <Pill accent={palette.tool}>generate_video()</Pill>
            <span style={{ color: 'var(--faint)' }}>→</span>
            <Pill accent={palette.tool}>add_caption()</Pill>
          </div>
        </Ent>
      )}

      {step >= 3 && (
        <Ent show delay={200}>
          <div className="rowc" style={{ gap: 22, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
            {requests.map((r, i) => (
              <Ent key={r.id} show delay={i * 180}>
                <div style={{ border: '1px solid var(--line-soft)', borderRadius: 14, padding: '14px 18px', background: 'rgba(255,255,255,0.012)', width: 300 }}>
                  <div style={{ fontSize: 16, color: 'var(--text)', marginBottom: 10, fontFamily: 'var(--font-d)' }}>{r.long}</div>
                  {r.steps.map((s) => (
                    <div key={s.tool} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0', opacity: s.needed ? 1 : 0.28, fontFamily: 'var(--font-m)', fontSize: 14 }}>
                      <span style={{ color: s.needed ? palette.good : palette.bad }}>{s.needed ? '✓' : '✕'}</span>
                      <span>{s.tool}</span>
                    </div>
                  ))}
                </div>
              </Ent>
            ))}
          </div>
        </Ent>
      )}

      {step >= 4 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 38 }}>“Será que precisamos executar sempre as mesmas etapas?”</div>
        </Ent>
      )}
      {step >= 5 && (
        <Ent show kind="pop">
          <Statement size="lg" style={{ fontSize: 72, color: palette.tool }}>Agora surgiu uma decisão.</Statement>
          <div className="note-line" style={{ marginTop: 8 }}>Dependendo do pedido, o caminho deveria ser diferente.</div>
        </Ent>
      )}
    </div>
  )
}
