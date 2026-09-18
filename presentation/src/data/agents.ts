import { palette } from '../theme'
import type { AgentDef } from '../types'

export const agentRoles: AgentDef[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    color: palette.agent,
    role: 'coordena os especialistas',
    traits: [
      'interpretar o objetivo',
      'descobrir quais especialistas são necessários',
      'delegar',
      'receber resultados',
      'decidir o próximo passo',
      'manter o contexto da execução',
    ],
  },
  {
    id: 'knowledge',
    name: 'Knowledge Agent',
    color: palette.rag,
    role: 'encontra o conhecimento necessário',
    toolIds: ['search_knowledge'],
    traits: ['busca contexto nos documentos', 'usa RAG como mecanismo'],
  },
  {
    id: 'image',
    name: 'Image Agent',
    color: palette.agent,
    role: 'cuida da criação de imagem',
    toolIds: ['generate_image'],
    traits: ['decide o prompt', 'chama a tool de imagem'],
  },
  {
    id: 'video',
    name: 'Video Agent',
    color: palette.agent,
    role: 'cuida da criação de vídeo',
    toolIds: ['generate_video'],
    traits: ['anima a imagem', 'chama a tool de vídeo'],
  },
  {
    id: 'caption',
    name: 'Caption Agent',
    color: palette.agent,
    role: 'cuida da legenda',
    toolIds: ['add_caption'],
    traits: ['escolhe o texto', 'chama a tool de legenda'],
  },
]

export const monolithTraits = [
  'RAG',
  'generate_image',
  'generate_video',
  'add_caption',
  'instruções de imagem',
  'instruções de vídeo',
  'instruções de legenda',
  'regras da marca',
  'estado',
  'contexto',
  'memória',
]

export interface DecisionEvent {
  step: string
  text: string
  actorColor?: string
}

export const fullVideoDecisions: DecisionEvent[] = [
  { step: 'OBJETIVO', text: 'Criar um vídeo completo do Vestido Aurora.' },
  { step: 'DECISÃO', text: 'Primeiro preciso de uma imagem.' },
  { step: 'OBSERVAÇÃO', text: 'Imagem pronta (IMG-8472).' },
  { step: 'DECISÃO', text: 'Agora preciso transformá-la em vídeo.' },
  { step: 'OBSERVAÇÃO', text: 'Vídeo pronto (VID-9321).' },
  { step: 'DECISÃO', text: 'Falta a legenda.' },
  { step: 'OBSERVAÇÃO', text: 'Legenda adicionada.' },
  { step: 'RESULTADO', text: 'Objetivo concluído.' },
]

export interface MultiAgentStage {
  label: string
  orchestratorSay?: string
  agent?: string
  agentColor?: string
  tool?: string
  service?: string
  serviceColor?: string
  result?: string
  resultLabel?: string
  docs?: { file: string; note: string }[]
  details?: string
}

export const multiAgentRun: MultiAgentStage[] = [
  {
    label: 'Pedido recebido',
    orchestratorSay: '“Crie um vídeo de 15 segundos para divulgar o Vestido Aurora.”',
  },
  {
    label: 'ETAPA 1 · conhecimento',
    orchestratorSay: '“Preciso entender o produto e o tom da marca.”',
    agent: 'Knowledge Agent',
    agentColor: palette.rag,
    tool: 'search_knowledge()',
    resultLabel: 'RAG',
    docs: [
      { file: 'products.pdf', note: 'Vestido Aurora · cor vermelho · seda · público 25–40' },
      { file: 'brand-guide.pdf', note: 'tom elegante e moderno' },
    ],
  },
  {
    label: 'ETAPA 2 · imagem',
    orchestratorSay: '“Agora tenho contexto suficiente para criar a imagem.”',
    agent: 'Image Agent',
    tool: 'generate_image()',
    service: 'Image Service',
    serviceColor: palette.ms,
    result: 'IMG-8472',
  },
  {
    label: 'ETAPA 3 · vídeo',
    orchestratorSay: '“A imagem está pronta. Agora precisamos animá-la.”',
    agent: 'Video Agent',
    tool: 'generate_video()',
    service: 'Video Service',
    serviceColor: palette.ms,
    result: 'VID-9321',
  },
  {
    label: 'ETAPA 4 · legenda',
    orchestratorSay: '“O vídeo está pronto. Falta a legenda.”',
    agent: 'Caption Agent',
    tool: 'add_caption()',
    service: 'Caption Service',
    serviceColor: palette.ms,
    result: 'VID-9321-captioned',
  },
  {
    label: 'ETAPA 5 · resultado',
    orchestratorSay: '“Objetivo concluído.”',
    result: 'VÍDEO FINAL',
    resultLabel: 'VID-9321-captioned',
  },
]
