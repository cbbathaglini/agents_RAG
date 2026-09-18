import { Router, type Request, type Response } from 'express'

export const videoRouter = Router()

const KEY = process.env.ATLASCLOUD_API_KEY ?? ''

function normalizeBase(): string {
  let base = (process.env.ATLASCLOUD_BASE_URL ?? 'https://api.atlascloud.ai/api/v1/model').trim()
  base = base.replace(/\/+$/, '')
  base = base.replace(/\/generateVideo$/i, '')
  return base
}

const BASE = normalizeBase()
const GENERATE_URL = `${BASE}/generateVideo`
const VIDEO_MODEL = process.env.VIDEO_MODEL ?? 'alibaba/wan-2.7/image-to-video'
const POLL_LIMIT = 120
const POLL_INTERVAL_MS = 2000
const VIDEO_CONSTRAINTS = 'O vídeo deve ter no máximo 3 segundos, sem áudio.'

export async function generateVideoFromService(
  imageUrlOrId: string,
  prompt = 'Vídeo curto e elegante do Vestido Aurora em movimento suave.',
  onStatus?: (status: string) => void,
): Promise<string> {
  if (!KEY) throw new Error('ATLASCLOUD_API_KEY não configurada no .env')
  if (!imageUrlOrId) throw new Error('generate_video precisa de imageUrl ou imageId')
  const finalPrompt = `${prompt.trim() || 'Vídeo curto e elegante do Vestido Aurora em movimento suave.'} ${VIDEO_CONSTRAINTS}`

  console.log(`[videoService] tentando modelo "${VIDEO_MODEL}" em ${GENERATE_URL}`)
  const start = await fetch(GENERATE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: VIDEO_MODEL,
      prompt: finalPrompt,
      image: imageUrlOrId,
      imageUrl: imageUrlOrId,
      image_id: imageUrlOrId,
    }),
  })
  if (!start.ok) throw new Error(`Atlas video start ${start.status}: ${await start.text()}`)

  const id = (await start.json()).data.id as string
  for (let i = 0; i < POLL_LIMIT; i++) {
    onStatus?.('gerando video...')
    const poll = await fetch(`${BASE}/prediction/${id}`, {
      headers: { Authorization: `Bearer ${KEY}` },
    })
    if (!poll.ok) throw new Error(`Atlas video poll ${poll.status}: ${await poll.text()}`)
    const data = (await poll.json()).data
    if (data.status === 'completed') return data.outputs[0] as string
    if (data.status === 'failed') throw new Error(`Atlas video falhou: ${data.error ?? 'erro desconhecido'}`)
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  throw new Error('O vídeo demorou demais para ser gerado')
}

export function videoEndpointInfo(): { url: string; model: string } {
  return { url: GENERATE_URL, model: VIDEO_MODEL }
}

videoRouter.post('/', async (req: Request, res: Response) => {
  const { imageUrl, imageId, prompt } = req.body ?? {}
  try {
    const videoUrl = await generateVideoFromService(String(imageUrl ?? imageId ?? ''), String(prompt ?? ''))
    res.json({ videoUrl, fromImage: imageUrl ?? imageId, mock: false })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})
