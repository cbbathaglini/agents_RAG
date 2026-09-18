import { useCallback, useEffect, useMemo, useState } from 'react'
import { SCENES } from './scenes/registry'
import { DeckContext } from './presentation/context'
import type { DeckApi } from './presentation/types'
import { notes } from './data/notes'
import { palette } from './theme'
import './styles/global.css'

const LAST = SCENES.length - 1

function useReducedMotionPref() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'
  }, [reduced])
  return { reduced, setReduced }
}

export default function App() {
  const [nav, setNav] = useState({ i: 0, s: 0 })
  const [autoplay, setAutoplay] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [debug, setDebug] = useState(false)
  const [safe, setSafe] = useState(false)
  const [infra, setInfra] = useState(false)
  const [jump, setJump] = useState('')
  const [lightTheme, setLightTheme] = useState(() => localStorage.getItem('presentation-theme') === 'light')
  const { reduced, setReduced } = useReducedMotionPref()
  const [scale, setScale] = useState(1)
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null)

  const i = nav.i
  const s = nav.s
  const scene = SCENES[i]
  const total = scene.steps

  useEffect(() => {
    document.documentElement.dataset.theme = lightTheme ? 'light' : 'dark'
    localStorage.setItem('presentation-theme', lightTheme ? 'light' : 'dark')
  }, [lightTheme])

  const next = useCallback(() => {
    setNav((n) => {
      const sc = SCENES[n.i]
      if (n.s < sc.steps - 1) return { i: n.i, s: n.s + 1 }
      if (n.i < LAST) return { i: n.i + 1, s: 0 }
      return n
    })
  }, [])

  const prev = useCallback(() => {
    setNav((n) => {
      if (n.s > 0) return { i: n.i, s: n.s - 1 }
      if (n.i > 0) return { i: n.i - 1, s: SCENES[n.i - 1].steps - 1 }
      return n
    })
  }, [])

  const goTo = useCallback((idx: number) => {
    setNav({ i: Math.max(0, Math.min(LAST, idx)), s: 0 })
  }, [])

  /* redimensionamento: stage projetado em 1920×1080 */
  useEffect(() => {
    if (!viewport) return
    const ro = new ResizeObserver(() => {
      setScale(Math.min(viewport.clientWidth / 1920, viewport.clientHeight / 1080))
    })
    ro.observe(viewport)
    return () => ro.disconnect()
  }, [viewport])

  /* autoplay */
  useEffect(() => {
    if (!autoplay) return
    const id = window.setInterval(() => {
      setNav((n) => {
        const sc = SCENES[n.i]
        if (n.s < sc.steps - 1) return { i: n.i, s: n.s + 1 }
        if (n.i < LAST) return { i: n.i + 1, s: 0 }
        return n
      })
    }, 7000)
    return () => window.clearInterval(id)
  }, [autoplay])

  /* para o autoplay ao chegar no fim */
  useEffect(() => {
    if (autoplay && i === LAST && s >= SCENES[LAST].steps - 1) setAutoplay(false)
  }, [autoplay, i, s])

  /* teclado */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const k = e.key
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown') {
        e.preventDefault()
        next()
      } else if (k === 'ArrowLeft' || k === 'PageUp') {
        e.preventDefault()
        prev()
      } else if (k === 'Home') goTo(0)
      else if (k === 'End') goTo(LAST)
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen?.()
      } else if (k === 'n' || k === 'N') setNotesOpen((x) => !x)
      else if (k === 'r' || k === 'R') setNav((n) => ({ i: n.i, s: 0 }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, goTo])

  const api = useMemo<DeckApi>(
    () => ({
      index: i,
      step: s,
      scene,
      next,
      prev,
      goTo,
      reset: () => goTo(0),
      restartScene: () => setNav((n) => ({ i: n.i, s: 0 })),
      autoplay,
      setAutoplay,
      reduced,
      toggleReduced: () => setReduced((r) => !r),
      notesOpen,
      toggleNotes: () => setNotesOpen((x) => !x),
      debug,
      toggleDebug: () => setDebug((x) => !x),
      infra,
      toggleInfra: () => setInfra((x) => !x),
      safe,
      toggleSafe: () => setSafe((x) => !x),
    }),
    [i, s, scene, next, prev, goTo, autoplay, reduced, notesOpen, debug, infra, safe, setReduced],
  )

  const Comp = scene.Component
  const talk = notes[scene.id] ?? ['Avançar passo a passo com espaço ou seta direita.']
  const pct = (i + s / (total - 1 || 1)) / LAST

  const btn = (label: string, on: boolean, click: () => void, hint: string) => (
    <button className={on ? 'ctrl on' : 'ctrl'} title={hint} onClick={click}>
      {label}
    </button>
  )

  return (
    <DeckContext.Provider value={api}>
      <div className="viewport" ref={setViewport}>
        <div className="stage" style={{ transform: `scale(${scale})` }}>
          <div className="sbody">
            <Comp step={Math.min(s, total - 1)} total={total} />
          </div>

          {scene.act && (
            <div className="act-flag">
              <b>ATO {scene.act}</b> · {scene.actTitle}
            </div>
          )}

          <div className="toolbar" style={{ position: 'absolute', right: 40, top: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, zIndex: 30 }}>
            <button
              className={lightTheme ? 'ctrl on theme-toggle' : 'ctrl theme-toggle'}
              title={lightTheme ? 'Usar fundo escuro' : 'Usar fundo claro'}
              aria-label={lightTheme ? 'Usar fundo escuro' : 'Usar fundo claro'}
              aria-pressed={lightTheme}
              onClick={() => setLightTheme((value) => !value)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.2 15.4A8.4 8.4 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
              </svg>
            </button>
            {btn(autoplay ? 'autoplay on' : 'autoplay', autoplay, () => setAutoplay((x) => !x), 'Autoplay')}
            {btn('notas', notesOpen, () => setNotesOpen((x) => !x), 'Notas do apresentador (N)')}
            {btn('infra', infra, () => setInfra((x) => !x), 'Mostrar infraestrutura')}
            {btn(reduced ? 'motion off' : 'motion on', reduced, () => setReduced((r) => !r), 'Reduzir movimento')}
            {btn('depurar', debug, () => setDebug((x) => !x), 'Painel de debug')}
            {btn('fullscreen', false, () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()), 'Tela cheia (F)')}
          </div>

          {notesOpen && (
            <div className="notes-panel">
              <h5>{scene.id.toUpperCase()} · notas do apresentador</h5>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {talk.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
              <button className="ctrl" style={{ marginTop: 14 }} onClick={() => setNotesOpen(false)}>
                fechar notas
              </button>
            </div>
          )}

          {debug && (
            <div className="debug">
              <small>
                {scene.id} · passo {s + 1}/{total} · cena {i + 1}/{SCENES.length}
              </small>
              <div className="debug-grid">
                {SCENES.map((sc, idx) => (
                  <button key={sc.id} className={idx === i ? 'on' : ''} onClick={() => goTo(idx)}>
                    {sc.id}
                  </button>
                ))}
              </div>
              <div className="rowc" style={{ justifyContent: 'space-between' }}>
                <button className="ctrl" style={{ fontSize: 12 }} onClick={() => goTo(0)}>reiniciar</button>
                <button className="ctrl" style={{ fontSize: 12 }} onClick={() => setNav((n) => ({ i: n.i, s: 0 }))}>reset cena</button>
                <button className="ctrl" style={{ fontSize: 12, color: safe ? palette.kafka : undefined }} onClick={() => setSafe((x) => !x)}>safe-area</button>
              </div>
            </div>
          )}

          {safe && <div className="safearea" />}

          <div className="bottom-bar">
            <span className="hint">← → ou espaço para avançar</span>
            <div className="prog">
              <div className="fill" style={{ width: `${Math.min(100, pct * 100)}%` }} />
            </div>
            <span className="hint" style={{ color: 'var(--muted)' }}>
              {String(i + 1).padStart(2, '0')}/{String(SCENES.length).padStart(2, '0')}
            </span>
            <div className="rowc" style={{ gap: 8, marginLeft: 12 }}>
              <span className="hint" style={{ color: 'var(--faint)' }}>ir p/</span>
              <input
                aria-label="Ir para o slide"
                type="number"
                min={1}
                max={SCENES.length}
                value={jump}
                onChange={(e) => setJump(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const n = Math.round(Number(jump))
                    if (Number.isFinite(n) && n >= 1 && n <= SCENES.length) {
                      goTo(n - 1)
                      setJump('')
                    } else {
                      setJump(String(i + 1))
                    }
                  }
                }}
                onBlur={() => setJump('')}
                placeholder={String(i + 1)}
                style={{
                  width: 70,
                  background: 'var(--bg-r)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-m)',
                  fontSize: 15,
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderRadius: 10,
                }}
              />
            </div>
            <div className="rowc" style={{ gap: 8, marginLeft: 12 }}>
              <button className="ctrl" title="Anterior" onClick={prev}>‹</button>
              <button className="ctrl" title="Próximo" onClick={next}>›</button>
              <button className="ctrl" title="Recomeçar a apresentação (Home)" onClick={() => goTo(0)}>recomeçar</button>
            </div>
          </div>
        </div>
      </div>
    </DeckContext.Provider>
  )
}
