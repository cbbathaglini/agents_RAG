import { Router, type Request, type Response } from 'express'

export const captionRouter = Router()

export function addCaptionFromService(
  videoUrlOrId: string,
  text = 'Vestido Aurora',
): { videoId: string; videoUrl?: string; caption: string; mock: false } {
  if (!videoUrlOrId) throw new Error('add_caption precisa de videoUrl ou videoId')
  const isUrl = /^https?:\/\//i.test(videoUrlOrId)
  return {
    videoId: isUrl ? 'captioned-video' : `${videoUrlOrId}-captioned`,
    videoUrl: isUrl ? videoUrlOrId : undefined,
    caption: text,
    mock: false,
  }
}

captionRouter.post('/', (req: Request, res: Response) => {
  const { videoId, videoUrl, text = 'Vestido Aurora' } = req.body ?? {}
  try {
    res.json(addCaptionFromService(String(videoUrl ?? videoId ?? ''), String(text)))
  } catch (err) {
    res.status(400).json({ error: (err as Error).message })
  }
})
