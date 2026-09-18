import { addCaptionFromService } from './services/captionService.js'
import { generateImageFromService } from './services/imageService.js'
import { generateVideoFromService } from './services/videoService.js'

export interface WorkflowResult {
  image: { imageUrl: string; prompt: string; mock: false }
  video: { videoUrl: string; fromImage: string; mock: false }
  caption: { videoId: string; videoUrl?: string; caption: string; mock: false }
}

export async function runFullWorkflow(prompt: string): Promise<WorkflowResult> {
  // A ordem Imagem -> Vídeo -> Legenda foi programada pelo desenvolvedor.
  const imageUrl = await generateImageFromService(prompt)
  const image = { imageUrl, prompt, mock: false as const }
  const videoUrl = await generateVideoFromService(
    image.imageUrl,
    'Movimento suave de câmera para campanha premium do Vestido Aurora.',
  )
  const video = { videoUrl, fromImage: image.imageUrl, mock: false as const }
  const caption = addCaptionFromService(video.videoUrl, 'Vestido Aurora')
  return { image, video, caption }
}
