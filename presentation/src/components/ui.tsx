import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { rgba } from '../theme'

export const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(' ')

export const cssVar = (accent: string, extra: CSSProperties = {}) =>
  ({ ['--ac']: accent, ...extra }) as CSSProperties

export function Ent({
  show,
  kind = 'rise',
  delay = 0,
  className,
  style,
  children,
}: {
  show: boolean
  kind?: 'rise' | 'pop' | 'fade'
  delay?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const [vis, setVis] = useState(false)
  useEffect(() => {
    setVis(show)
  }, [show])
  return (
    <div
      className={cx(kind, vis && 'in', className)}
      style={{
        ...(vis ? { transitionDelay: `${delay}ms` } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function NodeBox({
  accent,
  title,
  titleMono = true,
  sub,
  tag,
  glow,
  onClick,
  children,
  className,
  style,
  small,
}: {
  accent: string
  title: ReactNode
  titleMono?: boolean
  sub?: ReactNode
  tag?: ReactNode
  glow?: boolean
  onClick?: () => void
  children?: ReactNode
  className?: string
  style?: CSSProperties
  small?: boolean
}) {
  const inner = (
    <div className={cx('node', glow && 'node--glow', small && 'node--small', className)} data-ac style={cssVar(accent, style)}>
      <div className="node-name" data-ac style={{ fontFamily: titleMono ? undefined : 'var(--font-d)', fontSize: small ? 19 : 24 }}>
        {title}
      </div>
      {sub && <div className="node-sub">{sub}</div>}
      {tag && <div style={{ marginTop: 8 }}>{tag}</div>}
      {children}
    </div>
  )
  return onClick ? <button type="button" onClick={onClick} style={{ background: 'transparent', border: 0, padding: 0, textAlign: 'left' }}>{inner}</button> : inner
}

export function Pill({
  accent,
  children,
  onClick,
  big,
  dim,
}: {
  accent: string
  children: ReactNode
  onClick?: () => void
  big?: boolean
  dim?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ac
      className="pill"
      style={{
        ...cssVar(accent),
        opacity: dim ? 0.28 : 1,
        fontSize: big ? 26 : undefined,
        padding: big ? '18px 30px' : undefined,
      }}
    >
      {children}
    </button>
  )
}

export function Statement({
  children,
  size = 'lg',
  className,
  style,
}: {
  children: ReactNode
  size?: 'xl' | 'lg' | 'md' | 'sm'
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={cx('statement', `st-${size}`, className)} style={style}>
      {children}
    </div>
  )
}

export function Bubble({ who, kind, children }: { who: string; kind: 'user' | 'llm'; children: ReactNode }) {
  return (
    <div className={cx('bubble', `bubble--${kind}`)}>
      <div className="who">{who}</div>
      <div>{children}</div>
    </div>
  )
}

export function KV({ rows, accent }: { rows: { k: string; v: string }[]; accent?: string }) {
  return (
    <div className="kv">
      {rows.map((r) => (
        <div className="kv-row" key={r.k}>
          <span className="kv-k" style={{ color: accent ?? undefined }}>
            {r.k}
          </span>
          <span className="kv-v">{r.v}</span>
        </div>
      ))}
    </div>
  )
}

export function JsonCard({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <div className="eyebrow" style={{ color: 'var(--muted)' }}>
          {label}
        </div>
      )}
      <pre className="json-card" style={{ margin: 0 }}>{children}</pre>
    </div>
  )
}

export function ArrowDown({ label, color = 'var(--faint)', className }: { label?: string; color?: string; className?: string }) {
  return (
    <div className={cx('flow-v', className)} style={{ gap: 2 }}>
      {label && (
        <div className="edge-label" style={{ color }}>
          {label}
        </div>
      )}
      <div className="edge" style={{ ['--ed' as string]: color }} />
    </div>
  )
}

export function Dot({ color, radius = 10 }: { color: string; radius?: number }) {
  return <span style={{ width: radius, height: radius, borderRadius: 6, background: color, display: 'inline-block', flex: 'none' }} />
}

export const colorLine = (c: string) => ({ color: c, borderColor: rgba(c, 0.35) })
