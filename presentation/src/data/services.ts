import { palette } from '../theme'
import type { MicroService, RequestCase, ToolDef } from '../types'

export const svc = {
  image: {
    id: 'image',
    name: 'Image Service',
    short: 'Image',
    color: palette.ms,
    endpoint: 'POST /images',
    responsibility: 'gerar uma imagem.',
    exampleInput: '{ "prompt": "Mulher usando um vestido vermelho" }',
    exampleOutput: '{ "imageId": "IMG-8472" }',
  },
  video: {
    id: 'video',
    name: 'Video Service',
    short: 'Video',
    color: palette.ms,
    endpoint: 'POST /videos',
    responsibility: 'transformar uma imagem em vídeo.',
    exampleInput: '{ "imageId": "IMG-8472", "prompt": "..." }',
    exampleOutput: '{ "videoId": "VID-9321" }',
  },
  caption: {
    id: 'caption',
    name: 'Caption Service',
    short: 'Caption',
    color: palette.ms,
    endpoint: 'POST /captions',
    responsibility: 'adicionar legenda ao vídeo.',
    exampleInput: '{ "videoId": "VID-9321", "text": "..." }',
    exampleOutput: '{ "videoId": "VID-9321-captioned" }',
  },
} satisfies Record<string, MicroService>

export const services: MicroService[] = [svc.image, svc.video, svc.caption]

export const tools: ToolDef[] = [
  {
    id: 'generate_image',
    fn: 'generate_image(prompt)',
    params: '{ "prompt": "string" }',
    what: 'Gera uma imagem a partir de uma descrição.',
    endpoint: 'POST /images',
    executedBy: 'Image Service',
    serviceId: 'image',
    color: palette.tool,
  },
  {
    id: 'generate_video',
    fn: 'generate_video(image_id, prompt)',
    params: '{ "imageId": "IMG-8472", "prompt": "string" }',
    what: 'Transforma uma imagem em vídeo.',
    endpoint: 'POST /videos',
    executedBy: 'Video Service',
    serviceId: 'video',
    color: palette.tool,
  },
  {
    id: 'add_caption',
    fn: 'add_caption(video_id, text)',
    params: '{ "videoId": "VID-9321", "text": "string" }',
    what: 'Adiciona legenda a um vídeo.',
    endpoint: 'POST /captions',
    executedBy: 'Caption Service',
    serviceId: 'caption',
    color: palette.tool,
  },
  {
    id: 'search_knowledge',
    fn: 'search_knowledge(query)',
    params: '{ "query": "string" }',
    what: 'Busca conhecimento relevante nos documentos internos.',
    endpoint: 'RAG · busca por similaridade',
    executedBy: 'Knowledge Agent',
    serviceId: 'knowledge',
    color: palette.rag,
  },
]

export const requests: RequestCase[] = [
  {
    id: 'req1',
    label: 'Gere apenas uma imagem.',
    long: '“Gere apenas uma imagem.”',
    steps: [
      { tool: 'generate_image()', needed: true },
      { tool: 'generate_video()', needed: false },
      { tool: 'add_caption()', needed: false },
    ],
    why: 'Só precisava da imagem.',
  },
  {
    id: 'req2',
    label: 'Anime esta imagem.',
    long: '“Anime esta imagem.”',
    steps: [
      { tool: 'generate_image()', needed: false },
      { tool: 'generate_video()', needed: true },
      { tool: 'add_caption()', needed: false },
    ],
    why: 'A imagem já existia.',
  },
  {
    id: 'req3',
    label: 'Coloque legenda neste vídeo.',
    long: '“Coloque legenda neste vídeo.”',
    steps: [
      { tool: 'generate_image()', needed: false },
      { tool: 'generate_video()', needed: false },
      { tool: 'add_caption()', needed: true },
    ],
    why: 'O vídeo já existia.',
  },
  {
    id: 'req4',
    label: 'Crie tudo a partir desta descrição.',
    long: '“Crie tudo a partir desta descrição.”',
    steps: [
      { tool: 'generate_image()', needed: true },
      { tool: 'generate_video()', needed: true },
      { tool: 'add_caption()', needed: true },
    ],
    why: 'Precisava do caminho completo.',
  },
]
