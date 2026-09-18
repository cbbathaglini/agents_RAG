// Smoke test: renderiza App e todas as cenas via renderToString (sem efeitos/browser).
import { createServer } from 'vite'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

globalThis.window = {
  matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
  addEventListener() {},
  removeEventListener() {},
} 
globalThis.document = {
  documentElement: { dataset: {} },
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { SCENES } = await server.ssrLoadModule('/src/scenes/registry.tsx')
  const React = require('react')
  const { renderToString } = require('react-dom/server')
  const { DeckContext } = await server.ssrLoadModule('/src/presentation/context.ts')

  renderToString(React.createElement(App))
  console.log('✓ App (capa)')

  const fakeApi = {
    index: 0, step: 0, scene: SCENES[0], next() {}, prev() {}, goTo() {}, reset() {}, restartScene() {},
    autoplay: false, setAutoplay() {}, reduced: true, toggleReduced() {},
    notesOpen: false, toggleNotes() {}, debug: false, toggleDebug() {}, infra: false, toggleInfra() {}, safe: false, toggleSafe() {},
  }
  const wrap = (node) => React.createElement(DeckContext.Provider, { value: fakeApi }, node)

  for (const sc of SCENES) {
    for (const step of [0, Math.floor(sc.steps / 2), sc.steps - 1]) {
      try {
        renderToString(wrap(React.createElement(sc.Component, { step, total: sc.steps })))
      } catch (e) {
        console.error(`✗ ${sc.id} passo ${step}:`, (e && e.message) || e)
        process.exitCode = 1
      }
    }
  }
  console.log('✓ todas as cenas renderizadas')
} finally {
  await server.close()
}
