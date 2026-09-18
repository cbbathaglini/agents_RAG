import type { ComponentType } from 'react'

export interface SceneProps {
  step: number
  total: number
}

export interface SceneMeta {
  id: string
  act: string
  actTitle: string
  title: string
  steps: number
  Component: ComponentType<SceneProps>
}

export interface DeckApi {
  index: number
  step: number
  scene: SceneMeta
  next: () => void
  prev: () => void
  goTo: (i: number) => void
  reset: () => void
  restartScene: () => void
  setAutoplay: (on: boolean) => void
  autoplay: boolean
  reduced: boolean
  toggleReduced: () => void
  notesOpen: boolean
  toggleNotes: () => void
  debug: boolean
  toggleDebug: () => void
  infra: boolean
  toggleInfra: () => void
  safe: boolean
  toggleSafe: () => void
}
