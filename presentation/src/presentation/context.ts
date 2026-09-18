import { createContext, useContext } from 'react'
import type { DeckApi } from './types'

export const DeckContext = createContext<DeckApi | null>(null)

export function useDeck(): DeckApi {
  const d = useContext(DeckContext)
  if (!d) throw new Error('useDeck fora do DeckProvider')
  return d
}
