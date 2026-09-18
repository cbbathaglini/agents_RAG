import { Ent, Statement, Pill, Bubble, ArrowDown } from '../components/ui'
import { palette } from '../theme'

const phases = [
  <div className="qline" style={{ fontSize: 32 }} key="a">Vamos juntar conhecimento e ação.</div>,
  <div key="b">
    <Bubble who="USUÁRIO" kind="user">Crie um vídeo para divulgar o Vestido Aurora.</Bubble>
    <div className="col" style={{ gap: 10, marginTop: 22, alignItems: 'flex-start', maxWidth: 900 }}>
      <div className="node-tag" style={{ fontSize: 16 }}>AGENT pensando (estado observável)</div>
      <div style={{ border: '1px solid var(--line-soft)', borderRadius: 12, padding: '14px 22px', fontFamily: 'var(--font-b)', fontSize: 23, color: 'var(--muted)' }}>
        “Eu sei que preciso gerar conteúdo…”<br />
        <span style={{ color: 'var(--text)' }}>“…mas o que é o Vestido Aurora?”</span>
      </div>
    </div>
  </div>,
  <div key="c" className="col" style={{ alignItems: 'center' }}>
    <div className="qline" style={{ fontSize: 26, marginBottom: 18 }}>O Agent precisa de conhecimento:</div>
    <div className="col" style={{ gap: 0, alignItems: 'center' }}>
      <Pill accent={palette.agent}>AGENT</Pill>
      <ArrowDown label="busca" color={palette.rag} />
      <Pill accent={palette.rag}>RAG</Pill>
      <ArrowDown label="consulta" color={palette.rag} />
      <Pill accent={palette.rag}>VECTOR DB</Pill>
      <ArrowDown label="encontra" color={palette.tool} />
      <Pill accent={palette.ms}>products.pdf</Pill>
      <div className="mono" style={{ margin: '10px 0 0', color: palette.good, fontSize: 16 }}>↩ contexto voltou para o Agent</div>
    </div>
  </div>,
  <div key="d" className="col" style={{ alignItems: 'center' }}>
    <div className="qline" style={{ fontSize: 26, marginBottom: 18 }}>Com contexto, decide a ação:</div>
    <div className="rowc" style={{ gap: 24 }}>
      <Pill accent={palette.agent}>AGENT</Pill>
      <span className="mono" style={{ color: 'var(--faint)', fontSize: 24 }}>→</span>
      <Pill accent={palette.tool}>generate_image()</Pill>
      <span className="mono" style={{ color: 'var(--faint)', fontSize: 24 }}>→</span>
      <Pill accent={palette.ms}>Image Service</Pill>
    </div>
  </div>,
  <div key="e">
    <Statement size="md" style={{ fontSize: 52 }}>O Agent pode usar RAG<br />como uma capacidade de conhecimento.</Statement>
    <div className="note-line" style={{ marginTop: 18 }}>RAG continua sendo RAG. O Agent apenas decide <em>quando</em> consultar.</div>
  </div>,
  <div key="f" className="col" style={{ alignItems: 'center', gap: 26 }}>
    <div className="rowc" style={{ gap: 30 }}>
      <Statement size="lg" style={{ color: palette.agent, fontSize: 74 }}>AGENT</Statement>
      <span className="mono" style={{ fontSize: 56, color: palette.bad }}>≠</span>
      <Statement size="lg" style={{ color: palette.rag, fontSize: 74 }}>RAG</Statement>
    </div>
    <Statement size="md" style={{ fontSize: 60, color: palette.good }}>AGENT PODE USAR RAG.</Statement>
  </div>,
]

export function s20({ step }: { step: number }) {
  const i = Math.min(step, phases.length - 1)
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Ent key={i} show kind="pop" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>{phases[i]}</div>
      </Ent>
    </div>
  )
}
