import { chat, getClient } from '../llm/client.js'
import { answerWithContext, ragLab, fmtSources, embedStats } from '../rag/pipeline.js'
import { MODEL_ID } from '../rag/embeddings.js'
import { addCaptionFromService } from '../services/captionService.js'
import { generateImage } from '../tools/imageTool.js'
import { generateVideoFromService } from '../services/videoService.js'
import type OpenAI from 'openai'

export type MultiEvent =
  | { type: 'say'; agent?: string; text: string }
  | { type: 'decision'; agent?: string; tool: string; args: Record<string, unknown> }
  | { type: 'embedding'; agent?: string; question: string; model: string; dims: number; values: number[] }
  | { type: 'chunking'; agent?: string; overlap: number; files: { file: string; total: number; chunks: { chunkId: string; text: string; retrieved: boolean }[] }[] }
  | { type: 'rag-retrieval'; agent?: string; question: string; sources: { file: string; chunkId: string; score: number }[] }
  | { type: 'knowledge-answer'; agent?: string; preview: string }
  | { type: 'image'; agent?: string; status: 'generating' | 'done' | 'error'; url?: string; message?: string }
  | { type: 'tool-result'; agent?: string; tool: string; result: Record<string, unknown> }
  | { type: 'text'; agent?: string; delta: string }
  | { type: 'done'; agent?: string; answer: string }
  | { type: 'delegate'; agent?: string; specialist: string; task: string }

type Emit = (e: MultiEvent) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMsg = any
const MODEL = () => process.env.DEEPSEEK_MODEL ?? 'deepseek-chat'

/* ---------------- tool schemas ---------------- */

const TOOL_FN = (
  name: string,
  desc: string,
  props: Record<string, unknown>,
): OpenAI.Chat.Completions.ChatCompletionTool => ({
  type: 'function',
  function: { name, description: desc, parameters: { type: 'object', properties: props } },
})

const tool = {
  delegate: TOOL_FN('delegate', 'Delega uma parte do trabalho para um agente especialista.', {
    specialist: {
      type: 'string',
      enum: ['knowledge', 'image', 'video', 'caption'],
      description: 'Qual especialista deve executar a tarefa.',
    },
    task: { type: 'string', description: 'O que o especialista deve fazer.' },
  }),
  searchKnowledge: TOOL_FN('search_knowledge', 'Busca conhecimento relevante nos documentos da marca.', {
    query: { type: 'string' },
  }),
  generateImage: TOOL_FN('generate_image', 'Gera uma imagem a partir de uma descrição (serviço real).', {
    prompt: { type: 'string' },
  }),
  generateVideo: TOOL_FN('generate_video', 'Transforma uma imagem em vídeo usando o Video Service.', {
    imageUrl: { type: 'string' },
    imageId: { type: 'string' },
    prompt: { type: 'string' },
  }),
  addCaption: TOOL_FN('add_caption', 'Adiciona legenda ao vídeo.', {
    videoId: { type: 'string' },
    videoUrl: { type: 'string' },
    text: { type: 'string' },
  }),
}

/* ---------------- especialistas ---------------- */

async function runSpecialist(
  name: string,
  system: string,
  task: string,
  tools: AnyMsg[],
  dispatch: (fn: string, args: Record<string, unknown>, emit: Emit) => Promise<string>,
  emit: Emit,
): Promise<string> {
  emit({ type: 'say', agent: name, text: `recebi a tarefa do Orchestrator.` })
  const messages: AnyMsg[] = [
    { role: 'system', content: system },
    { role: 'user', content: task },
  ]
  const resp = await chat(messages, tools)
  const msg = resp.choices[0].message as AnyMsg

  if (!msg.tool_calls) {
    return msg.content ?? `${name}: concluído sem chamadas de tool.`
  }

  messages.push({
    role: 'assistant',
    content: msg.content ?? '',
    tool_calls: msg.tool_calls.map((tc: AnyMsg) => ({
      id: tc.id,
      type: 'function',
      function: { name: tc.function.name, arguments: tc.function.arguments },
    })),
  })

  for (const call of msg.tool_calls) {
    const fn = call.function.name as string
    const args: Record<string, unknown> = JSON.parse(call.function.arguments ?? '{}')
    emit({ type: 'decision', agent: name, tool: fn, args })
    const result = await dispatch(fn, args, emit)
    emit({ type: 'tool-result', agent: name, tool: fn, result: JSON.parse(result) as Record<string, unknown> })
    messages.push({ role: 'tool', tool_call_id: call.id, content: result })
  }

  // Uma segunda passada curta para o especialista resumir o que fez
  const second = await chat(messages)
  return (second.choices[0].message.content ?? `${name}: concluído`).slice(0, 900)
}

const AGENTS = {
  knowledge: {
    system:
      'Você é o Knowledge Agent. Sua única responsabilidade é encontrar conhecimento ' +
      'correto nos documentos internos (produtos, tom da marca, identidade visual). ' +
      'Sempre use search_knowledge. Responda com base no contexto e cite as fontes.',
  },
  image: {
    system:
      'Você é o Image Agent. Sua responsabilidade é criar o prompt e chamar generate_image. ' +
      'Descreva cena, pose e ângulo. A paleta/estilo da marca é aplicada automaticamente; ' +
      'não repita cores no prompt. Responda o que gerou.',
  },
  video: {
    system:
      'Você é o Video Agent. Sua responsabilidade é chamar generate_video com o imageUrl recebido. ' +
      'Se receber apenas imageId, use imageId. Inclua um prompt curto descrevendo movimento elegante.',
  },
  caption: {
    system:
      'Você é o Caption Agent. Crie uma legenda curta e elegante para o vídeo (tom da marca) ' +
      'e chame add_caption com videoUrl ou videoId e o texto. Responda o que fez.',
  },
}

const AGENT_NAMES = [
  'Orchestrator Agent',
  'Knowledge Agent',
  'Image Agent',
  'Video Agent',
  'Caption Agent',
]

/* ---------------- Orchestrator ---------------- */

export async function runMultiAgent(
  goal: string,
  emit: Emit,
  maxSteps = 10,
): Promise<void> {
  const messages: AnyMsg[] = [
    {
      role: 'system',
      content:
        'Você é o Orchestrator Agent de um estúdio. Coordene agentes especialistas, NUNCA execute o trabalho sozinho. ' +
        'Especialistas disponíveis: knowledge (descobrir produto/tom/identidade nos documentos), ' +
        'image (gerar imagem de marketing), video (animar a imagem), caption (adicionar legenda). ' +
        'IMPORTANTE — executar APENAS o que o objetivo pede: se o usuário pedir só uma imagem, ' +
        'delegue apenas knowledge (se necessário) + image e finalize; NÃO anime a imagem nem adicione ' +
        'legenda nesse caso. Se pedir um vídeo, então sim anime a imagem. Se pedir "tudo"/"crie tudo", ' +
        'aí gere imagem + vídeo + legenda. Não invente etapas que o usuário não pediu e não repita o ' +
        'mesmo especialista sem necessidade. ' +
        'Comece delegando para knowledge quando precisar conhecer o produto. Não duplique buscas: ' +
        'use knowledge uma única vez e reaproveite. Delegue um especialista por vez e decida o próximo ' +
        'com base no resultado. Ao final, faça um resumo em português do que cada especialista fez.',
    },
    { role: 'user', content: goal },
  ]

  emit({ type: 'say', agent: 'ORCHESTRATOR', text: `objetivo recebido: “${goal}”` })
  emit({ type: 'say', agent: 'ORCHESTRATOR', text: `arquitetura ativa: ${AGENT_NAMES.join(' · ')}` })

  let knowledgeObservations: string[] = []
  let lastImageUrl: string | null = null

  // Salvaguarda determinística: se o objetivo pedir APENAS imagem e não mencionar
  // vídeo/animação/legenda, impede que o Orchestrator extrapole para esses ramos,
  // independentemente do que o LLM decidir.
  const goalLower = goal.toLowerCase()
  const wantsVideo =
    /vídeo|anima|video|anime|gera video|gerar video|motion|vídeo do|legenda/.test(goalLower) ||
    /crie tudo|inclua vídeo|imagem e vídeo/.test(goalLower)
  const wantsOnlyImage =
    /apenas imagem|só imagem|somente imagem|apenas uma imagem|gere uma imagem|gerar uma imagem|só uma imagem/.test(goalLower) &&
    !wantsVideo

  for (let step = 0; step < maxSteps; step++) {
    const resp = await getClient().chat.completions.create({
      model: MODEL(),
      messages,
      tools: [tool.delegate],
      tool_choice: 'auto',
    })
    const msg = resp.choices[0].message as AnyMsg

    if (!msg.tool_calls) {
      // Resposta final em streaming
      const stream = await getClient().chat.completions.create({
        model: MODEL(),
        messages,
        stream: true,
      })
      let full = ''
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) {
          full += delta
          emit({ type: 'text', agent: 'ORCHESTRATOR', delta })
        }
      }
      emit({ type: 'done', agent: 'ORCHESTRATOR', answer: full })
      return
    }

    messages.push({
      role: 'assistant',
      content: msg.content ?? '',
      tool_calls: msg.tool_calls.map((tc: AnyMsg) => ({
        id: tc.id,
        type: 'function',
        function: { name: tc.function.name, arguments: tc.function.arguments },
      })),
    })

    for (const call of msg.tool_calls) {
      const args: Record<string, unknown> = JSON.parse(call.function.arguments ?? '{}')
      const specialist = String(args.specialist ?? '')
      const task = String(args.task ?? '')
      emit({ type: 'delegate', agent: 'ORCHESTRATOR', specialist, task })

      const specialistEmit = (e: MultiEvent) =>
        emit({ ...e, agent: e.agent ?? `${specialist.toUpperCase()}-AGENT` })

      let observation: string
      try {
        if (specialist === 'knowledge') {
          if (knowledgeObservations.length > 0) {
            // Não duplica a busca: reaproveita o conhecimento já recuperado e
            // devolve ao Orchestrator sem executar search_knowledge de novo.
            emit({ type: 'say', agent: 'KNOWLEDGE-AGENT', text: 'conhecimento já recuperado na etapa anterior — reaproveitando (sem nova busca).' })
            observation = knowledgeObservations[knowledgeObservations.length - 1]
          } else {
            observation = await runSpecialist(
              'KNOWLEDGE-AGENT',
              AGENTS.knowledge.system,
              task,
              [tool.searchKnowledge],
              async (_fn, a) => {
                const question = String(a.query)
                const qs = await embedStats(question)
                specialistEmit({ type: 'embedding', agent: 'KNOWLEDGE', question, model: MODEL_ID, dims: qs.dims, values: qs.values })
                const { hits, chunking } = await ragLab(question, { topK: 6 })
                specialistEmit({ type: 'chunking', agent: 'KNOWLEDGE', overlap: chunking.overlap, files: chunking.files })
                specialistEmit({
                type: 'rag-retrieval',
                agent: 'KNOWLEDGE',
                question,
                // no fluxo do Agent não há threshold; todos os topK vão ao contexto
                sources: fmtSources(hits).map((h) => ({ ...h, inContext: true })),
              })
                const answer = await answerWithContext(question, hits)
                specialistEmit({ type: 'knowledge-answer', agent: 'KNOWLEDGE', preview: answer.slice(0, 260) })
                return JSON.stringify({ answer, sources: fmtSources(hits) })
              },
              specialistEmit,
            )
            knowledgeObservations.push(observation)
          }
        } else if (specialist === 'image') {
          observation = await runSpecialist(
            'IMAGE-AGENT',
            AGENTS.image.system,
            task,
            [tool.generateImage],
            async (_fn, a) => {
              try {
                const url = await generateImage(String(a.prompt))
                lastImageUrl = url
                specialistEmit({ type: 'image', agent: 'IMAGE SERVICE', status: 'done', url })
                return JSON.stringify({ imageUrl: url })
              } catch (err) {
                specialistEmit({ type: 'image', agent: 'IMAGE SERVICE', status: 'error', message: (err as Error).message })
                return JSON.stringify({ error: (err as Error).message })
              }
            },
            specialistEmit,
          )
        } else if (specialist === 'video') {
          if (wantsOnlyImage) {
            emit({ type: 'say', agent: 'ORCHESTRATOR', text: 'objetivo pede apenas imagem — ignorando vídeo (não extrapolar).' })
            observation = JSON.stringify({ skipped: true, reason: 'objetivo pede apenas imagem' })
          } else {
            // garante que o Video Agent receba o URL da imagem gerada mais recente
            const videoTask = lastImageUrl
              ? `${task}\nReferência da imagem gerada (imageUrl): ${lastImageUrl}`
              : task
            observation = await runSpecialist(
              'VIDEO-AGENT',
              AGENTS.video.system,
              videoTask,
              [tool.generateVideo],
              async (_fn, a) => {
                const videoUrl = await generateVideoFromService(
                  String(a.imageUrl ?? a.imageId ?? ''),
                  String(a.prompt ?? ''),
                )
                return JSON.stringify({ videoUrl, fromImage: a.imageUrl ?? a.imageId, mock: false })
              },
              specialistEmit,
            )
          }
        } else if (specialist === 'caption') {
          if (wantsOnlyImage) {
            emit({ type: 'say', agent: 'ORCHESTRATOR', text: 'objetivo pede apenas imagem — ignorando legenda (não extrapolar).' })
            observation = JSON.stringify({ skipped: true, reason: 'objetivo pede apenas imagem' })
          } else {
            observation = await runSpecialist(
              'CAPTION-AGENT',
              AGENTS.caption.system,
              task,
              [tool.addCaption],
              async (_fn, a) => {
                const result = addCaptionFromService(
                  String(a.videoUrl ?? a.videoId ?? ''),
                  String(a.text ?? 'Vestido Aurora'),
                )
                return JSON.stringify(result)
              },
              specialistEmit,
            )
          }
        } else {
          observation = JSON.stringify({ error: `Especialista desconhecido: ${specialist}` })
        }
      } catch (err) {
        observation = JSON.stringify({ error: (err as Error).message })
      }

      messages.push({ role: 'tool', tool_call_id: call.id, content: observation })
    }
  }
  emit({ type: 'done', answer: 'Limite de passos do Orchestrator atingido.' })
}
