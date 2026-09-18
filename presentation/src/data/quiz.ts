import { palette } from '../theme'

export interface WhoDoesTask {
  task: string
  options: { label: string; color: string }[]
  answerIndex: number
  why: string
}

export const whoDoesTasks: WhoDoesTask[] = [
  {
    task: 'Encontrar o público do Vestido Aurora.',
    options: [
      { label: 'RAG', color: palette.rag },
      { label: 'Agent', color: palette.agent },
      { label: 'Image Service', color: palette.ms },
    ],
    answerIndex: 0,
    why: 'Recuperar conhecimento relevante é trabalho de RAG.',
  },
  {
    task: 'Escolher se precisamos gerar imagem ou vídeo.',
    options: [
      { label: 'RAG', color: palette.rag },
      { label: 'Agent', color: palette.agent },
      { label: 'Image Service', color: palette.ms },
    ],
    answerIndex: 1,
    why: 'Decidir qual capacidade usar é trabalho de Agent.',
  },
  {
    task: 'Gerar os pixels da imagem.',
    options: [
      { label: 'RAG', color: palette.rag },
      { label: 'Agent', color: palette.agent },
      { label: 'Image Service', color: palette.ms },
    ],
    answerIndex: 2,
    why: 'Quem executa a geração é o microsserviço.',
  },
  {
    task: 'Conectar o Agent ao Image Service.',
    options: [
      { label: 'RAG', color: palette.rag },
      { label: 'Agent', color: palette.agent },
      { label: 'Tool', color: palette.tool },
    ],
    answerIndex: 2,
    why: 'A ponte entre decisão e execução é a Tool.',
  },
]

export interface UseCase {
  title: string
  options: string[]
  answer: string
  why: string
}

export const useCases: UseCase[] = [
  {
    title: 'Quero resumir um texto que acabei de enviar.',
    options: ['RAG', 'LLM', 'Agent', 'Multi-Agent'],
    answer: 'LLM',
    why: 'Não há busca externa nem decisão complexa: a LLM resolve.',
  },
  {
    title: 'Quero fazer perguntas sobre 50 mil documentos internos.',
    options: ['LLM', 'Workflow', 'RAG', 'Agent'],
    answer: 'RAG',
    why: 'Precisamos recuperar conhecimento relevante antes de responder.',
  },
  {
    title: 'Meu processo sempre executa A → B → C.',
    options: ['Agent', 'Multi-Agent', 'Workflow', 'RAG'],
    answer: 'Workflow',
    why: 'O caminho é fixo e predefinido: não existe decisão dinâmica.',
  },
  {
    title: 'Dependendo do pedido, preciso escolher uma entre várias ferramentas.',
    options: ['Workflow', 'RAG', 'Tool', 'Agent'],
    answer: 'Agent',
    why: 'Existe decisão em tempo real sobre qual ferramenta usar.',
  },
  {
    title: 'Tenho várias áreas complexas, cada uma com regras, contexto e ferramentas diferentes.',
    options: ['Agent único', 'Multi-Agent', 'Workflow', 'LLM'],
    answer: 'Multi-Agent',
    why: 'Especializar e coordenar agentes fica mais claro nesse cenário.',
  },
]

export interface Myth {
  text: string
  truth: boolean
  why: string
}

export const myths: Myth[] = [
  { text: 'Image Service é um Agent.', truth: false, why: 'É um microsserviço: executa uma capacidade bem definida.' },
  { text: 'Image Agent pode utilizar Image Service.', truth: true, why: 'O Agent decide usar a tool, que chama o serviço real.' },
  { text: 'RAG é um Agent.', truth: false, why: 'RAG é um processo de recuperação de conhecimento.' },
  { text: 'Agent pode utilizar RAG.', truth: true, why: 'RAG pode ser uma capacidade de conhecimento dentro de um Agent.' },
  { text: 'Todo microsserviço precisa de um Agent.', truth: false, why: 'Se o caminho é fixo, um workflow simples resolve.' },
  { text: 'Multi-Agent é simplesmente ter vários microsserviços.', truth: false, why: 'Multi-Agent é sobre decisão e coordenação entre agentes.' },
  { text: 'Se um workflow simples resolve o problema, talvez Agent seja desnecessário.', truth: true, why: 'Automação ≠ agente. Comece simples.' },
]

export const mythPalette = {
  true: { color: palette.good, label: 'VERDADE', glyph: '✓' },
  false: { color: palette.bad, label: 'MITO', glyph: '✕' },
}

export const matrixCols = ['LLM', 'RAG', 'WORKFLOW', 'AGENT', 'MULTI-AGENT']
export const matrixColColors = [palette.llm, palette.rag, palette.ms, palette.agent, palette.agent]

export interface MatrixRow {
  row: string
  cells: { value: string; example: string }[]
  isDim?: boolean
}

export const matrixRows: MatrixRow[] = [
  {
    row: 'Entende linguagem',
    cells: [
      { value: '✓✓', example: 'Responde “resuma isto” direto.' },
      { value: '○', example: 'Precisa de uma LLM por trás para entender.' },
      { value: '○', example: 'O fluxo decide, não a linguagem.' },
      { value: '✓✓', example: 'Usa LLM para interpretar o objetivo.' },
      { value: '✓', example: 'Cada agente entende a sua parte.' },
    ],
  },
  {
    row: 'Usa conhecimento privado',
    cells: [
      { value: '—', example: 'Só o que foi treinado.' },
      { value: '✓✓', example: 'Busca nos seus 50 mil documentos.' },
      { value: '—', example: 'Não busca nada sozinho.' },
      { value: '✓', example: 'Se tiver RAG como capacidade.' },
      { value: '✓✓', example: 'Knowledge Agent dedica a isso.' },
    ],
  },
  {
    row: 'Executa ferramentas',
    cells: [
      { value: '—', example: 'Só gera texto.' },
      { value: '—', example: 'Só recupera conhecimento.' },
      { value: '✓', example: 'Executa o caminho fixo.' },
      { value: '✓✓', example: 'Decide e chama tools.' },
      { value: '✓✓', example: 'Especialistas chamam tools.' },
    ],
  },
  {
    row: 'Decide dinamicamente',
    cells: [
      { value: '—', example: 'Nenhuma decisão de fluxo.' },
      { value: '—', example: 'A pergunta define a busca.' },
      { value: '—', example: 'O dev definiu tudo antes.' },
      { value: '✓✓', example: 'Escolhe tool conforme o pedido.' },
      { value: '✓✓', example: 'Orchestrator decide a delegação.' },
    ],
  },
  {
    row: 'Fluxo predefinido',
    cells: [
      { value: '—', example: 'Geração livre.' },
      { value: '○', example: 'busca → contexto → resposta.' },
      { value: '✓✓', example: 'A → B → C sempre.' },
      { value: '—', example: 'Caminho varia.' },
      { value: '—', example: 'Caminho varia e coordena.' },
    ],
  },
  {
    row: 'Delega para especialistas',
    cells: [
      { value: '—', example: 'Sem delegação.' },
      { value: '—', example: 'Sem delegação.' },
      { value: '—', example: 'Sem delegação.' },
      { value: '—', example: 'Faz sozinho ou repassa.' },
      { value: '✓✓', example: 'Orchestrator delega para agents.' },
    ],
  },
  {
    row: 'Complexidade',
    cells: [
      { value: 'baixa', example: 'Uma chamada.' },
      { value: 'média', example: 'Indexação + busca.' },
      { value: 'baixa', example: 'Orquestração fixa.' },
      { value: 'média', example: 'Loop decisão → tool.' },
      { value: 'alta', example: 'Coordenação entre agentes.' },
    ],
  },
  {
    row: 'Previsibilidade',
    cells: [
      { value: 'média', example: 'Resultado varia, formato não.' },
      { value: 'alta', example: 'Resposta fundamentada.' },
      { value: 'alta', example: 'Mesmo caminho sempre.' },
      { value: 'baixa', example: 'Caminho pode variar.' },
      { value: 'baixa', example: 'Mais pontos de variação.' },
    ],
  },
]

export interface EcosystemGroup {
  group: string
  color: string
  note: string
  items: { name: string; desc: string }[]
}

export const ecosystem: EcosystemGroup[] = [
  {
    group: 'LLMs',
    color: palette.llm,
    note: 'Qual LLM é melhor? Depende do caso de uso.',
    items: [
      { name: 'DeepSeek', desc: 'LLM usado pelos agentes desta demonstração.' },
      { name: 'OpenAI', desc: 'GPT — forte em conversa e tools.' },
      { name: 'Claude', desc: 'Ótimo em textos longos e instruções.' },
      { name: 'Gemini', desc: 'Integra bem com produtos Google.' },
      { name: 'Llama', desc: 'Aberto, roda onde você quiser.' },
      { name: 'Qwen', desc: 'Forte em múltiplos idiomas.' },
      { name: 'Mistral', desc: 'Eficiente e aberto.' },
    ],
  },
  {
    group: 'Orquestração RAG',
    color: palette.rag,
    note: 'LlamaIndex não é um Vector Database.',
    items: [
      { name: 'LlamaIndex', desc: 'Framework para conectar dados a LLMs.' },
      { name: 'LangChain', desc: 'Cadeias e integrações para LLMs.' },
    ],
  },
  {
    group: 'Vector Databases',
    color: palette.rag,
    note: 'Guardam embeddings para busca por similaridade.',
    items: [
      { name: 'Qdrant', desc: 'Vector DB open source.' },
      { name: 'Pinecone', desc: 'Vector DB gerenciado em nuvem.' },
      { name: 'Weaviate', desc: 'Vector DB com metadados ricos.' },
      { name: 'Milvus', desc: 'Escala para bilhões de vetores.' },
      { name: 'PostgreSQL + pgvector', desc: 'Vetores dentro do Postgres.' },
    ],
  },
  {
    group: 'Agent Frameworks',
    color: palette.agent,
    note: 'Cada um tem um modelo de coordenação.',
    items: [
      { name: 'OpenClaw', desc: 'Runtime de agentes extensível por skills.' },
      { name: 'LangGraph', desc: 'Agentes como grafos de estado.' },
      { name: 'OpenAI Agents SDK', desc: 'Agentes com handoffs simples.' },
      { name: 'CrewAI', desc: 'Times de agentes com papéis.' },
      { name: 'AutoGen', desc: 'Conversas entre agentes.' },
    ],
  },
]
