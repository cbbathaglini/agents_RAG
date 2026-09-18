/* Demo ao vivo: conecta nos endpoints SSE do backend e renderiza os eventos. */

const $ = (sel) => document.querySelector(sel)

const AGENT_PRESETS = [
  'Crie um vídeo para divulgar o Vestido Aurora',
  'Gere apenas uma imagem do Vestido Aurora',
  'Anime esta imagem',
  'Coloque legenda neste vídeo',
  'Crie tudo a partir desta descrição: vestido de seda vermelho para um evento formal',
]

const RAG_PRESETS = [
  'Qual é o público do Vestido Aurora?',
  'Quero uma roupa elegante para um evento formal',
  'O que o guia de comunicação fala sobre gírias?',
  'Descreva o tom da marca',
]

const SERVICE_PRESETS = [
  { label: 'health check', action: 'health', value: '' },
  { label: 'POST /images', action: 'images', value: 'Vestido Aurora: vestido vermelho de seda para campanha premium' },
  { label: 'POST /workflow', action: 'workflow', value: 'Crie um vídeo completo do Vestido Aurora' },
]

let mode = 'agent'
let serviceAction = 'workflow'
let es = null
let running = false

const logEl = $('#log')
const outEl = $('#output')
const mediaEl = $('#result-media')
const textEl = $('#result-text')
const statusEl = $('#status')
const runBtn = $('#run')
const stopBtn = $('#stop')
const goalEl = $('#goal')
const presetsEl = $('#presets')
const ragLabEl = $('#rag-lab')

// parâmetros do laboratório RAG
const lab = {
  size: $('#lab-size'),
  overlap: $('#lab-overlap'),
  topk: $('#lab-topk'),
  thr: $('#lab-thr'),
}
const labVal = (sel) => Number($(sel).value)
const syncLabLabels = () => {
  $('#v-size').textContent = lab.size.value
  $('#v-overlap').textContent = lab.overlap.value
  $('#v-topk').textContent = lab.topk.value
  $('#v-thr').textContent = Number(lab.thr.value).toFixed(2)
}
;['size', 'overlap', 'topk', 'thr'].forEach((k) => (lab[k].addEventListener('input', syncLabLabels)))
$('#lab-reset').onclick = () => {
  lab.size.value = 16
  lab.overlap.value = 3
  lab.topk.value = 6
  lab.thr.value = 0
  syncLabLabels()
}
syncLabLabels()

function renderPresets() {
  presetsEl.innerHTML = ''
  if (mode === 'service') {
    SERVICE_PRESETS.forEach((p) => {
      const b = document.createElement('button')
      b.className = serviceAction === p.action ? 'preset on' : 'preset'
      b.textContent = p.label
      b.onclick = () => {
        serviceAction = p.action
        goalEl.value = p.value
        goalEl.focus()
        renderPresets()
      }
      presetsEl.appendChild(b)
    })
    ragLabEl.classList.add('hidden')
    goalEl.placeholder = 'Sem IA: escolha um endpoint e informe o prompt/URL quando necessário'
    return
  }

  const list = mode === 'agent' ? AGENT_PRESETS : RAG_PRESETS
  list.forEach((p) => {
    const b = document.createElement('button')
    b.className = 'preset'
    b.textContent = p
    b.onclick = () => { goalEl.value = p; goalEl.focus() }
    presetsEl.appendChild(b)
  })
  ragLabEl.classList.toggle('hidden', mode !== 'rag')
  goalEl.placeholder = mode === 'agent'
    ? 'ex.: Crie um vídeo para divulgar o Vestido Aurora'
    : 'ex.: Qual é o público do Vestido Aurora?'
}
renderPresets()

document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('on'))
    btn.classList.add('on')
    mode = btn.dataset.mode
    goalEl.value = ''
    renderPresets()
    goalEl.focus()
  }
})

/* ---------- log helpers ---------- */

function evEl(cls) {
  const div = document.createElement('div')
  div.className = `ev ${cls}`
  return div
}

function actor(label, colorClass) {
  const a = document.createElement('div')
  a.className = 'ev-actor'
  a.textContent = label
  return a
}

function addLog(node) {
  logEl.appendChild(node)
  logEl.scrollTop = logEl.scrollHeight
}

function reset() {
  logEl.innerHTML = ''
  mediaEl.innerHTML = '<div class="placeholder">A imagem/vídeo gerado aparece aqui.</div>'
  textEl.innerHTML = '<div class="placeholder-text">Escolha um objetivo ou pergunta e clique em Executar.<br />A resposta em texto aparece aqui.</div>'
  rawText = ''
}

/* ---------- output helpers ---------- */

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderInline(s) {
  s = escapeHtml(s)
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>')
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<i>$2</i>')
  return s
}

function renderMarkdown(text) {
  const lines = text.split('\n')
  let out = ''
  let inList = null
  const closeList = () => {
    if (inList) { out += `</${inList}>`; inList = null }
  }
  for (const line0 of lines) {
    const line = line0.trim()
    if (!line) { closeList(); continue }
    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      closeList()
      const level = Math.min(h[1].length + 1, 5)
      out += `<h${level}>${renderInline(h[2])}</h${level}>`
      continue
    }
    const ul = line.match(/^[-*]\s+(.*)$/)
    if (ul) {
      if (inList !== 'ul') { closeList(); out += '<ul>' }
      out += `<li>${renderInline(ul[1])}</li>`
      inList = 'ul'
      continue
    }
    const ol = line.match(/^\d+[.)]\s+(.*)$/)
    if (ol) {
      if (inList !== 'ol') { closeList(); out += '<ol>' }
      out += `<li>${renderInline(ol[1])}</li>`
      inList = 'ol'
      continue
    }
    closeList()
    out += `<p>${renderInline(line)}</p>`
  }
  closeList()
  return out
}

let rawText = ''

function ensureAnswerArea() {
  const ph = textEl.querySelector('.placeholder-text')
  if (ph) ph.remove()
  let block = textEl.querySelector('.answer-block')
  if (!block) {
    block = document.createElement('div')
    block.className = 'answer-block'
    const ans = document.createElement('div')
    ans.className = 'answer'
    block.appendChild(ans)
    textEl.appendChild(block)
  }
  const ans = block.querySelector('.answer')
  if (!ans.querySelector('.caret')) {
    const caret = document.createElement('span')
    caret.className = 'caret'
    caret.textContent = '▌'
    ans.appendChild(caret)
  }
  return ans
}

function appendText(delta) {
  rawText += delta
  const ans = ensureAnswerArea()
  const caret = ans.querySelector('.caret')
  ans.insertBefore(document.createTextNode(delta), caret)
}

function finishAnswer() {
  const trimmed = rawText.trim()
  const block = textEl.querySelector('.answer-block')
  if (!block) return
  const ans = block.querySelector('.answer')
  if (ans) ans.innerHTML = trimmed ? renderMarkdown(trimmed) : ''
}

function showImage(url) {
  const ph = mediaEl.querySelector('.placeholder')
  if (ph) ph.remove()
  const prev = mediaEl.querySelector('.imgstatus')
  if (prev) prev.remove()
  const box = document.createElement('div')
  box.className = 'imgbox'
  const img = document.createElement('img')
  img.src = url
  img.alt = 'Imagem gerada do Vestido Aurora'
  // evita que o provider bloqueie por Referer do localhost
  img.referrerPolicy = 'no-referrer'
  // se ainda assim falhar, baixa a imagem via proxy do backend
  img.onerror = () => {
    if (img.dataset.usedProxy) {
      img.remove()
      const link = document.createElement('a')
      link.className = 'pill'
      link.href = url
      link.target = '_blank'
      link.rel = 'noreferrer'
      link.textContent = 'Abrir imagem gerada em nova aba ↗'
      box.appendChild(link)
    } else {
      img.dataset.usedProxy = '1'
      img.src = '/api/image-proxy?url=' + encodeURIComponent(url)
    }
  }
  box.appendChild(img)
  mediaEl.appendChild(box)
}

function showVideo(url) {
  const ph = mediaEl.querySelector('.placeholder')
  if (ph) ph.remove()
  const box = document.createElement('div')
  box.className = 'imgbox'
  const video = document.createElement('video')
  video.src = url
  video.controls = true
  video.muted = true
  video.playsInline = true
  video.style.width = '100%'
  box.appendChild(video)
  const link = document.createElement('a')
  link.className = 'pill'
  link.href = url
  link.target = '_blank'
  link.rel = 'noreferrer'
  link.textContent = 'Abrir vídeo em nova aba ↗'
  box.appendChild(link)
  mediaEl.appendChild(box)
}

function showJsonResult(data) {
  if (data.imageUrl) showImage(data.imageUrl)
  if (data.videoUrl) showVideo(data.videoUrl)
  if (data.image?.imageUrl) showImage(data.image.imageUrl)
  if (data.video?.videoUrl) showVideo(data.video.videoUrl)
  const pre = document.createElement('pre')
  pre.className = 'answer'
  pre.textContent = JSON.stringify(data, null, 2)
  textEl.appendChild(pre)
}

/* ---------- event handlers ---------- */

const handlers = {
  say(e) {
    const n = evEl('say')
    n.textContent = (e.agent ? `[${e.agent}] ` : '') + e.text
    addLog(n)
  },
  delegate(e) {
    const n = evEl('decision')
    n.appendChild(actor(`ORCHESTRATOR · delegou`))
    const labels = {
      knowledge: 'Knowledge Agent',
      image: 'Image Agent',
      video: 'Video Agent',
      caption: 'Caption Agent',
    }
    const fn = document.createElement('div')
    fn.className = 'fn'
    fn.textContent = `→ ${labels[e.specialist] ?? e.specialist}`
    const args = document.createElement('div')
    args.className = 'args'
    args.textContent = e.task ?? ''
    n.appendChild(fn); n.appendChild(args)
    addLog(n)
  },
  decision(e) {
    const n = evEl('decision')
    n.appendChild(actor(`${(e.agent ?? 'AGENT')} · decisão`))
    const fn = document.createElement('div')
    fn.className = 'fn'
    fn.textContent = `chamar ${e.tool}()`
    const args = document.createElement('div')
    args.className = 'args'
    args.textContent = JSON.stringify(e.args ?? {})
    n.appendChild(fn); n.appendChild(args)
    addLog(n)
  },
  'embedding'(e) {
    const n = evEl('rag')
    n.appendChild(actor(`${e.agent ?? 'RAG'} · embedding da pergunta`))
    const q = document.createElement('div')
    q.className = 'preview'
    q.textContent = `“${e.question}”`
    n.appendChild(q)

    // barras ilustrativas a partir dos primeiros valores do vetor
    const bars = document.createElement('div')
    bars.className = 'vec-bars'
    const vals = e.values ?? []
    for (let i = 0; i < 24; i++) {
      const v = vals[i % vals.length] ?? 0
      const bar = document.createElement('i')
      bar.style.height = `${6 + Math.abs(v) * 130}px`
      bar.style.background = v >= 0 ? '#58a6ff' : '#3ecf8e'
      bar.style.opacity = 0.55 + Math.abs(v) * 0.8
      bars.appendChild(bar)
    }
    const wrap = document.createElement('div')
    wrap.style.display = 'flex'
    wrap.style.alignItems = 'flex-end'
    wrap.style.height = '52px'
    wrap.appendChild(bars)
    n.appendChild(wrap)

    const meta = document.createElement('div')
    meta.className = 'preview mono'
    meta.style.fontSize = '12px'
    meta.style.color = 'var(--faint)'
    meta.textContent = `[${vals.join(', ')}] · ${e.dims} dimensões (mostrando as primeiras)`
    n.appendChild(meta)
    addLog(n)
  },
  chunking(e) {
    const n = evEl('rag')
    n.appendChild(actor(`${e.agent ?? 'RAG'} · chunking`))
    if (e.overlap > 0) {
      const ov = document.createElement('div')
      ov.className = 'preview'
      ov.style.color = 'var(--tool)'
      ov.textContent = `overlap ${e.overlap} palavras (texto repetido em amarelo)`
      n.appendChild(ov)
    }
    const wrap = document.createElement('div')
    ;(e.files ?? []).forEach((f) => {
      const head = document.createElement('div')
      head.className = 'filehead'
      head.innerHTML = `${f.file} → <b>${f.total} chunks</b>`
      wrap.appendChild(head)
      f.chunks.forEach((c, ci) => {
        const line = document.createElement('div')
        line.className = c.retrieved ? 'chunkline retr' : 'chunkline'
        let text = c.text
        if (e.overlap > 0 && ci > 0) {
          const words = text.split(' ')
          const ovCount = Math.min(e.overlap, words.length)
          const headWords = words.slice(0, ovCount).join(' ')
          const rest = words.slice(ovCount).join(' ')
          line.innerHTML = `${c.chunkId} <span class="ov">${headWords}</span> ${rest}`
        } else {
          line.textContent = `${c.chunkId} ${text}`
        }
        if (c.score != null) {
          const badge = document.createElement('span')
          badge.className = 'score-badge'
          const pct = (c.score * 100).toFixed(0)
          if (c.retrieved) {
            badge.className += ' score-hit'
            badge.textContent = `${c.score.toFixed(2)} (${pct}%)`
          } else {
            badge.textContent = c.score.toFixed(2)
          }
          line.appendChild(badge)
        }
        wrap.appendChild(line)
      })
    })
    n.appendChild(wrap)
    addLog(n)
  },
  'rag-retrieval'(e) {
    const n = evEl('rag')
    n.appendChild(actor(`${e.agent ?? 'RAG'} · busca por similaridade`))
    const q = document.createElement('div')
    q.className = 'preview'
    q.textContent = `“${e.question}”`
    const srcs = document.createElement('div')
    srcs.className = 'srcs'
    ;(e.sources ?? []).forEach((s) => {
      const chip = document.createElement('span')
      chip.className = s.inContext ? 'src' : 'src dim'
      chip.innerHTML = `${s.file} ${s.chunkId} · <b>${s.score}</b>${s.inContext ? '' : ' (fora do limiar)'}`
      srcs.appendChild(chip)
    })
    n.appendChild(q); n.appendChild(srcs)
    addLog(n)
  },
  'knowledge-answer'(e) {
    const n = evEl('know')
    n.appendChild(actor(`${e.agent ?? 'KNOWLEDGE'} · contexto recuperado`))
    const p = document.createElement('div')
    p.className = 'preview'
    p.textContent = e.preview + '…'
    n.appendChild(p)
    addLog(n)
  },
  image(e) {
    const phM = mediaEl.querySelector('.placeholder')
    if (phM) phM.remove()
    let statusElN = mediaEl.querySelector('.imgstatus')
    if (e.status === 'generating') {
      if (!statusElN) {
        const s = document.createElement('div')
        s.className = 'imgstatus'
        s.textContent = 'Image Agent está gerando a imagem…'
        mediaEl.appendChild(s)
      }
      const n = evEl('img')
      n.appendChild(actor(`${e.agent ?? 'IMAGE AGENT'} · executando`))
      const p = document.createElement('div')
      p.className = 'preview'
      p.textContent = 'gerando imagem na paleta da marca (Atlas Cloud)…'
      n.appendChild(p)
      addLog(n)
    } else if (e.status === 'done') {
      if (statusElN) statusElN.remove()
      showImage(e.url)
      const n = evEl('img')
      n.appendChild(actor(`${e.agent ?? 'IMAGE AGENT'} · resultado`))
      const p = document.createElement('div')
      p.className = 'preview'
      p.textContent = 'imagem pronta!'
      n.appendChild(p)
      addLog(n)
    } else {
      if (statusElN) statusElN.textContent = 'erro ao gerar: ' + (e.message ?? '')
      const n = evEl('error')
      n.appendChild(actor('erro'))
      const p = document.createElement('div')
      p.textContent = e.message ?? 'falha na geração'
      n.appendChild(p)
      addLog(n)
    }
  },
  'tool-result'(e) {
    if (e.result?.imageUrl) showImage(e.result.imageUrl)
    if (e.result?.videoUrl) showVideo(e.result.videoUrl)
    const n = evEl('result')
    n.appendChild(actor(`${e.agent ?? 'SERVIÇO'} · executou`))
    const p = document.createElement('div')
    p.className = 'preview mono'
    p.textContent = `${e.tool} → ${JSON.stringify(e.result)}`
    n.appendChild(p)
    addLog(n)
  },
  text(e) {
    appendText(e.delta)
  },
  done() {
    finishAnswer()
  },
  close() {
    finishAnswer()
    finish()
  },
  error(e) {
    const n = evEl('error')
    n.appendChild(actor('erro'))
    const p = document.createElement('div')
    p.textContent = e.message ?? 'erro desconhecido'
    n.appendChild(p)
    addLog(n)
    finish()
  },
}

function finish() {
  if (es) { es.close(); es = null }
  running = false
  runBtn.disabled = false
  stopBtn.classList.add('hidden')
  runBtn.textContent = 'Executar'
  statusEl.classList.remove('busy')
  statusEl.textContent = 'concluído'
}

async function startService() {
  const value = goalEl.value.trim()
  reset()
  running = true
  runBtn.disabled = true
  stopBtn.classList.remove('hidden')
  statusEl.textContent = 'executando HTTP...'
  statusEl.classList.add('busy')

  const n = evEl('result')
  n.appendChild(actor(`SEM IA · ${serviceAction}`))
  const p = document.createElement('div')
  p.className = 'preview mono'
  n.appendChild(p)
  addLog(n)

  try {
    let response
    if (serviceAction === 'health') {
      p.textContent = 'GET /health'
      response = await fetch('/health')
    } else if (serviceAction === 'images') {
      p.textContent = 'POST /images'
      response = await fetch('/images', jsonPost({ prompt: value }))
    } else if (serviceAction === 'videos') {
      p.textContent = 'POST /videos'
      response = await fetch('/videos', jsonPost({ imageUrl: value, prompt: 'Movimento suave de câmera para campanha premium do Vestido Aurora' }))
    } else if (serviceAction === 'captions') {
      p.textContent = 'POST /captions'
      response = await fetch('/captions', jsonPost({ videoUrl: value, text: 'Vestido Aurora' }))
    } else {
      p.textContent = 'POST /workflow'
      response = await fetch('/workflow', jsonPost({ prompt: value }))
    }
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`)
    showJsonResult(data)
  } catch (err) {
    handlers.error({ message: err.message ?? String(err) })
    return
  }
  finish()
}

function jsonPost(body) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

function start() {
  if (mode === 'service') {
    startService()
    return
  }
  const goal = goalEl.value.trim()
  if (!goal) { goalEl.focus(); return }
  reset()
  running = true
  runBtn.disabled = true
  stopBtn.classList.remove('hidden')
  statusEl.textContent = 'executando…'
  statusEl.classList.add('busy')

  const endpoint = mode === 'agent' ? '/api/agent' : '/api/rag'
  let url
  if (mode === 'agent') {
    url = `${endpoint}?goal=${encodeURIComponent(goal)}`
  } else {
    const params = new URLSearchParams({
      q: goal,
      chunkSize: lab.size.value,
      overlap: lab.overlap.value,
      topK: lab.topk.value,
      threshold: lab.thr.value,
    })
    url = `${endpoint}?${params.toString()}`
  }

  es = new EventSource(url)
  es.addEventListener('rag-retrieval', (ev) => handlers['rag-retrieval'](JSON.parse(ev.data)))
  es.addEventListener('embedding', (ev) => handlers.embedding(JSON.parse(ev.data)))
  es.addEventListener('chunking', (ev) => handlers.chunking(JSON.parse(ev.data)))
  es.addEventListener('knowledge-answer', (ev) => handlers['knowledge-answer'](JSON.parse(ev.data)))
  es.addEventListener('decision', (ev) => handlers.decision(JSON.parse(ev.data)))
  es.addEventListener('delegate', (ev) => handlers.delegate(JSON.parse(ev.data)))
  es.addEventListener('say', (ev) => handlers.say(JSON.parse(ev.data)))
  es.addEventListener('image', (ev) => handlers.image(JSON.parse(ev.data)))
  es.addEventListener('tool-result', (ev) => handlers['tool-result'](JSON.parse(ev.data)))
  es.addEventListener('text', (ev) => handlers.text(JSON.parse(ev.data)))
  es.addEventListener('done', (ev) => handlers.done(JSON.parse(ev.data)))
  es.addEventListener('close', () => handlers.close())
  es.addEventListener('error', (ev) => {
    // EventSource emite "error" também quando o servidor encerra; só tratamos se ainda ativo
    if (running) handlers.error({ message: 'conexão interrompida' })
  })
  es.onerror = () => { /* mantido pelo listener acima */ }
}

runBtn.onclick = start
stopBtn.onclick = finish
goalEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') start() })
goalEl.value = AGENT_PRESETS[0]
