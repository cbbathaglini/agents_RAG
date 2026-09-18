import 'dotenv/config'
import { chat } from '../src/llm/client.js'

const goal = process.argv[2] ?? 'Crie apenas uma imagem do Vestido Aurora.'

const resp = await chat([{ role: 'user', content: goal }])
console.log('\nUSUÁRIO:', goal)
console.log('LLM    :', resp.choices[0].message.content)
