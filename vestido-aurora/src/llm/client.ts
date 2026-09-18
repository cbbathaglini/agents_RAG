import OpenAI from 'openai'

export function getClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL ?? 'https://api.deepseek.com',
  })
}

export function chat(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[],
) {
  return getClient().chat.completions.create({
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    messages,
    ...(tools ? { tools, tool_choice: 'auto' as const } : {}),
  })
}

/** Chama a LLM em modo streaming e devolve o texto completo. */
export async function chatStream(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  onToken?: (delta: string) => void,
): Promise<string> {
  const stream = await getClient().chat.completions.create({
    model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
    messages,
    stream: true,
  })
  let full = ''
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content
    if (delta) {
      full += delta
      onToken?.(delta)
    }
  }
  return full
}
