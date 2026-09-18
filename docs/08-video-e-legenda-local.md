# 08 · Passo a passo — vídeo real e legenda local

> Imagem e vídeo são gerados pela Atlas Cloud. A legenda é aplicada pelo `Caption Service`
> local no retorno da API, sem LLM e sem decisão dinâmica.

## 1. Vídeo real via Atlas Cloud

No `dispatch` do `registry.ts`, a tool `generate_video` chama o `Video Service`, que usa
o modelo `alibaba/wan-2.7/image-to-video`:

```ts
case 'generate_video':
  return {
    videoUrl: await generateVideoFromService(String(args.imageUrl ?? args.imageId), String(args.prompt ?? '')),
    mock: false,
  }
```

O caminho fica:

```text
Video Agent -> generate_video(imageUrl) -> Video Service -> Atlas Cloud
```

## 2. Legenda local

`add_caption` chama o `Caption Service` local:

```ts
case 'add_caption':
  return addCaptionFromService(String(args.videoUrl ?? args.videoId), String(args.text ?? 'Vestido Aurora'))
```

No fluxo de 5 agentes, o `Video Agent` gera o vídeo real e o `Caption Agent` fecha o
pipeline registrando a legenda no retorno do serviço.

## 3. Upgrade opcional da legenda

Com **ffmpeg** instalado na máquina (`brew install ffmpeg` no macOS), dá para baixar o
vídeo gerado pela Atlas Cloud e cravar a legenda por cima:

```bash
# baixa o vídeo gerado pela Atlas Cloud
curl -L -o aurora.mp4 "URL_DO_VIDEO"

# crava a legenda por cima
ffmpeg -y -i aurora.mp4 -vf \
  "drawtext=text='Vestido Aurora':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-160" \
  -pix_fmt yuv420p aurora-captioned.mp4
```

Em Node, chame o ffmpeg com `child_process.exec`/`spawn`:

```ts
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
const run = promisify(execFile)

export async function captionVideo(videoPath: string, out = 'aurora-captioned.mp4') {
  await run('ffmpeg', ['-y', '-i', videoPath,
    '-vf', "drawtext=text='Vestido Aurora':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-160",
    '-pix_fmt', 'yuv420p', out])
  return out
}
```

> Teste ANTES de apresentar. ffmpeg varia de máquina para máquina e é o ponto mais frágil
> do roteiro — por isso a legenda local é o padrão.

## 4. Checklist

- [ ] `generate_video` retorna uma URL real de vídeo da Atlas Cloud
- [ ] `add_caption` fecha o pipeline com legenda no retorno local
- [ ] (opcional) teste do ffmpeg feito antes de apresentar para legenda real

**Próximo passo:** `09-roteiro.md`.
