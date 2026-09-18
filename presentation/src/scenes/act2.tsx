import { Ent, NodeBox, Statement, Pill, Bubble } from '../components/ui'
import { palette } from '../theme'
import { services } from '../data/services'

/* ================================================================
   s05 — a LLM entende linguagem (reframes por passo)
   ================================================================ */
export function s05({ step }: { step: number }) {
  if (step <= 2) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Ent key={step} show kind="pop" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="col" style={{ alignItems: 'center', gap: 18, width: '100%' }}>
            {step <= 2 && <div className="qline" style={{ fontSize: 30 }}>Deixa a LLM conversar com o usuário:</div>}
            <div className="chat" style={{ gap: 18, maxWidth: 960 }}>
              <Bubble who="USUÁRIO" kind="user">Crie apenas uma imagem do Vestido Aurora.</Bubble>
              {step >= 1 && <Bubble who="LLM" kind="llm">Entendi. Você quer gerar uma imagem.</Bubble>}
              {step >= 2 && (
                <>
                  <Bubble who="USUÁRIO" kind="user">Transforme esta imagem em vídeo.</Bubble>
                  <Bubble who="LLM" kind="llm">Entendi. Você quer gerar um vídeo.</Bubble>
                </>
              )}
            </div>
          </div>
        </Ent>
      </div>
    )
  }
  if (step === 3) {
    return (
      <Ent key="map" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="col" style={{ alignItems: 'center', gap: 26 }}>
          <div className="qline" style={{ fontSize: 32 }}>Uma LLM é muito boa em interpretar linguagem e gerar conteúdo.</div>
          <div className="col" style={{ gap: 14 }}>
            {services.map((s) => (
              <div key={s.id} className="rowc" style={{ gap: 24 }}>
                <Pill accent={palette.llm}>LLM</Pill>
                <span className="mono" style={{ fontSize: 22, color: palette.bad }}>✕ chamada direta</span>
                <Pill accent={palette.ms}>{s.name}</Pill>
              </div>
            ))}
          </div>
        </div>
      </Ent>
    )
  }
  if (step === 4) {
    return (
      <Ent key="q" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="qline" style={{ fontSize: 44 }}>“Mas entender o pedido significa conseguir executá-lo?”</div>
      </Ent>
    )
  }
  return (
    <Ent key="no" show kind="pop" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="col" style={{ alignItems: 'center', gap: 22 }}>
        <Statement size="xl" style={{ fontSize: 180 }}>NÃO.</Statement>
        <div className="note-line" style={{ maxWidth: 900 }}>A LLM não ganha acesso aos nossos sistemas magicamente.</div>
      </div>
    </Ent>
  )
}

/* ================================================================
   s05b — pausa conceitual: até aqui
   ================================================================ */
export function s05b({ step }: { step: number }) {
  const rows: { kind: 'ok' | 'no'; text: string }[] = [
    { kind: 'ok', text: 'entende linguagem' },
    { kind: 'ok', text: 'gera texto' },
    { kind: 'no', text: 'não conhece automaticamente nossos dados internos' },
    { kind: 'no', text: 'não possui automaticamente acesso aos nossos serviços' },
  ]
  return (
    <div className="col" style={{ alignItems: 'center', justifyContent: 'center', height: '100%', gap: 44 }}>
      <Ent show={step >= 0}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 8 }}>PAUSA CONCEITUAL</div>
        <NodeBox accent={palette.llm} title="LLM" glow style={{ padding: '30px 90px', textAlign: 'center' }} />
      </Ent>
      <div className="check-grid" style={{ gap: 16 }}>
        {rows.map((r, i) => (
          <Ent key={r.text} show={step >= 1} delay={i * 240}>
            <div className="row" style={{ gap: 16 }}>
              <span className={r.kind === 'ok' ? 'ok' : 'no'}>{r.kind === 'ok' ? '✓' : '✕'}</span>
              <span style={{ color: r.kind === 'ok' ? 'var(--text)' : 'var(--muted)', fontSize: 28 }}>{r.text}</span>
            </div>
          </Ent>
        ))}
      </div>
    </div>
  )
}
