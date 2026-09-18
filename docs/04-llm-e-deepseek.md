# 04 · Passo a passo — a LLM (DeepSeek) que "entende"

> **Corresponde ao Ato 2.** A LLM entende linguagem, mas ainda não chama nada. Nesta
> etapa provamos: entendeu o pedido ≠ executou o pedido.

## 1. Cliente OpenAI-compatível apontando para a DeepSeek

`src/llm/client.ts`

```ts
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com',
})

export function chat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[],
) {
  return client.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    messages,
    ...(tools ? { tools, tool_choice: 'auto' as const } : {}),
  })
}
```

O `server.ts` já faz `import 'dotenv/config'` — as chaves do `.env` ficam em
`process.env`.

## 2. Teste: a LLM entende

```ts
import { chat } from './src/llm/client.js'

const resp = await chat([
  { role: 'user', content: 'Crie apenas uma imagem do Vestido Aurora.' },
])
console.log(resp.choices[0].message.content)
```

Esperado: ela responde algo como "Entendi. Você quer gerar uma imagem."

> Use sempre **`deepseek-chat`**. O `deepseek-reasoner` não suporta tools/function calling.

## 3. A cena das "chamadas diretas bloqueadas"

Mostre que a LLM **não** sabe chamar nossos endpoints sozinha:

```ts
const resp = await chat([
  { role: 'user', content: 'Chame o nosso POST /images agora.' },
])
console.log(resp.choices[0].message.content)
```

Ela vai pedir URL, chave, dizer que não tem acesso... ou inventar. **Mensagem:** "a LLM
não ganha acesso aos nossos sistemas magicamente." Guarde isso para o Ato 4.

> Para rodar um script de teste avulso em TS: `npx tsx scripts/quick-test.ts`.

## 4. Checklist

- [ ] `.env` carregado e chave da DeepSeek presente
- [ ] chat responde em PT-BR
- [ ] a LLM confirma que entende os dois pedidos de exemplo
- [ ] mostramos que ela não executa nada sozinha

**Próximo passo:** gerar os documentos do Vestido Aurora
(`05-documentos-do-vestido-aurora.md`) antes de montar o RAG.
