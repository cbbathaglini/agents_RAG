import { generateImage } from './imageTool.js'
import { ask } from '../rag/pipeline.js'
import { addCaptionFromService } from '../services/captionService.js'
import { generateVideoFromService } from '../services/videoService.js'

export const TOOL_SCHEMAS = [
  {
    type: 'function',
    function: {
      name: 'search_knowledge',
      description: 'Busca conhecimento relevante nos documentos da marca.',
      parameters: { type: 'object', properties: { query: { type: 'string' } } },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_image',
      description: 'Gera uma imagem a partir de uma descrição (serviço real).',
      parameters: { type: 'object', properties: { prompt: { type: 'string' } } },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_video',
      description: 'Transforma uma imagem em vídeo usando o Video Service.',
      parameters: { type: 'object', properties: { imageUrl: { type: 'string' }, imageId: { type: 'string' }, prompt: { type: 'string' } } },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_caption',
      description: 'Adiciona legenda ao vídeo.',
        parameters: {
          type: 'object',
          properties: { videoId: { type: 'string' }, videoUrl: { type: 'string' }, text: { type: 'string' } },
        },
    },
  },
]

export async function dispatch(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'search_knowledge':
      return ask(String(args.query))
    case 'generate_image':
      return { imageUrl: await generateImage(String(args.prompt)) }
    case 'generate_video':
      return {
        videoUrl: await generateVideoFromService(String(args.imageUrl ?? args.imageId ?? ''), String(args.prompt ?? '')),
        fromImage: args.imageUrl ?? args.imageId,
        mock: false,
      }
    case 'add_caption':
      return addCaptionFromService(String(args.videoUrl ?? args.videoId ?? ''), String(args.text ?? 'Vestido Aurora'))
    default:
      throw new Error(`Tool desconhecida: ${name}`)
  }
}
