# 03 · Passo a passo — a base do projeto (Express + TS)

> **Corresponde aos slides do Ato 1.** Não existe IA ainda. São três serviços que sabem
> fazer uma coisa cada, e um workflow sem IA que encadeia Imagem → Vídeo → Legenda.

## Estrutura desta etapa

```
vestido-aurora/
  src/
    server.ts              # Express que monta tudo e sobe na :8000
    workflow.ts            # automação Imagem -> Vídeo -> Legenda
    services/
      imageService.ts      # "Image Service" real -> Atlas Cloud
      videoService.ts      # "Video Service" real -> Atlas Cloud
      captionService.ts    # "Caption Service" local
```

## 1. Os três "microsserviços"

Cada serviço é um módulo que exporta um **router** do Express. Na aplicação atual,
`Image Service` e `Video Service` chamam a Atlas Cloud de verdade. `Caption Service`
aplica a legenda localmente no retorno da API, sem LLM e sem decisão dinâmica.

`src/services/imageService.ts`

```ts
import { Router } from 'express'

export const imageRouter = Router()

// No arquivo real, esta função chama a Atlas Cloud com polling usando
// sempre o modelo alibaba/wan-2.7-pro/image-edit.
async function generateImageFromService(prompt: string) {
  return 'https://.../imagem-gerada.png'
}

imageRouter.post('/', async (req, res) => {
  const { prompt = '' } = req.body ?? {}
  const imageUrl = await generateImageFromService(String(prompt))
  res.json({ imageUrl, prompt, mock: false })
})
```

Na demo com agentes, o caminho fica igual ao dos slides:

```text
Image Agent -> tool generate_image -> Image Service -> Atlas Cloud
```

`src/services/videoService.ts`

```ts
import { Router } from 'express'

export const videoRouter = Router()

// No arquivo real, esta função chama a Atlas Cloud com o modelo
// alibaba/wan-2.7/image-to-video e força vídeo de até 3 segundos, sem áudio.
async function generateVideoFromService(imageUrl: string, prompt: string) {
  return `https://.../video-gerado.mp4?image=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`
}

videoRouter.post('/', async (req, res) => {
  const { imageUrl, prompt = '' } = req.body ?? {}
  const videoUrl = await generateVideoFromService(String(imageUrl), String(prompt))
  res.json({ videoUrl, fromImage: imageUrl, mock: false })
})
```

Na demo com agentes, o caminho do vídeo também segue o desenho dos slides:

```text
Video Agent -> tool generate_video -> Video Service -> Atlas Cloud
```

`src/services/captionService.ts`

```ts
import { Router } from 'express'

export const captionRouter = Router()

function addCaptionFromService(videoUrl: string, text: string) {
  return { videoId: 'captioned-video', videoUrl, caption: text, mock: false }
}

captionRouter.post('/', (req, res) => {
  const { videoUrl, text = 'Vestido Aurora' } = req.body ?? {}
  res.json(addCaptionFromService(String(videoUrl), String(text)))
})
```

> **Pergunta para quem assiste:** "quem decide que a ordem é Imagem → Vídeo → Legenda?"
> Resposta: **o desenvolvedor**. Ainda não há nenhum agente.

## 2. O workflow (automação)

`src/workflow.ts`

```ts
export async function runFullWorkflow(prompt: string) {
  const imageUrl = await generateImageFromService(prompt)
  const videoUrl = await generateVideoFromService(imageUrl, 'Movimento suave de câmera para campanha premium do Vestido Aurora.')
  const caption = addCaptionFromService(videoUrl, 'Vestido Aurora')
  return {
    image: { imageUrl, prompt, mock: false },
    video: { videoUrl, fromImage: imageUrl, mock: false },
    caption,
  }
}
```

> A intenção didática: mostrar o encadeamento fixo (igual aos slides), antes de qualquer
> decisão dinâmica. O `/workflow` agora chama os mesmos serviços reais/locais, mas a ordem
> continua hardcoded pelo desenvolvedor.

## 3. O servidor que junta tudo

`src/server.ts`

```ts
import 'dotenv/config'
import express from 'express'
import { imageRouter } from './services/imageService.js'
import { videoRouter } from './services/videoService.js'
import { captionRouter } from './services/captionService.js'
import { runFullWorkflow } from './workflow.js'

const app = express()
app.use(express.json())

app.use('/images', imageRouter)
app.use('/videos', videoRouter)
app.use('/captions', captionRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.post('/workflow', async (req, res) => {
  res.json(await runFullWorkflow(req.body?.prompt ?? ''))
})

app.listen(8000, () => console.log('vestido-aurora ouvindo em :8000'))
```

> Em TS com `"module": "ESNext"`, imports locais levam a extensão `.js` (mesmo sendo `.ts`).

## 4. Rodar e testar

```bash
npm run dev
```

```bash
# pedido 1: "só uma imagem" — será que o workflow serve?
curl -X POST http://localhost:8000/images \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Vestido Aurora: vestido vermelho de seda para campanha premium"}'

# pedido 2: gerar vídeo a partir da imagem real
curl -X POST http://localhost:8000/videos \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"URL_DA_IMAGEM","prompt":"Movimento suave de câmera para campanha premium do Vestido Aurora"}'

# pedido 4: workflow completo
curl -X POST http://localhost:8000/workflow \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Crie um vídeo completo deste vestido"}'
```

**Momento didático:** mostre que o `/workflow` SEMPRE roda as três etapas — mesmo quando
o pedido seria "só uma imagem". É exatamente o problema do Ato 1 dos slides.

## 5. Checklist de conclusão

- [ ] `npm run dev` sobe e `/health` responde
- [ ] `/images` gera imagem real quando `ATLASCLOUD_API_KEY` está configurada
- [ ] `/videos` gera vídeo real quando recebe uma URL de imagem
- [ ] `/captions` aplica a legenda no retorno local
- [ ] `/workflow` encadeia imagem → vídeo → legenda chamando os services
- [ ] "quem decide a ordem? → o desenvolvedor"

**Próximo passo:** `04-llm-e-deepseek.md` (a LLM que "entende" o pedido).
