import { palette } from '../theme'
import type { TraceEvent } from '../types'

export const trace: TraceEvent[] = [
  { t: '00:00', actor: 'USUÁRIO', actorColor: palette.text, action: 'Pedido recebido', detail: '“Crie um vídeo de 15s para divulgar o Vestido Aurora.”' },
  { t: '00:01', actor: 'ORCHESTRATOR', actorColor: palette.agent, action: 'Delegou → Knowledge Agent' },
  { t: '00:02', actor: 'KNOWLEDGE AGENT', actorColor: palette.rag, action: 'Executou → search_knowledge()' },
  { t: '00:03', actor: 'RAG', actorColor: palette.rag, action: '3 chunks recuperados', detail: 'products.pdf · brand-guide.pdf' },
  { t: '00:04', actor: 'ORCHESTRATOR', actorColor: palette.agent, action: 'Delegou → Image Agent' },
  { t: '00:05', actor: 'IMAGE AGENT', actorColor: palette.agent, action: 'Executou → generate_image()' },
  { t: '00:08', actor: 'IMAGE SERVICE', actorColor: palette.ms, action: 'IMG-8472 criado' },
  { t: '00:09', actor: 'ORCHESTRATOR', actorColor: palette.agent, action: 'Delegou → Video Agent' },
  { t: '00:10', actor: 'VIDEO AGENT', actorColor: palette.agent, action: 'Executou → generate_video()' },
  { t: '00:14', actor: 'VIDEO SERVICE', actorColor: palette.ms, action: 'VID-9321 criado' },
  { t: '00:15', actor: 'ORCHESTRATOR', actorColor: palette.agent, action: 'Delegou → Caption Agent' },
  { t: '00:16', actor: 'CAPTION AGENT', actorColor: palette.agent, action: 'Executou → add_caption()' },
  { t: '00:19', actor: 'CAPTION SERVICE', actorColor: palette.ms, action: 'VID-9321-captioned pronto' },
  { t: '00:20', actor: 'ORCHESTRATOR', actorColor: palette.agent, action: 'Objetivo concluído', detail: 'retorna vídeo final ao usuário' },
]

export interface DataStep {
  kind: 'contexto' | 'prompt' | 'asset' | 'asset2' | 'final'
  label: string
  sub?: string
}

export const dataFlow: DataStep[] = [
  { kind: 'contexto', label: 'contexto do produto', sub: 'Vestido Aurora · seda · 25–40 anos' },
  { kind: 'prompt', label: 'prompt da imagem', sub: 'vestido elegante, tom da marca' },
  { kind: 'asset', label: 'IMG-8472', sub: 'imagem gerada' },
  { kind: 'asset2', label: 'VID-9321', sub: 'vídeo gerado' },
  { kind: 'final', label: 'VID-9321-captioned', sub: 'vídeo com legenda' },
]

export interface XRayRow {
  label: string
  value: string
  color: string
}

export const xrayRows: XRayRow[] = [
  { label: 'QUEM DECIDIU', value: 'Orchestrator', color: palette.agent },
  { label: 'PARA QUEM DELEGOU', value: 'Image Agent', color: palette.agent },
  { label: 'QUAL CAPACIDADE FOI ESCOLHIDA', value: 'generate_image()', color: palette.tool },
  { label: 'QUAL CHAMADA REAL ACONTECEU', value: 'POST /images', color: palette.ms },
  { label: 'QUEM EXECUTOU', value: 'Image Service', color: palette.ms },
  { label: 'O QUE RETORNOU', value: 'IMG-8472', color: palette.text },
]

export interface KafkaEvent {
  name: string
  payload: string
}

export const kafkaEvents: KafkaEvent[] = [
  { name: 'image.generated', payload: '{ "imageId": "IMG-8472" }' },
  { name: 'video.generated', payload: '{ "videoId": "VID-9321" }' },
  { name: 'caption.generated', payload: '{ "videoId": "VID-9321-captioned" }' },
]
