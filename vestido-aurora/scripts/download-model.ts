import { downloadModel, MODEL_ID, cacheDir } from '../src/rag/embeddings.js'

const folder = await downloadModel()
console.log('Modelo de embeddings pronto.')
console.log('ID   :', MODEL_ID)
console.log('Cache:', folder ?? cacheDir)
console.log('Agora o RAG funciona offline (sem novo download).')
