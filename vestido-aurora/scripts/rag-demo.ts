import 'dotenv/config'
import { ask, setup } from '../src/rag/pipeline.js'

const question = process.argv[2] ?? 'Qual é o público do Vestido Aurora?'

console.log('Indexando documentos...')
await setup()
console.log('Pronto. Perguntando:', question)

const result = await ask(question, 3)
console.log('\nRESPOSTA:\n', result.answer)
console.log('\nFONTES:')
for (const s of result.sources) console.log('  -', s)
