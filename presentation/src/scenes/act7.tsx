import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Ent, Statement, Pill } from '../components/ui'
import { palette, rgba } from '../theme'
import { kafkaEvents } from '../data/scenarios'
import { useDeck } from '../presentation/context'
import type { SceneProps } from '../presentation/types'

/* ---------------------------------------------------------------- s31 kafka */
export function s31({ step }: SceneProps) {
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 18 }}>
      <Ent show={step >= 0}>
        <div className="qline" style={{ fontSize: 32 }}>Os serviços precisam conversar apenas por chamadas HTTP?</div>
      </Ent>
      {step >= 1 && (
        <Ent show kind="pop">
          <Statement size="lg" style={{ fontSize: 64 }}>Não.</Statement>
          <div className="note-line" style={{ marginTop: 8 }}>Eles também podem trocar <strong style={{ color: palette.kafka }}>eventos</strong>.</div>
        </Ent>
      )}

      {step >= 2 && (
        <div className="rowc" style={{ gap: 22 }}>
          <Pill accent={palette.ms}>Image Service</Pill>
          <span className="mono" style={{ color: palette.kafka, fontSize: 18 }}>produz →</span>
          <Pill accent={palette.kafka}>image.generated</Pill>
        </div>
      )}

      {step >= 3 && (
        <Ent show delay={200}>
          <div className="col" style={{ gap: 12, alignItems: 'center' }}>
            <KafkaBus />
            <div className="rowc" style={{ gap: 10, flexWrap: 'wrap' }}>
              <span className="node-tag" style={{ color: palette.kafka }}>produtor publica o evento</span>
              <span className="mono" style={{ color: 'var(--faint)' }}>→</span>
              <span className="node-tag" style={{ color: palette.kafka }}>Kafka guarda na fila (tópico)</span>
              <span className="mono" style={{ color: 'var(--faint)' }}>→</span>
              <span className="node-tag" style={{ color: palette.kafka }}>consumidor lê quando quiser</span>
            </div>
            <div className="note-line" style={{ fontSize: 18, maxWidth: 1100 }}>
              Os serviços não precisam se conhecer: quem publica não chama ninguém. O evento fica registrado no log — dá para reprocessar e auditar depois.
            </div>
          </div>
        </Ent>
      )}

      {step >= 4 && (
        <div className="rowc" style={{ gap: 20, flexWrap: 'wrap' }}>
          {kafkaEvents.map((e, i) => (
            <Ent key={e.name} show delay={i * 200} kind="pop">
              <div style={{ border: `1px solid ${rgba(palette.kafka, 0.4)}`, background: rgba(palette.kafka, 0.05), borderRadius: 12, padding: '12px 20px' }}>
                <div className="mono" style={{ color: palette.kafka, fontSize: 20 }}>{e.name}</div>
                <div className="mono" style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>{e.payload}</div>
              </div>
            </Ent>
          ))}
        </div>
      )}

      {step >= 5 && (
        <Ent show>
          <div className="qline" style={{ fontSize: 36 }}>“Kafka virou um Agent?”</div>
        </Ent>
      )}
      {step >= 6 && (
        <Ent show kind="pop">
          <Statement size="xl" style={{ color: palette.kafka, fontSize: 110 }}>NÃO.</Statement>
          <div className="note-line" style={{ marginTop: 6 }}>Kafka é infraestrutura de mensageria e event streaming.</div>
          <div className="rowc" style={{ gap: 20, marginTop: 24 }}>
            <div className="col" style={{ gap: 4, alignItems: 'center' }}>
              <Pill accent={palette.agent}>AGENT</Pill>
              <span className="small">decide</span>
            </div>
            <span className="mono" style={{ color: 'var(--faint)', fontSize: 24 }}>·</span>
            <div className="col" style={{ gap: 4, alignItems: 'center' }}>
              <Pill accent={palette.kafka}>KAFKA</Pill>
              <span className="small">transporta eventos</span>
            </div>
            <span className="mono" style={{ color: 'var(--faint)', fontSize: 24 }}>·</span>
            <div className="col" style={{ gap: 4, alignItems: 'center' }}>
              <Pill accent={palette.ms}>MICROSSERVIÇO</Pill>
              <span className="small">executa</span>
            </div>
          </div>
        </Ent>
      )}
    </div>
  )
}

function KafkaBus() {
  const ref = useRef<HTMLDivElement>(null)
  const packet = useRef<HTMLDivElement>(null)
  const [moving, setMoving] = useState(false)
  useEffect(() => {
    if (!packet.current || !ref.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set(packet.current, { x: ref.current.clientWidth - 200 })
      return
    }
    const ctx = gsap.context(() => {
      const w = ref.current!.clientWidth
      gsap.to(packet.current, { x: w - 220, duration: 2.4, ease: 'power1.inOut', onComplete: () => setMoving(true) })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <div style={{ width: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <Pill accent={palette.kafka}>KAFKA · fila de eventos</Pill>
      </div>
      <div ref={ref} style={{ position: 'relative', height: 52 }}>
        <div className="lane" style={{ position: 'absolute', top: 20, left: 20, right: 20 }} />
        <div
          ref={packet}
          style={{
            position: 'absolute', top: 4, left: 20,
            fontFamily: 'var(--font-m)', fontSize: 15, color: palette.kafka,
            background: 'var(--panel2)', border: `1px solid ${rgba(palette.kafka, 0.6)}`,
            padding: '6px 14px', borderRadius: 9, whiteSpace: 'nowrap',
          }}
        >
          image.generated
        </div>
      </div>
      <div className="rowc" style={{ justifyContent: 'space-between', marginTop: 4, fontFamily: 'var(--font-m)', fontSize: 13, color: 'var(--faint)' }}>
        <span>producer · Image Service</span>
        <span>consumers · Video / Caption</span>
      </div>
      {moving && <div className="note-line" style={{ fontSize: 16, marginTop: 10 }}>Qualquer serviço pode consumir esse evento.</div>}
    </div>
  )
}

/* ---------------------------------------------------------------- s32 arquitetura em camadas */
const layerData = [
  { name: 'EXPERIÊNCIA', color: palette.text, items: [{ t: 'Usuário', c: palette.text }] },
  { name: 'DECISÃO', color: palette.agent, items: [{ t: 'Orchestrator Agent', c: palette.agent }, { t: 'Knowledge Agent', c: palette.rag }, { t: 'Image Agent', c: palette.agent }, { t: 'Video Agent', c: palette.agent }, { t: 'Caption Agent', c: palette.agent }] },
  { name: 'CONHECIMENTO', color: palette.rag, items: [{ t: 'RAG', c: palette.rag }, { t: 'Embeddings', c: palette.rag }, { t: 'Vector Database', c: palette.rag }] },
  { name: 'CAPACIDADES', color: palette.tool, items: [{ t: 'search_knowledge()', c: palette.tool }, { t: 'generate_image()', c: palette.tool }, { t: 'generate_video()', c: palette.tool }, { t: 'add_caption()', c: palette.tool }] },
  { name: 'APLICAÇÃO', color: palette.ms, items: [{ t: 'Image Service', c: palette.ms }, { t: 'Video Service', c: palette.ms }, { t: 'Caption Service', c: palette.ms }] },
  { name: 'INFRAESTRUTURA', color: palette.kafka, items: [{ t: 'Kafka', c: palette.kafka }] },
]

export function s32({ step }: SceneProps) {
  const deck = useDeck()
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, maxWidth: 1520, margin: '0 auto', width: '100%' }}>
      <div className="rowc" style={{ gap: 18 }}>
        <Ent show={step >= 0}>
          <div className="qline" style={{ fontSize: 28 }}>Agora sim — o sistema completo, em camadas.</div>
        </Ent>
        <Ent show={step >= 1}>
          <button className="ctrl on" style={{ fontSize: 15 }} onClick={deck.toggleInfra}>
            {deck.infra ? 'Infraestrutura: visível' : 'MOSTRAR INFRAESTRUTURA'}
          </button>
        </Ent>
      </div>

      <div className="layers">
        {layerData.map((l, i) => {
          const show = step >= i + 1
          if (!show) return null
          const infraDetail = deck.infra && (l.name === 'CAPACIDADES' || l.name === 'APLICAÇÃO')
          return (
            <div className="layer" key={l.name} style={{ minHeight: infraDetail ? 108 : 82 }}>
              <span className="lab" style={{ color: l.color }}>{l.name}</span>
              <div className="items">
                {l.items.map((it) => (
                  <span key={it.t} className="pill" style={{ color: it.c, borderColor: rgba(it.c, 0.4), background: rgba(it.c, 0.06), fontSize: 16, padding: '8px 16px' }}>
                    {it.t}
                  </span>
                ))}
                {infraDetail && l.name === 'CAPACIDADES' && <span className="small" style={{ color: 'var(--faint)', width: '100%' }}>… cada capacidade chama uma API por baixo (HTTP).</span>}
                {infraDetail && l.name === 'APLICAÇÃO' && <span className="small" style={{ color: 'var(--faint)', width: '100%' }}>… os serviços trocam eventos e são independentes.</span>}
              </div>
            </div>
          )
        })}
      </div>

      {step >= 7 && (
        <Ent show kind="pop">
          <div className="note-line" style={{ fontSize: 18 }}>Cada camada tem um papel. Nenhuma vira a outra.</div>
        </Ent>
      )}
    </div>
  )
}
