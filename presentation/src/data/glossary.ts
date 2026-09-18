import { palette } from '../theme'

export interface GlossaryTerm {
  term: string
  color: string
  oque: string
  para: string
  exemplo: string
}

export const glossary: GlossaryTerm[] = [
  { term: 'LLM', color: palette.llm, oque: 'Um modelo de linguagem treinado em muito texto.', para: 'Entender linguagem e gerar conteúdo.', exemplo: 'No nosso sistema, interpreta “crie um vídeo do Vestido Aurora”.' },
  { term: 'RAG', color: palette.rag, oque: 'Um processo que recupera conhecimento antes de responder.', para: 'Dar à LLM o contexto que ela não tem de fábrica.', exemplo: 'Buscar o público do Vestido Aurora nos 50 mil documentos.' },
  { term: 'Chunk', color: palette.rag, oque: 'Um trecho de um documento maior.', para: 'Ser recuperado de forma granular.', exemplo: 'products.pdf dividido em Chunk #01, #02…' },
  { term: 'Embedding', color: palette.rag, oque: 'Números que representam o significado de um texto.', para: 'Comparar sentido por similaridade.', exemplo: '“vestido elegante” → vetor com centenas de dimensões.' },
  { term: 'Vector', color: palette.rag, oque: 'Uma lista de números (o embedding).', para: 'Representar significado em espaço numérico.', exemplo: '[0.21, -0.83, 0.47, 0.12, …]' },
  { term: 'Vector Database', color: palette.rag, oque: 'Um banco que guarda vetores e busca por similaridade.', para: 'Encontrar trechos relevantes rápido.', exemplo: 'Guarda os chunks com seus embeddings e metadados.' },
  { term: 'Busca Semântica', color: palette.rag, oque: 'Buscar pelo significado, não só pela palavra exata.', para: '“roupa elegante” encontrar “vestido sofisticado”.', exemplo: 'Consultas e chunks próximos no espaço vetorial.' },
  { term: 'Similarity', color: palette.rag, oque: 'Quão próximos dois vetores estão.', para: 'Rankear resultados relevantes.', exemplo: 'Chunk #17 com 0.94 de similaridade.' },
  { term: 'Top-K', color: palette.rag, oque: 'Quantos resultados a busca devolve.', para: 'Controlar quanto contexto a LLM recebe.', exemplo: 'Top-K 3 → os três chunks mais próximos.' },
  { term: 'Tool', color: palette.tool, oque: 'Uma capacidade que disponibilizamos para a IA usar.', para: 'Conectar decisão à ação real.', exemplo: 'generate_image(prompt) → POST /images.' },
  { term: 'Function Calling', color: palette.tool, oque: 'O mecanismo da LLM para pedir a execução de uma função.', para: 'A LLM declara qual tool quer chamar.', exemplo: 'A LLM pede generate_video com argumentos preenchidos.' },
  { term: 'Agent', color: palette.agent, oque: 'Uma entidade que interpreta um objetivo e decide ações.', para: 'Escolher ferramentas conforme o pedido.', exemplo: 'Image Agent decide usar generate_image.' },
  { term: 'State', color: palette.agent, oque: 'O estado atual da execução.', para: 'Decidir o próximo passo.', exemplo: '“Já tenho IMG-8472, agora preciso do vídeo.”' },
  { term: 'Memory', color: palette.agent, oque: 'Informações acumuladas ao longo da tarefa.', para: 'Manter contexto entre etapas.', exemplo: 'Lembrar que a marca pede tom elegante.' },
  { term: 'Orchestrator', color: palette.agent, oque: 'Um agente que coordena outros.', para: 'Decidir quem faz cada parte.', exemplo: 'Orchestrator delega para Knowledge e Image Agents.' },
  { term: 'Handoff', color: palette.agent, oque: 'Passar a execução de um agente para outro.', para: 'Entregar a tarefa ao especialista certo.', exemplo: 'Orchestrator → Video Agent.' },
  { term: 'Multi-Agent', color: palette.agent, oque: 'Vários agentes especializados que cooperam.', para: 'Dividir responsabilidades complexas.', exemplo: 'Orchestrator + Knowledge + Image + Video + Caption.' },
  { term: 'Microsserviço', color: palette.ms, oque: 'Um serviço que executa uma capacidade bem definida.', para: 'Executar trabalho real.', exemplo: 'Image Service realmente gera a imagem.' },
  { term: 'Kafka', color: palette.kafka, oque: 'Plataforma de mensageria e event streaming.', para: 'Transportar eventos entre serviços.', exemplo: 'image.generated trafega por um tópico.' },
  { term: 'Evento', color: palette.kafka, oque: 'Um registro de que algo aconteceu.', para: 'Comunicar mudanças entre sistemas.', exemplo: 'image.generated com payload do imageId.' },
]
