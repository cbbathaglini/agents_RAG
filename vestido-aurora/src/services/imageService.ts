import { Router, type Request, type Response } from 'express'
import { withBrandIdentity } from '../tools/brandStyle.js'

export const imageRouter = Router()

const KEY = process.env.ATLASCLOUD_API_KEY ?? ''
const IMAGE_MODEL = 'alibaba/wan-2.7-pro/image-edit'

function normalizeBase(): string {
  let base = (process.env.ATLASCLOUD_BASE_URL ?? 'https://api.atlascloud.ai/api/v1/model').trim()
  base = base.replace(/\/+$/, '')
  base = base.replace(/\/generateImage$/i, '')
  return base
}

const BASE = normalizeBase()
const GENERATE_URL = `${BASE}/generateImage`

const POLL_LIMIT = 90
const POLL_INTERVAL_MS = 2000

export async function generateImageFromService(
  rawPrompt: string,
  onStatus?: (status: string) => void,
): Promise<string> {
  if (!KEY) throw new Error('ATLASCLOUD_API_KEY não configurada no .env')

  const prompt = withBrandIdentity(rawPrompt)
  console.log(`[imageService] usando modelo "${IMAGE_MODEL}" em ${GENERATE_URL}`)
  const start = await fetch(GENERATE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: IMAGE_MODEL, prompt }),
  })
  if (!start.ok) {
    throw new Error(`Atlas start ${start.status} em ${GENERATE_URL} (modelo "${IMAGE_MODEL}"): ${await start.text()}`)
  }

  const id = (await start.json()).data.id as string
  for (let i = 0; i < POLL_LIMIT; i++) {
    onStatus?.('gerando...')
    const poll = await fetch(`${BASE}/prediction/${id}`, {
      headers: { Authorization: `Bearer ${KEY}` },
    })
    if (!poll.ok) throw new Error(`Atlas poll ${poll.status}: ${await poll.text()}`)
    const data = (await poll.json()).data
    if (data.status === 'completed') return data.outputs[0] as string
    if (data.status === 'failed') throw new Error(`Atlas falhou: ${data.error ?? 'erro desconhecido'}`)
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }

  throw new Error('A imagem demorou demais para ser gerada')
}

export function imageEndpointInfo(): { url: string; model: string } {
  return { url: GENERATE_URL, model: IMAGE_MODEL }
}

imageRouter.post('/', async (req: Request, res: Response) => {
  const { prompt = '' } = req.body ?? {}
  try {
    const imageUrl = await generateImageFromService(String(prompt))
    res.json({ imageUrl, prompt, mock: false })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})
