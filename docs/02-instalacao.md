# 02 · Instalação passo a passo (Node.js + TypeScript)

Tudo em **uma máquina** (a que será compartilhada na tela). Rode cada bloco e confira o
"sanity check" antes de seguir.

## 1. Node.js 20+

```bash
node --version   # precisa ser >= 20
npm --version
```

Se não tiver: baixe em nodejs.org (LTS) ou `brew install node` (macOS).

## 2. Criar o projeto

```bash
mkdir vestido-aurora
cd vestido-aurora
npm init -y
```

Ajuste o `package.json` para `"type": "module"` e adicione os scripts:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "start": "tsx src/server.ts"
  }
}
```

## 3. Dependências

```bash
npm install express openai @huggingface/transformers dotenv
npm install -D typescript tsx @types/express @types/node
```

- `express` → API HTTP (os "microsserviços")
- `openai` → cliente OpenAI-compatível (funciona com a DeepSeek)
- `@huggingface/transformers` → embeddings locais em Node (ONNX)
- `dotenv` → carregar `.env`
- `tsx` → rodar TypeScript sem build

### `tsconfig.json` mínimo

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src"]
}
```

## 4. Sanity check 1 — o servidor sobe

Crie `src/server.ts` mínimo (só para testar):

```ts
import express from 'express'

const app = express()
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(8000, () => console.log('vestido-aurora ouvindo em :8000'))
```

```bash
npm run dev
curl http://localhost:8000/health
# {"status":"ok"}
```

## 5. Sanity check 2 — DeepSeek responde

Teste direto com `curl` (coloque a chave):

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer SEU_DEEPSEEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Diga oi em uma frase"}]}'
```

Espere um JSON com `choices[0].message.content`.

## 6. Sanity check 3 — embedding local funciona (transformers.js)

```bash
node -e "
import('@huggingface/transformers').then(async (t) => {
  const extractor = await t.pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
  const out = await extractor('vestido elegante', { pooling: 'mean', normalize: true });
  console.log('dims:', out.dims);            // [1, 384]
});
"
```

> O `@huggingface/transformers` baixa o modelo na primeira execução (algumas centenas de
> MB) e depois usa cache local. Sem PyTorch — bem mais leve que o equivalente em Python.

## 7. Sanity check 4 — Atlas Cloud gera imagem

```bash
curl -X POST https://api.atlascloud.ai/api/v1/model/generateImage \
  -H "Authorization: Bearer SEU_ATLASCLOUD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"alibaba/wan-2.7-pro/image-edit","prompt":"Vestido Aurora: vestido vermelho de seda, elegante, campanha premium"}'
```

Anote o `data.id` e depois consulte:

```bash
curl https://api.atlascloud.ai/api/v1/model/prediction/SEU_ID \
  -H "Authorization: Bearer SEU_ATLASCLOUD_API_KEY"
```

Quando `status == "completed"`, `data.outputs[0]` é a URL da imagem.

## 7.1. Sanity check 5 — Atlas Cloud gera vídeo

Depois de obter uma URL de imagem, teste o modelo image-to-video:

```bash
curl -X POST https://api.atlascloud.ai/api/v1/model/generateVideo \
  -H "Authorization: Bearer SEU_ATLASCLOUD_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"alibaba/wan-2.7/image-to-video","imageUrl":"URL_DA_IMAGEM","prompt":"Movimento suave de câmera para campanha premium do Vestido Aurora. Vídeo de no máximo 3 segundos, sem áudio."}'
```

Anote o `data.id` e consulte `/prediction/SEU_ID` como no teste de imagem. Quando
`status == "completed"`, `data.outputs[0]` é a URL do vídeo.

## 8. Arquivo `.env`

Crie o `.env` na raiz (não versionar!) com placeholders:

```
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

ATLASCLOUD_API_KEY=apikey-...
ATLASCLOUD_BASE_URL=https://api.atlascloud.ai/api/v1/model
VIDEO_MODEL=alibaba/wan-2.7/image-to-video
```

E um `.gitignore` com ao menos:

```
.env
node_modules/
dist/
```

**Pronto para a base do projeto → siga para `03-base-do-projeto.md`.**
