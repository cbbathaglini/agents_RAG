import type { SceneMeta } from '../presentation/types'
import { s00, s36, s39 } from './actfin'
import { s01, s02, s03, s04 } from './act1'
import { s05, s05b } from './act2'
import { s06, s07, s08, s08b, s09, s10, s11, s12, s13, s13b } from './act3'
import { s14, s15, s15b, s16, s16b, s17, s19 } from './act4'
import { s21, s22, s23, s24, s25, s26, s27, s28, s29 } from './act6'

const A1 = { act: '1', actTitle: 'Primeiro, não tem IA' }
const A2 = { act: '2', actTitle: 'A LLM entende' }
const A3 = { act: '3', actTitle: 'Como a IA acessa conhecimento?' }
const A4 = { act: '4', actTitle: 'Saber não é fazer' }
const A6 = { act: '6', actTitle: 'Um agente começa a crescer' }
const AF = { act: 'síntese', actTitle: 'Quem faz o quê?' }

export const SCENES: SceneMeta[] = [
  { id: 's00', ...({ act: '', actTitle: '' } as const), title: 'Capa', steps: 1, Component: s00 },
  { id: 's01', ...A1, title: 'Vamos construir um sistema', steps: 5, Component: s01 },
  { id: 's02', ...A1, title: 'Os três microsserviços', steps: 6, Component: s02 },
  { id: 's03', ...A1, title: 'Um workflow tradicional', steps: 6, Component: s03 },
  { id: 's04', ...A1, title: 'Os pedidos variam', steps: 6, Component: s04 },
  { id: 's05', ...A2, title: 'A LLM entende linguagem', steps: 6, Component: s05 },
  { id: 's05b', ...A2, title: 'Até aqui…', steps: 2, Component: s05b },
  { id: 's06', ...A3, title: 'O problema dos 50 mil documentos', steps: 6, Component: s06 },
  { id: 's07', ...A3, title: 'Um documento de verdade', steps: 4, Component: s07 },
  { id: 's08', ...A3, title: 'Chunking', steps: 5, Component: s08 },
  { id: 's08b', ...A3, title: 'Chunking Lab', steps: 1, Component: s08b },
  { id: 's09', ...A3, title: 'Buscar por significado', steps: 5, Component: s09 },
  { id: 's10', ...A3, title: 'Embeddings', steps: 3, Component: s10 },
  { id: 's11', ...A3, title: 'Vector Database', steps: 6, Component: s11 },
  { id: 's12', ...A3, title: 'Vamos fazer uma busca', steps: 5, Component: s12 },
  { id: 's13', ...A3, title: 'RAG completo', steps: 6, Component: s13 },
  { id: 's13b', ...A3, title: 'Até aqui… RAG', steps: 3, Component: s13b },
  { id: 's14', ...A4, title: 'Saber ≠ fazer', steps: 4, Component: s14 },
  { id: 's15', ...A4, title: 'Tools', steps: 5, Component: s15 },
  { id: 's15b', ...A4, title: 'Tool Inspector', steps: 1, Component: s15b },
  { id: 's16', ...A4, title: 'O que é um Agent?', steps: 7, Component: s16 },
  { id: 's16b', ...A4, title: 'O ciclo do Agent', steps: 3, Component: s16b },
  { id: 's17', ...A4, title: 'Um Agent trabalhando', steps: 11, Component: s17 },
  // s18 oculto: O experimento principal
  { id: 's19', ...A4, title: 'Workflow × Agent', steps: 6, Component: s19 },
  // s20 oculto: RAG dentro do Agent
  { id: 's21', ...A6, title: 'O Agent que cresce', steps: 6, Component: s21 },
  { id: 's22', ...A6, title: 'Criando especialistas', steps: 7, Component: s22 },
  { id: 's23', ...A6, title: 'Cuidado: serviço ≠ agente', steps: 5, Component: s23 },
  { id: 's24', ...A6, title: 'Orchestrator Agent', steps: 5, Component: s24 },
  { id: 's25', ...A6, title: 'Knowledge Agent', steps: 7, Component: s25 },
  { id: 's26', ...A6, title: 'Image Agent', steps: 6, Component: s26 },
  { id: 's27', ...A6, title: 'Video Agent', steps: 6, Component: s27 },
  { id: 's28', ...A6, title: 'Caption Agent', steps: 6, Component: s28 },
  { id: 's29', ...A6, title: 'Execução multi-agent', steps: 8, Component: s29 },
  // s30 oculto: Distributed trace
  // s30b, s31 e s32 ocultos
  // s33 oculto: Quem faz o quê?
  // s34, s35 e s36 ocultos
  // s37 oculto: Comparação final (matriz)
  // sGloss e s38 ocultos
  { id: 's39', ...AF, title: 'Use o simples que resolve', steps: 7, Component: s39 },
  { id: 's36', ...AF, title: 'Ferramentas reais', steps: 1, Component: s36 },
  // s40 oculto
]

export const totalScenes = SCENES.length
