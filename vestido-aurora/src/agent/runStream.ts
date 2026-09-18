import { type MultiEvent, runMultiAgent } from './multi.js'

export type AgentEvent = MultiEvent

export async function* runAgentEvents(goal: string, maxSteps = 10): AsyncGenerator<AgentEvent> {
  const queue: AgentEvent[] = []
  let finished = false
  let failure: Error | null = null

  const running = runMultiAgent(
    goal,
    (event) => queue.push(event),
    maxSteps,
  )
    .catch((err: unknown) => {
      failure = err instanceof Error ? err : new Error(String(err))
    })
    .finally(() => {
      finished = true
    })

  while (!finished || queue.length > 0) {
    const event = queue.shift()
    if (event) {
      yield event
      continue
    }
    await new Promise((resolve) => setTimeout(resolve, 25))
  }

  await running
  if (failure) throw failure
}
