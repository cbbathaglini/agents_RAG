import 'dotenv/config'
import { existsSync } from 'node:fs'
import path from 'node:path'
import express from 'express'
import { imageRouter } from './services/imageService.js'
import { videoRouter } from './services/videoService.js'
import { captionRouter } from './services/captionService.js'
import { runFullWorkflow } from './workflow.js'
import { runAgent } from './agent/run.js'
import { runMultiAgent } from './agent/multi.js'
import { answerWithContext, ragLab, embedStats } from './rag/pipeline.js'
import { MODEL_ID } from './rag/embeddings.js'

const app = express()
app.use(express.json())

// "Microsserviços" da palestra
app.use('/images', imageRouter)
app.use('/videos', videoRouter)
app.use('/captions', captionRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Workflow fixo do Ato 1 (automação, sem IA)
app.post('/workflow', async (req, res) => {
  try {
    res.json(await runFullWorkflow(req.body?.prompt ?? ''))
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// Rota simples (sem streaming) — usada pelos scripts de terminal
app.post('/agent', async (req, res) => {
  try {
    const answer = await runAgent(req.body?.goal ?? '')
    res.json({ answer })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// ---------- SSE: eventos em tempo real ----------

type SSE = express.Response

function sseHeaders(res: SSE) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()
  const ping = setInterval(() => res.write(': ping\n\n'), 15000)
  res.on('close', () => clearInterval(ping))
}

function writeEvent(res: SSE, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

// Executa o fluxo Multi-Agent (Orchestrator + especialistas) e emite cada
// decisão/ação/resultado ao vivo, sempre identificando qual agente atuou.
app.get('/api/agent', async (req, res) => {
  sseHeaders(res)
  const goal = String(req.query.goal ?? '')
  const emit = (evt: { type: string }) => writeEvent(res, evt.type, evt)
  try {
    await runMultiAgent(goal, emit)
    writeEvent(res, 'close', {})
  } catch (err) {
    writeEvent(res, 'error', { message: (err as Error).message })
  } finally {
    res.end()
  }
})

// Laboratório RAG: recebe tamanho do chunk, overlap, top-K e threshold de
// similaridade, reindexa, e mostra chunking/embedding/resultados em tempo real.
app.get('/api/rag', async (req, res) => {
  sseHeaders(res)
  const question = String(req.query.q ?? '')
  const num = (v: unknown, d: number) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : d
  }
  const chunkSize = Math.round(num(req.query.chunkSize, 16))
  const overlap = Math.round(num(req.query.overlap, 3))
  const topK = Math.round(num(req.query.topK, 6))
  const threshold = num(req.query.threshold, 0)

  try {
    // 1) reindexa com os parâmetros escolhidos
    const { hits, chunking } = await ragLab(question, { chunkSize, overlap, topK })

    // 2) embedding da pergunta
    const qs = await embedStats(question)
    writeEvent(res, 'embedding', {
      agent: 'RAG',
      question,
      model: MODEL_ID,
      dims: qs.dims,
      values: qs.values,
    })

    // 3) monta mapa de scores por chunkId
    const scoreMap = new Map<string, number>()
    for (const h of hits) scoreMap.set(`${h.file}:${h.chunkId}`, h.score)

    // 4) chunking com scores em cada chunk
    const filesWithScores = chunking.files.map((f) => ({
      ...f,
      chunks: f.chunks.map((c) => ({
        ...c,
        score: scoreMap.get(`${f.file}:${c.chunkId}`) ?? null,
      })),
    }))
    writeEvent(res, 'chunking', { agent: 'RAG', overlap: chunking.overlap, files: filesWithScores })

    // 5) resultados com scores (marca quem está acima do threshold)
    const visible = hits.filter((h) => h.score >= threshold)
    writeEvent(res, 'rag-retrieval', {
      agent: 'RAG',
      question,
      threshold,
      topK,
      sources: hits.map((h) => ({
        ...h,
        inContext: h.score >= threshold,
      })),
    })

    // 4) resposta em streaming usando só os chunks acima do limiar
    const contextHits = visible.length > 0 ? visible : hits.slice(0, 1)
    writeEvent(res, 'text', { delta: '' }) // marca o início da resposta
    if (visible.length === 0) {
      writeEvent(res, 'text', {
        delta: `Nenhum resultado ficou acima do limiar de similaridade (${threshold.toFixed(2)}). Tente reduzir o threshold ou aumentar o top-K.`,
      })
    } else {
      await answerWithContext(question, contextHits, (delta) => {
        writeEvent(res, 'text', { delta })
      })
    }
    writeEvent(res, 'close', {})
  } catch (err) {
    writeEvent(res, 'error', { message: (err as Error).message })
  } finally {
    res.end()
  }
})

// Proxy de imagem: alguns provedores (ex.: Aliyun OSS) bloqueiam hotlink por
// Referer de localhost. Aqui o backend baixa a imagem e repassa para o front.
app.get('/api/image-proxy', async (req, res) => {
  const url = String(req.query.url ?? '')
  if (!/^https?:\/\//i.test(url)) {
    res.status(400).json({ error: 'URL inválida' })
    return
  }
  try {
    const up = await fetch(url)
    if (!up.ok) {
      res.status(502).json({ error: `origem respondeu ${up.status}` })
      return
    }
    res.setHeader('Content-Type', up.headers.get('content-type') ?? 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=86400')
    const bytes = await up.arrayBuffer()
    res.send(Buffer.from(bytes))
  } catch (err) {
    res.status(502).json({ error: (err as Error).message })
  }
})

// ---------- Frontend (estático) ----------

// Brand board (identidade visual) usado como placeholder da interface
const brandAssets = path.join(process.cwd(), 'src', 'docsData', 'assets')
app.use('/assets', express.static(brandAssets))

const webDir = path.join(process.cwd(), 'web')
const indexPath = path.join(webDir, 'index.html')
if (existsSync(indexPath)) {
  app.use(express.static(webDir))
  app.get('/', (_req, res) => res.sendFile(indexPath))
  console.log('frontend disponível em / (web/index.html)')
}

const port = Number(process.env.PORT ?? 8000)
app.listen(port, () => console.log(`vestido-aurora ouvindo em :${port}`))
