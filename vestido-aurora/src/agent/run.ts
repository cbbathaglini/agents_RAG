import { runMultiAgent } from './multi.js'

export async function runAgent(goal: string, maxSteps = 10): Promise<string> {
  let answer = ''
  await runMultiAgent(
    goal,
    (event) => {
      if (event.type === 'done') answer = event.answer
    },
    maxSteps,
  )
  return answer || 'Fluxo multi-agent finalizado sem resposta textual.'
}
