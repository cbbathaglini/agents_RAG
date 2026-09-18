# Plano da Apresentação — "Do dado à decisão"

> RAG · Agentes de IA · Sistemas Multiagentes — experiência web imersiva para alunos de computação.
> Baseado no briefing de `agentsrag.md` e construído com a skill **immersive-presentations** (+ `gsap-motion`).

## Promessa narrativa

Ao final, o aluno saberá *quem conhece, quem decide, quem executa e quem coordena* em um sistema de IA
porque a experiência **cresce um mesmo cenário simples** (3 microsserviços) até multi-agentes + Kafka,
mostrando a necessidade antes do nome de cada conceito.

## Audiência e formato

- **Audiência:** alunos de computação, em reunião online (compartilhamento de tela).
- **Formato:** palco de 1920×1080 redimensionado para qualquer tela; desktop-first; apresentado ao vivo.
- **Controle:** passo a passo (espaço/setas), notas do apresentador (N), autoplay, debug e glosário.
- **Idioma:** português do Brasil (termos técnicos mantidos como LLM, RAG, chunk, embedding etc.).
- **Tensão central:** entender ≠ executar ≠ coordenar. "Saber não é fazer".

## Cores com significado consistente

| Conceito | Cor | Papel |
| --- | --- | --- |
| LLM | violeta `#9b8cff` | entende linguagem |
| RAG / conhecimento | azul `#58a6ff` | recupera contexto |
| Agents | verde `#3ecf8e` | decidem |
| Tools | âmbar `#f2b33d` | ponte decisão→ação |
| Microsserviços | cinza `#c7cdd8` | executam |
| Kafka / eventos | laranja `#ff8a4c` | transportam |

Metáfora central repetida ao final: **CONHECER · DECIDIR · AGIR · COORDENAR · EVENTOS**.

## Objetos persistentes

Os 3 microsserviços (Image/Video/Caption) nunca somem; reaparecem como "executores reais".
O Vector DB, as tools e os agentes nascem de necessidades e passam a ocupar camadas fixas na arquitetura final.

## Estrutura de atos e cenas (48 cenas)

| Atos | Cenas | Ideia |
| --- | --- | --- |
| Capa | s00 | gancho: "do dado à decisão" |
| 1 · Primeiro, não tem IA | s01–s04 | microsserviços + workflow; automação ≠ agente |
| 2 · A LLM entende | s05–s05b | entende linguagem, mas não acessa nada sozinha |
| 3 · Como a IA acessa conhecimento? | s06–s13b | docs → chunk → embeddings → Vector DB → busca → RAG completo (+ Chunking Lab, mapa 2D) |
| 4 · Saber não é fazer | s14–s19 | tools, Tool Inspector, definição de Agent, experimento, Workflow × Agent |
| 5 · RAG + Agent | s20 | AGENT ≠ RAG, mas AGENT PODE USAR RAG |
| 6 · Um agente começa a crescer | s21–s30b | monólito → especialistas → multi-agent → trace → dados/decisões/raio-x |
| 7 · E onde entra o Kafka? | s31–s32 | eventos, infra toggle, arquitetura em camadas |
| Síntese | s33–s39 | jogos "quem faz o quê", "o que usar", mito ou verdade, ecossistema, matriz, glossário, mapa mental e encerramento |

## Mecânica de cada cena

- Cada cena = `id`, `act`, título curto, `steps` e notas (`data/notes.ts`).
- Conteúdo guiado por **passos**: cada pressionar de espaço revela um novo beat; ao esgotar, muda de cena.
- Cenas altas reframeiam a "câmera" (substituição) em vez de empilhar; diagramas ganham espaço.
- Labs (Chunking, Embeddings 2D, Top-K/threshold, Trace, lentes) são interativos e determinísticos — sem API externa.

## Simulação

Dados centralizados em `src/data/*`: serviços/tools/agentes/cenários (`executeScenario` implícito nas cenas s29–s30)
são determinísticos. Não há chamadas a LLM reais; o "Agente pensando" exibe apenas **estado observável** (decisão/ação/observação), nunca chain-of-thought.

## Presenter / Debug

- Teclado: `→`/espaço avança, `←` volta, `Home`/`End`, `F` tela cheia, `N` notas, `R` reinicia cena.
- Barra inferior com progresso (gradiente de cores dos conceitos) e navegação.
- Painel de notas por cena (atalho N) — nunca visível no modo normal.
- Debug: saltar para qualquer cena, reduzir movimento, safe-area, reiniciar.

## Acessibilidade e responsividade

- `prefers-reduced-motion` respeitado (todas as entradas viram cortes secos; loops desligam).
- Navegação 100% por teclado, foco visível, contraste alto, fontes grandes (projetor).
- Stage escalado via transform preserva composição; conteúdo em área segura central.

## Motion (GSAP)

- Entradas por classe CSS com curva suave; GSAP usado em: pacotes de eventos no Kafka,
  pulsos de loop do Agent, ciclos e foco — sempre com `gsap.context` + cleanup.
- Decisões de movimento delegadas ao skill `gsap-motion` (transform/opacity, reduced-motion).

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # build de produção
npm run preview  # visualizar o build
npm run lint     # eslint
npm run typecheck
```
