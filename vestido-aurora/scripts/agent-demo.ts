import 'dotenv/config'
import { runMultiAgent } from '../src/agent/multi.js'

const goal = process.argv[2] ?? 'Crie um vídeo para divulgar o Vestido Aurora.'

console.log('OBJETIVO:', goal)
await runMultiAgent(goal, (event) => {
  if (event.type === 'delegate') {
    console.log(`\nORCHESTRATOR -> ${event.specialist}: ${event.task}`)
    return
  }
  if (event.type === 'decision') {
    console.log(`${event.agent ?? 'AGENT'} decidiu chamar ${event.tool}`, event.args)
    return
  }
  if (event.type === 'tool-result') {
    console.log(`${event.agent ?? 'AGENT'} recebeu resultado de ${event.tool}`, event.result)
    return
  }
  if (event.type === 'done') {
    console.log('\nRESPOSTA FINAL:\n', event.answer)
    return
  }
  if (event.type === 'say') console.log(`${event.agent ?? 'AGENT'}: ${event.text}`)
})
