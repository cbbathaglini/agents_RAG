# PROMPT — Apresentação Imersiva e Didática: RAG, Agentes de IA e Sistemas Multiagentes

Use obrigatoriamente a skill **immersive-presentations** para construir esta experiência.

Quero criar uma apresentação web totalmente interativa, em **PORTUGUÊS DO BRASIL**, para explicar de forma simples, visual, moderna e tecnicamente correta:

**RAG, Agentes de IA e Sistemas Multiagentes.**

Esta apresentação será conduzida ao vivo durante uma reunião online com alunos de computação.

O objetivo NÃO é impressionar os alunos com uma arquitetura complexa.

O objetivo é fazer com que eles pensem:

> “Ahhh, agora eu entendi.”

---

# REGRA MAIS IMPORTANTE DA APRESENTAÇÃO

A apresentação deve parecer uma **conversa guiada**, não uma documentação técnica.

Não quero textos como:

> “Retrieval-Augmented Generation is an architecture that combines retrieval mechanisms with generative language models.”

Quero textos naturais como:

> “Imagine que você faça uma pergunta para o ChatGPT sobre 50 mil documentos da sua empresa.  
> Como ele vai saber o que está dentro deles?”

Depois:

> “É aqui que entra o RAG.”

A apresentação deve usar constantemente perguntas como:

- “Mas como a IA encontra esse documento?”
- “Ela precisa ler os 50 mil arquivos toda vez?”
- “E se eu não quiser uma resposta, mas quiser que ela faça alguma coisa?”
- “Quem realmente gera a imagem?”
- “Então o microsserviço virou um agente?”
- “Precisamos mesmo de vários agentes?”
- “E onde entra o Kafka nisso tudo?”

Essa linguagem deve guiar toda a experiência.

---

# IDIOMA — REGRA ABSOLUTA

TODO O CONTEÚDO VISÍVEL PARA O ALUNO DEVE ESTAR EM PORTUGUÊS DO BRASIL.

Isso inclui:

- títulos;
- subtítulos;
- botões;
- explicações;
- perguntas;
- quizzes;
- tooltips;
- labels dos diagramas;
- mensagens da simulação;
- exemplos;
- notas visíveis;
- comparações;
- estados;
- timelines.

Termos técnicos podem permanecer em inglês quando forem normalmente utilizados dessa forma.

Exemplos permitidos:

LLM  
RAG  
Embedding  
Chunk  
Vector Database  
Tool  
Function Calling  
Agent  
Multi-Agent  
Workflow  
Kafka  
Event  
API

Mas a explicação ao redor deles deve estar em português.

Exemplo:

❌ “KNOWLEDGE AGENT retrieves relevant context.”

✅ “O Knowledge Agent procura as informações de que precisamos.”

---

# TOM DA APRESENTAÇÃO

A linguagem deve ser:

- natural;
- conversacional;
- simples;
- adulta;
- didática;
- tecnicamente correta;
- sem infantilização;
- sem linguagem acadêmica desnecessária;
- sem frases de marketing sobre IA.

Imagine uma desenvolvedora explicando isso para colegas ou alunos durante uma chamada de vídeo.

Use frases curtas.

Evite grandes blocos de texto.

Prefira:

**pergunta → animação → descoberta → explicação curta.**

---

# PRINCÍPIO PEDAGÓGICO

Não comece explicando definições.

Comece apresentando problemas.

A estrutura de aprendizado deve seguir:

PROBLEMA

↓

PERGUNTA

↓

EXPERIMENTO VISUAL

↓

DESCOBERTA

↓

NOME DO CONCEITO

Exemplo:

Em vez de começar:

> “RAG significa Retrieval-Augmented Generation.”

Começar com:

> “Tenho 50 mil documentos internos.  
> Quero perguntar alguma coisa sobre eles.”

Depois mostrar:

LLM

?

50.000 DOCUMENTOS

Pergunta:

> “A LLM precisa ler tudo toda vez?”

Depois construir a solução visualmente.

Só então revelar:

**RAG**

---

# NÃO QUERO UMA APRESENTAÇÃO TRADICIONAL

Não crie PowerPoint em HTML.

Não quero:

- slide com título + 6 bullets;
- cards genéricos;
- grids de cards;
- aparência de dashboard SaaS;
- componentes repetitivos;
- landing page;
- documentação técnica;
- diagramas gigantes apresentados de uma vez;
- texto demais;
- uma tela inteira cheia de caixinhas;
- interface com aparência padrão de React Flow.

Quero uma experiência que misture:

- storytelling;
- apresentação;
- simulação;
- laboratório;
- arquitetura animada;
- experimentação.

Cada cena deve ter uma **ideia principal**.

---

# CONCEITO VISUAL

Dark mode sofisticado.

Background quase preto.

Interface minimalista.

Tipografia editorial forte.

Elementos técnicos em monoespaçada.

Cores devem possuir significado consistente.

Sugestão:

LLM → violeta discreto  
RAG / conhecimento → azul  
Agents → verde  
Tools → amarelo/âmbar  
Microsserviços → cinza claro  
Kafka / Events → laranja

Não usar gradiente roxo/azul genérico de produto de IA.

Não exagerar no neon.

Não utilizar dezenas de bordas arredondadas.

Diagramas devem ocupar o espaço como parte principal da narrativa.

---

# METÁFORA CENTRAL DA APRESENTAÇÃO

Durante toda a apresentação, repetir visualmente quatro ideias:

**CONHECER**

O que o sistema sabe?

**DECIDIR**

Quem escolhe o que deve acontecer?

**AGIR**

Quem realmente executa?

**COORDENAR**

Quem organiza vários especialistas?

No final, conectar:

RAG → CONHECER

Agent → DECIDIR

Tool → CONECTAR DECISÃO À AÇÃO

Microsserviço → EXECUTAR

Multi-Agent → ESPECIALIZAR E COORDENAR

Kafka → TRANSPORTAR EVENTOS

---

# CENÁRIO ÚNICO

Toda a apresentação deve utilizar o mesmo cenário.

Temos um sistema que pode:

1. gerar uma imagem;
2. transformar essa imagem em vídeo;
3. colocar legenda no vídeo.

Existem EXATAMENTE três microsserviços.

---

## IMAGE SERVICE

API:

POST /images

Tool possível:

generate_image(prompt)

Responsabilidade:

gerar uma imagem.

---

## VIDEO SERVICE

API:

POST /videos

Tool possível:

generate_video(image_id, prompt)

Responsabilidade:

transformar uma imagem em vídeo.

---

## CAPTION SERVICE

API:

POST /captions

Tool possível:

add_caption(video_id, text)

Responsabilidade:

adicionar legenda ao vídeo.

---

NÃO inventar outros microsserviços.

Não criar:

publish()

quality_review()

notification_service

social_media_service

email_service

ou qualquer outra capability.

O cenário deve permanecer pequeno para que a arquitetura seja compreensível.

---

# STORYTELLING DA APRESENTAÇÃO

A apresentação não deve começar por RAG.

Ela deve começar pelo sistema mais simples possível e crescer junto com a necessidade.

A história é:

“Temos três serviços.”

↓

“Conseguimos montar um fluxo.”

↓

“Mas agora os pedidos dos usuários variam.”

↓

“Uma LLM entende o pedido.”

↓

“Mas entender não significa saber tudo.”

↓

“Então damos conhecimento com RAG.”

↓

“Mas saber não significa conseguir agir.”

↓

“Então damos Tools.”

↓

“Agora podemos criar um Agent.”

↓

“Mas precisamos mesmo de Agent?”

↓

“Quando o sistema cresce, podemos especializar.”

↓

“Surge o Multi-Agent.”

↓

“E os microsserviços e Kafka continuam existindo normalmente.”

Essa evolução deve ser o eixo central da apresentação.

---

# ATO 1 — PRIMEIRO, NÃO TEM IA

## CENA 01 — Uma pergunta simples

Tela praticamente vazia.

Mostrar:

> “Antes de falar de IA, vamos construir um sistema.”

Depois aparecem três nomes:

Imagem

Vídeo

Legenda

Animar a transformação:

DESCRIÇÃO

↓

IMAGEM

↓

VÍDEO

↓

VÍDEO COM LEGENDA

Pergunta ao aluno:

> “Precisamos de IA para coordenar isso?”

Pausa.

Resposta:

> “Não necessariamente.”

---

# CENA 02 — Os três microsserviços

Apresentar lentamente:

Image Service

↓

Video Service

↓

Caption Service

Evitar mostrar muita informação inicialmente.

Clique em Image Service:

> “Esse serviço sabe fazer uma coisa: gerar imagens.”

Mostrar:

POST /images

Entrada:

{
  "prompt": "Mulher usando um vestido vermelho"
}

Saída:

{
  "imageId": "IMG-8472"
}

Depois equivalente para Video Service e Caption Service.

Mensagem importante:

> “Microsserviço é software especializado.  
> Isso ainda não é um agente.”

---

# CENA 03 — Um workflow tradicional

Usuário solicita:

> “Crie um vídeo completo deste vestido.”

Executar visualmente:

Image Service

↓

IMG-8472

↓

Video Service

↓

VID-9321

↓

Caption Service

↓

VID-9321-CAPTIONED

Mostrar uma linha de código conceitual:

generateImage()

↓

generateVideo()

↓

addCaption()

Pergunta:

> “Quem decidiu essa ordem?”

Destacar:

**O DESENVOLVEDOR.**

Explicação:

> “Nós programamos previamente que o fluxo seria sempre Imagem → Vídeo → Legenda.”

Grande conclusão:

**AUTOMAÇÃO NÃO É A MESMA COISA QUE AGENTE.**

---

# CENA 04 — Agora aparece um problema

Mostrar quatro pedidos enviados por usuários.

Pedido 1:

> “Gere apenas uma imagem.”

Pedido 2:

> “Anime esta imagem.”

Pedido 3:

> “Coloque legenda neste vídeo.”

Pedido 4:

> “Crie tudo a partir desta descrição.”

A cada pedido, mostrar o workflow fixo tentando executar:

IMAGE → VIDEO → CAPTION

No primeiro pedido, destacar Video e Caption como desnecessários.

Pergunta:

> “Será que precisamos executar sempre as mesmas etapas?”

Resposta:

> “Agora surgiu uma decisão.”

Essa deve ser a primeira pista do conceito de Agent.

Mas ainda NÃO apresentar Agent.

---

# ATO 2 — A LLM ENTENDE

# CENA 05 — O que a LLM faz?

Mostrar conversa.

USUÁRIO:

> “Crie apenas uma imagem do Vestido Aurora.”

LLM:

> “Entendi. Você quer gerar uma imagem.”

Depois:

USUÁRIO:

> “Transforme esta imagem em vídeo.”

LLM:

> “Entendi. Você quer gerar um vídeo.”

Explicação:

> “Uma LLM é muito boa em interpretar linguagem e gerar conteúdo.”

Agora mostrar:

LLM

X → Image Service

LLM

X → Video Service

LLM

X → Caption Service

Pergunta:

> “Mas entender o pedido significa conseguir executá-lo?”

Grande resposta:

**NÃO.**

Complemento:

> “A LLM não ganha acesso aos nossos sistemas magicamente.”

---

# PRIMEIRA PAUSA CONCEITUAL

Criar uma pequena tela chamada:

**ATÉ AQUI**

Mostrar:

LLM

✅ entende linguagem

✅ gera texto

❌ não conhece automaticamente nossos dados internos

❌ não possui automaticamente acesso aos nossos serviços

Esse formato de pausa deve aparecer outras vezes na apresentação.

---

# ATO 3 — COMO A IA ACESSA CONHECIMENTO?

# CENA 06 — O problema dos 50 mil documentos

Mudar completamente o cenário visual.

Mostrar uma pequena pergunta:

> “Imagine agora que temos 50 mil documentos internos.”

Os documentos começam a aparecer ao fundo.

Exemplos:

products.pdf  
brand-guide.pdf  
campaigns.pdf  
communication-guide.pdf  
produto-001.pdf  
produto-002.pdf  
...

Depois:

USUÁRIO:

> “Qual é o público do Vestido Aurora?”

Mostrar:

LLM

↓

?

↓

50.000 documentos

Pergunta:

> “Como a LLM sabe em qual documento procurar?”

Depois:

> “Mandamos os 50 mil documentos para a LLM a cada pergunta?”

Resposta visual:

**Não seria uma boa ideia.**

Agora apresentar:

**RAG**

Subtítulo:

> “Antes de responder, procuramos apenas as informações relevantes.”

---

# CENA 07 — Um documento de verdade

Abrir visualmente:

products.pdf

Conteúdo:

Produto: Vestido Aurora

Cor: vermelho

Material: seda

Público: 25–40 anos

Posicionamento: elegante e sofisticado

Depois:

brand-guide.pdf

Tom da marca:

Elegante, próximo e moderno.

Evitar:

Gírias excessivas.

Priorizar:

Minimalismo, sofisticação e clareza.

Pergunta:

> “Como transformamos documentos desse tipo em algo pesquisável semanticamente?”

---

# CENA 08 — Chunking

Não começar pela definição.

Mostrar um documento grande entrando na tela.

Pergunta:

> “Precisamos recuperar o documento inteiro?”

Animar o documento sendo cortado.

Mostrar pedaços.

CHUNK 01  
CHUNK 02  
CHUNK 03  
CHUNK 04

Explicação:

> “Dividimos documentos grandes em pedaços menores.”

Depois revelar o termo:

**CHUNK**

Definição curta:

> “Um chunk é apenas um trecho do conteúdo que poderá ser recuperado depois.”

---

# CHUNKING LAB

Criar controle:

Tamanho do chunk

100 ───────────── 1000

Sobreposição

0 ───────────── 300

Mostrar o texto sendo dividido ao vivo.

Quando aumentar overlap, destacar visualmente o texto repetido entre dois chunks.

Pergunta contextual:

> “Por que repetir uma parte?”

Tooltip:

> “Para evitar perder contexto exatamente na divisão entre dois chunks.”

Evitar textos acadêmicos.

---

# CENA 09 — Mas como pesquisar significado?

Mostrar dois trechos.

Trecho A:

> “O Vestido Aurora possui posicionamento sofisticado.”

Consulta:

> “Quero uma roupa elegante.”

Pergunta:

> “As palavras são exatamente iguais?”

Não.

Depois:

> “Mas o significado é parecido.”

Introduzir:

**EMBEDDINGS**

---

# CENA 10 — Embeddings

Mensagem:

> “Embedding é uma forma de representar significado usando números.”

Mostrar:

“vestido elegante”

↓

[0.21, -0.83, 0.47, 0.12, ...]

Não explicar matemática profundamente.

Mostrar:

> “O vetor real pode possuir centenas ou milhares de dimensões.”

Depois:

> “Para enxergarmos isso, vamos simplificar para 2D.”

Criar mapa interativo.

Colocar próximos:

vestido elegante  
vestido sofisticado  
roupa social

Outro grupo:

gato  
cachorro

Outro:

Kafka  
mensageria  
event streaming

Outro:

PostgreSQL  
banco de dados

Permitir digitar uma frase.

A aplicação simula uma posição coerente.

Sempre mostrar:

**Visualização simplificada para fins didáticos.**

---

# CENA 11 — Vector Database

Agora vários chunks entram em:

VECTOR DATABASE

Explicação natural:

> “Precisamos guardar esses vetores em algum lugar para conseguir pesquisá-los rapidamente.”

Mostrar um registro conceitual:

VECTOR

METADATA

DOCUMENT

CHUNK

Pergunta:

> “Então RAG é um Vector Database?”

Resposta:

**NÃO.**

Mostrar:

RAG é o processo.

Vector Database é uma peça que pode fazer parte desse processo.

---

# CENA 12 — Vamos fazer uma busca

Pergunta:

> “Qual é o público do Vestido Aurora?”

Executar lentamente:

PERGUNTA

↓

EMBEDDING DA PERGUNTA

↓

BUSCA POR SIMILARIDADE

↓

VECTOR DATABASE

Resultados:

Chunk #17 — 0.94

> “Público: 25–40 anos...”

Chunk #03 — 0.81

> “Posicionamento elegante...”

Chunk #42 — 0.63

Criar controles:

Top-K: 1 / 3 / 5

Similarity threshold

Mostrar visualmente resultados entrando ou saindo do contexto.

---

# CENA 13 — RAG completo

Agora montar a arquitetura progressivamente.

Pergunta:

> “Qual é o público do Vestido Aurora?”

↓

buscar informações relevantes

↓

products.pdf / chunk #17

↓

enviar pergunta + contexto para a LLM

↓

resposta

LLM responde:

> “O Vestido Aurora é direcionado principalmente para pessoas entre 25 e 40 anos e possui um posicionamento elegante e sofisticado.”

Mostrar fonte:

products.pdf  
Chunk #17

Grande conclusão:

**RAG ajuda a IA a encontrar o que ela precisa saber.**

---

# PAUSA CONCEITUAL

Mostrar:

RAG

✅ recupera conhecimento relevante

✅ adiciona contexto à LLM

✅ pode trabalhar com dados privados

❌ não é um agente

❌ não executa automaticamente ações nos nossos serviços

---

# ATO 4 — SABER NÃO É FAZER

# CENA 14 — A transição mais importante

Dividir a tela.

Lado esquerdo:

> “Qual é o público do Vestido Aurora?”

RAG

↓

Resposta correta.

Lado direito:

> “Crie um vídeo do Vestido Aurora.”

RAG

↓

???

Congelar a tela.

Mostrar no centro:

**SABER ≠ FAZER**

Depois:

> “Agora não precisamos apenas de conhecimento.”

> “Precisamos executar ações.”

---

# CENA 15 — Tools

Mostrar três capacidades.

generate_image(prompt)

generate_video(image_id, prompt)

add_caption(video_id, text)

Animar cada uma conectando ao serviço real.

generate_image()

↓

POST /images

↓

Image Service

---

generate_video()

↓

POST /videos

↓

Video Service

---

add_caption()

↓

POST /captions

↓

Caption Service

Explicação:

> “Uma Tool é uma capacidade que disponibilizamos para a IA utilizar.”

Depois enfatizar:

> “A IA não gera a imagem magicamente.”

Mostrar em câmera lenta:

AGENT

↓

TOOL

↓

HTTP

↓

MICROSSERVIÇO

↓

RESULTADO

---

# TOOL INSPECTOR

Ao clicar em:

generate_image

mostrar:

O que faz?

> Gera uma imagem a partir de uma descrição.

Entrada:

{
  "prompt": "string"
}

Por baixo:

POST /images

Executado por:

Image Service

Mesmo formato para Video e Caption.

---

# CENA 16 — Então finalmente: o que é um Agent?

Evitar começar com definição formal.

Mostrar novamente os pedidos:

> “Gere uma imagem.”

> “Anime esta imagem.”

> “Adicione legenda.”

> “Faça tudo.”

Pergunta:

> “Quem escolhe qual ferramenta usar?”

Animar uma entidade entrando entre usuário e tools.

**AGENT**

Mostrar dentro dele apenas conceitualmente:

LLM

Instruções

Estado

Tools disponíveis

Mensagem:

> “O Agent usa uma LLM para interpretar o objetivo e decidir quais ações disponíveis devem ser executadas.”

---

# DEFINIÇÃO VISUAL DE AGENT

Construir:

USUÁRIO

↓

OBJETIVO

↓

AGENT

↓

DECIDE

↓

SELECIONA TOOL

↓

EXECUTA

↓

OBSERVA RESULTADO

↓

DECIDE O PRÓXIMO PASSO

Isso deve ser animado em loop curto.

---

# CENA 17 — Vamos ver um Agent trabalhando

Usuário:

> “Crie um vídeo completo do Vestido Aurora.”

Não mostrar chain-of-thought.

Mostrar apenas decisões operacionais.

OBJETIVO

Criar um vídeo completo.

DECISÃO

> “Primeiro preciso de uma imagem.”

AÇÃO

generate_image()

↓

Image Service

↓

IMG-8472

OBSERVAÇÃO

> “Imagem pronta.”

DECISÃO

> “Agora preciso transformá-la em vídeo.”

AÇÃO

generate_video(IMG-8472)

↓

Video Service

↓

VID-9321

OBSERVAÇÃO

> “Vídeo pronto.”

DECISÃO

> “Falta a legenda.”

AÇÃO

add_caption(VID-9321, "...")

↓

Caption Service

↓

VID-9321-CAPTIONED

RESULTADO

**Objetivo concluído.**

---

# CENA 18 — O experimento principal

Mostrar quatro botões grandes.

“Gere apenas uma imagem.”

“Anime esta imagem.”

“Adicione legenda.”

“Crie um vídeo completo.”

Quando o apresentador clicar, o Agent deve reconstruir o grafo de execução.

CASO 1

generate_image()

CASO 2

generate_video()

CASO 3

add_caption()

CASO 4

generate_image()

↓

generate_video()

↓

add_caption()

Mensagem:

> “O objetivo mudou.  
> O caminho também.”

---

# CENA 19 — Workflow ou Agent?

Dividir a tela em dois universos.

## WORKFLOW

Imagem

↓

Vídeo

↓

Legenda

Texto:

> “O caminho já foi definido pelo desenvolvedor.”

Características aparecendo:

mais previsível

mais simples

mais barato

mais fácil de observar

---

## AGENT

OBJETIVO

↓

DECISÃO

↓

TOOL

↓

RESULTADO

↓

NOVA DECISÃO

Texto:

> “O caminho depende do objetivo e do estado atual.”

Características:

mais flexível

decisões dinâmicas

maior complexidade

mais difícil de prever

---

Pergunta grande:

> “Se nosso sistema SEMPRE executa Imagem → Vídeo → Legenda... precisamos de Agent?”

Pausa dramática.

Resposta:

# PROVAVELMENTE NÃO.

Complemento:

> “Não use Agent só porque parece mais moderno.”

---

# ATO 5 — RAG + AGENT

# CENA 20 — Agora juntamos conhecimento e ação

Usuário:

> “Crie um vídeo para divulgar o Vestido Aurora.”

Agent:

> “Eu sei que preciso gerar conteúdo...”

Pausa.

> “Mas o que é o Vestido Aurora?”

Mostrar:

AGENT

↓

RAG

↓

Vector DB

↓

products.pdf

↓

contexto

Volta para Agent.

Depois:

Agent

↓

generate_image()

Mensagem:

> “O Agent pode usar RAG como uma capacidade de conhecimento.”

Grande destaque:

**AGENT ≠ RAG**

Depois:

**AGENT PODE USAR RAG.**

---

# ATO 6 — UM AGENTE COMEÇA A CRESCER

# CENA 21 — O Agent grandão

Mostrar um Agent central.

Dentro dele começam a aparecer:

RAG

generate_image

generate_video

add_caption

instruções de imagem

instruções de vídeo

instruções de legenda

regras da marca

estado

contexto

memória

Mostrar visualmente a entidade ficando mais complexa.

Pergunta:

> “Isso é necessariamente ruim?”

Resposta:

> “Não.”

Depois:

> “Mas dependendo do tamanho do problema, pode ficar difícil separar responsabilidades.”

---

# CENA 22 — Podemos criar especialistas

Fazer uma transformação visual.

O Agent central se divide em:

ORCHESTRATOR AGENT

KNOWLEDGE AGENT

IMAGE AGENT

VIDEO AGENT

CAPTION AGENT

Não mostrar tudo de uma vez.

Primeiro Orchestrator.

Depois Knowledge.

Depois Image.

Depois Video.

Depois Caption.

Mensagem:

> “Em vez de um agente conhecer todas as regras e ferramentas, podemos especializar responsabilidades.”

---

# CENA 23 — Mas cuidado

Pergunta:

> “Então cada microsserviço precisa virar um Agent?”

Grande resposta:

**NÃO.**

Mostrar:

IMAGE AGENT

↓

generate_image()

↓

IMAGE SERVICE

Explicação:

> “O Image Agent decide como utilizar a capacidade.”

> “O Image Service continua sendo o software que realmente gera a imagem.”

Comparação:

AGENT

interpreta contexto  
decide  
seleciona ações

MICROSSERVIÇO

executa uma capacidade bem definida

---

# CENA 24 — Orchestrator Agent

Mostrar somente:

USER

↓

ORCHESTRATOR

Disponíveis:

Knowledge Agent

Image Agent

Video Agent

Caption Agent

Pergunta:

> “O Orchestrator gera imagem?”

Não.

> “Gera vídeo?”

Não.

> “Coloca legenda?”

Não.

Então mostrar:

> “Ele coordena.”

Responsabilidades:

interpretar o objetivo

descobrir quais especialistas são necessários

delegar

receber resultados

decidir o próximo passo

manter o contexto da execução

---

# CENA 25 — Knowledge Agent

Mostrar:

ORCHESTRATOR

↓

KNOWLEDGE AGENT

↓

search_knowledge()

↓

RAG

↓

VECTOR DB

↓

DOCUMENTOS

Pergunta:

> “Knowledge Agent é o próprio RAG?”

Resposta:

**Não.**

Explicação:

> “RAG é o mecanismo usado por esse agente para encontrar conhecimento.”

---

# CENA 26 — Image Agent

ORCHESTRATOR

↓

IMAGE AGENT

↓

generate_image()

↓

Image Service

↓

IMG-8472

↓

IMAGE AGENT

↓

ORCHESTRATOR

Mostrar claramente o dado retornando.

---

# CENA 27 — Video Agent

ORCHESTRATOR

↓

VIDEO AGENT

↓

generate_video(IMG-8472)

↓

Video Service

↓

VID-9321

↓

ORCHESTRATOR

---

# CENA 28 — Caption Agent

ORCHESTRATOR

↓

CAPTION AGENT

↓

add_caption(VID-9321, texto)

↓

Caption Service

↓

VID-9321-CAPTIONED

↓

ORCHESTRATOR

---

# CENA 29 — Execução Multi-Agent completa

Essa deve ser uma das experiências mais impressionantes da apresentação.

Usuário:

> “Crie um vídeo de 15 segundos para divulgar o Vestido Aurora.”

Começar somente com:

USER

↓

ORCHESTRATOR

Depois executar devagar.

ETAPA 1

Orchestrator:

> “Preciso entender o produto e o tom da marca.”

↓

Knowledge Agent

↓

RAG

↓

Vector DB

Mostrar os documentos recuperados:

products.pdf

brand-guide.pdf

Retorno:

Vestido Aurora

cor: vermelho

material: seda

público: 25–40

tom: elegante e moderno

---

ETAPA 2

Orchestrator:

> “Agora tenho contexto suficiente para criar a imagem.”

↓

Image Agent

↓

generate_image()

↓

Image Service

↓

IMG-8472

---

ETAPA 3

Orchestrator:

> “A imagem está pronta. Agora precisamos animá-la.”

↓

Video Agent

↓

generate_video()

↓

Video Service

↓

VID-9321

---

ETAPA 4

Orchestrator:

> “O vídeo está pronto. Falta a legenda.”

↓

Caption Agent

↓

add_caption()

↓

Caption Service

↓

VID-9321-CAPTIONED

---

ETAPA 5

Resultado final.

Mostrar:

**OBJETIVO CONCLUÍDO**

---

# CENA 30 — TRACE

Transformar a execução anterior em uma visão parecida com distributed tracing.

Exemplo:

00:00 — USUÁRIO

Pedido recebido

00:01 — ORCHESTRATOR

Delegou → Knowledge Agent

00:02 — KNOWLEDGE AGENT

Executou → search_knowledge()

00:03 — RAG

3 chunks recuperados

00:04 — ORCHESTRATOR

Delegou → Image Agent

00:05 — IMAGE AGENT

Executou → generate_image()

00:08 — IMAGE SERVICE

IMG-8472 criado

00:09 — ORCHESTRATOR

Delegou → Video Agent

...

Permitir avançar evento por evento.

---

# FOLLOW THE DATA

Criar botão:

**SEGUIR OS DADOS**

Quando ativado, apagar visualmente os demais elementos e acompanhar apenas:

contexto do produto

↓

prompt da imagem

↓

IMG-8472

↓

VID-9321

↓

VID-9321-CAPTIONED

Mostrar uma etiqueta indicando o tipo do dado.

---

# FOLLOW THE DECISIONS

Criar botão:

**SEGUIR AS DECISÕES**

Agora apagar visualmente os dados e destacar:

Objetivo do usuário

↓

decisão do Orchestrator

↓

delegação

↓

Agent

↓

seleção da Tool

↓

observação

↓

próxima decisão

A ideia é permitir ao professor perguntar:

> “Percebem que decisão e dado não são a mesma coisa?”

---

# X-RAY MODE

Criar botão:

**RAIO-X DO SISTEMA**

Mostrar simultaneamente:

QUEM DECIDIU

Orchestrator

↓

PARA QUEM DELEGOU

Image Agent

↓

QUAL CAPACIDADE FOI ESCOLHIDA

generate_image()

↓

QUAL CHAMADA REAL ACONTECEU

POST /images

↓

QUEM EXECUTOU

Image Service

↓

O QUE RETORNOU

IMG-8472

Essa visualização é fundamental.

Ela deve tornar impossível sair da apresentação achando que Agent e Microsserviço são a mesma coisa.

---

# ATO 7 — E ONDE ENTRA O KAFKA?

# CENA 31 — Kafka

Primeiro mostrar:

Image Service

↓

Video Service

Perguntar:

> “Os serviços precisam conversar apenas por chamadas HTTP?”

Resposta:

> “Não.”

Introduzir Kafka.

Image Service

↓

evento

image.generated

↓

KAFKA

↓

consumer

Representar eventos como pequenos pacotes viajando.

Exemplo do pacote:

image.generated

{
  "imageId": "IMG-8472"
}

Mostrar outros eventos:

video.generated

caption.generated

---

# PERGUNTA IMPORTANTE

Tela limpa.

> “Kafka virou um Agent?”

Resposta grande:

# NÃO.

Depois:

> “Kafka é infraestrutura de mensageria e event streaming.”

Mostrar:

AGENT

decide

KAFKA

transporta eventos

MICROSSERVIÇO

executa

---

# INFRASTRUCTURE TOGGLE

Criar opção:

**MOSTRAR INFRAESTRUTURA**

Desligada:

USER

↓

AGENTS

↓

TOOLS

Ligada:

revelar por baixo:

HTTP

APIs

Microsserviços

Kafka

Events

Isso deve permitir explicar arquitetura em camadas sem mostrar tudo ao mesmo tempo.

---

# CENA 32 — Arquitetura completa

Agora, e somente agora, mostrar o sistema completo.

Separar fisicamente em camadas.

EXPERIÊNCIA

Usuário

────────────────────

DECISÃO

Orchestrator Agent

Knowledge Agent

Image Agent

Video Agent

Caption Agent

────────────────────

CONHECIMENTO

RAG

Embeddings

Vector Database

────────────────────

CAPACIDADES

search_knowledge()

generate_image()

generate_video()

add_caption()

────────────────────

APLICAÇÃO

Image Service

Video Service

Caption Service

────────────────────

INFRAESTRUTURA

Kafka

Mostrar cada camada entrando progressivamente.

Não mostrar tudo instantaneamente.

---

# CENA 33 — “Quem faz o quê?”

Criar um jogo visual.

Mostrar uma tarefa.

Exemplo:

> “Encontrar o público do Vestido Aurora.”

Aluno escolhe:

RAG

Agent

Kafka

Image Service

Resposta:

RAG.

---

> “Escolher se precisamos gerar imagem ou vídeo.”

Resposta:

Agent.

---

> “Gerar os pixels da imagem.”

Resposta:

Image Service.

---

> “Transportar image.generated.”

Resposta:

Kafka.

---

> “Conectar o Agent ao Image Service.”

Resposta:

Tool.

---

# CENA 34 — O que devo usar?

Criar um jogo.

CASO 1

> “Quero resumir um texto que acabei de enviar.”

Resposta:

LLM

---

CASO 2

> “Quero fazer perguntas sobre 50 mil documentos internos.”

Resposta:

RAG

---

CASO 3

> “Meu processo sempre executa A → B → C.”

Resposta:

WORKFLOW

---

CASO 4

> “Dependendo do pedido, preciso escolher uma entre várias ferramentas.”

Resposta:

AGENT

---

CASO 5

> “Tenho várias áreas complexas, cada uma com regras, contexto e ferramentas diferentes.”

Resposta:

MULTI-AGENT

Após responder, explicar em UMA frase o porquê.

---

# CENA 35 — MITO OU VERDADE

Criar quiz rápido.

“Kafka transforma microsserviços em agentes.”

❌ MITO

---

“Image Service é um Agent.”

❌ MITO

---

“Image Agent pode utilizar Image Service.”

✅ VERDADE

---

“RAG é um Agent.”

❌ MITO

---

“Agent pode utilizar RAG.”

✅ VERDADE

---

“Todo microsserviço precisa de um Agent.”

❌ MITO

---

“Multi-Agent é simplesmente ter vários microsserviços.”

❌ MITO

---

“Se um workflow simples resolve o problema, talvez Agent seja desnecessário.”

✅ VERDADE

---

# CENA 36 — ECOSSISTEMA REAL

Apenas depois de os conceitos estarem compreendidos, mostrar ferramentas reais.

Não transformar em catálogo enorme.

Mostrar por categoria.

LLMs:

OpenAI

Claude

Gemini

Llama

Qwen

Mistral

Pergunta:

> “Qual LLM é melhor?”

Resposta:

> “Depende do caso de uso.”

---

RAG / orchestration:

LlamaIndex

LangChain

Mensagem importante:

> “LlamaIndex não é um Vector Database.”

---

Vector Databases:

Qdrant

Pinecone

Weaviate

Milvus

PostgreSQL + pgvector

---

Agent Frameworks:

LangGraph

OpenAI Agents SDK

CrewAI

AutoGen

Explicar cada um em no máximo uma frase.

---

Observabilidade:

LangSmith

OpenTelemetry

Mensagem:

> “Sistemas agentic precisam ser observáveis como qualquer outro sistema distribuído.”

Não adicionar essas ferramentas à arquitetura fictícia principal.

---

# CENA 37 — COMPARAÇÃO FINAL

Criar matriz interativa:

                LLM   RAG   WORKFLOW   AGENT   MULTI-AGENT

Entende linguagem

Usa conhecimento privado

Executa ferramentas

Decide dinamicamente

Fluxo predefinido

Delega para especialistas

Complexidade

Previsibilidade

Não utilizar apenas checks.

Ao passar sobre cada célula, mostrar um exemplo.

---

# CENA 38 — O MAPA MENTAL FINAL

Voltar ao começo.

Mostrar apenas:

CONHECER

DECIDIR

AGIR

COORDENAR

Agora transformar:

CONHECER

↓

RAG

---

DECIDIR

↓

AGENT

---

AGIR

↓

TOOLS

↓

MICROSSERVIÇOS

---

COORDENAR

↓

MULTI-AGENT

---

EVENTOS

↓

KAFKA

---

# CENA FINAL

Tela quase vazia.

Mostrar primeiro:

**RAG ajuda a IA a encontrar o que ela precisa saber.**

Depois:

**Agents ajudam a decidir o que precisa acontecer.**

Depois:

**Tools conectam decisões às capacidades reais do sistema.**

Depois:

**Microsserviços continuam executando o trabalho.**

Depois:

**Multi-Agent divide responsabilidades quando a complexidade realmente exige.**

Depois:

**Kafka continua sendo infraestrutura.**

Pausa.

Mensagem final grande:

# USE A ARQUITETURA MAIS SIMPLES QUE RESOLVA O PROBLEMA.

---

# FRASES QUE DEVEM APARECER DURANTE A APRESENTAÇÃO

Utilize naturalmente estas frases em momentos apropriados:

“Entender não significa conseguir executar.”

“Saber não é fazer.”

“O Agent não ganha superpoderes.”

“Uma Tool é uma capacidade que disponibilizamos.”

“O Agent decide. O serviço executa.”

“RAG não é Agent.”

“Kafka não é Agent.”

“Microsserviço não é Agent.”

“Multi-Agent não significa vários microsserviços.”

“Nem todo problema precisa de Agent.”

“Nem todo Agent precisa fazer tudo.”

“Comece simples. Adicione inteligência onde existe uma decisão de verdade.”

---

# NOTAS PARA O APRESENTADOR

Cada cena deve possuir `talkingPoints`.

As notas devem ser escritas como lembretes naturais.

Exemplo:

Cena: Tools

Talking points:

- aqui é importante separar Agent de serviço;
- o Agent não sabe chamar nossas APIs sozinho;
- precisamos disponibilizar tools;
- por baixo da tool pode existir REST, gRPC, Kafka ou outra integração;
- no nosso exemplo estamos simplificando para REST.

Essas notas nunca aparecem para os alunos no modo normal.

---

# INTERAÇÃO DA APRESENTAÇÃO

Suportar:

→ próxima cena

← cena anterior

Space → avançar

F → fullscreen

ESC → sair

Também criar controles discretos:

Anterior

Próximo

Reiniciar cena

Auto Play

Pausar

Mostrar infraestrutura

Seguir dados

Seguir decisões

Raio-X

Notas do apresentador

Os controles devem desaparecer quando não estiverem sendo utilizados.

---

# ANIMAÇÕES

Utilizar GSAP extensivamente.

Mas cada animação deve possuir significado.

Exemplos:

um chunk sendo separado do documento;

um vetor entrando no banco;

uma query percorrendo o Vector DB;

chunks relevantes sendo puxados para o contexto;

uma tool sendo selecionada;

uma chamada atravessando até o microsserviço;

um resultado retornando;

um Agent delegando para outro;

um evento atravessando Kafka;

uma arquitetura simples crescendo progressivamente.

Não utilizar:

animações aleatórias;

parallax decorativo;

elementos flutuantes;

efeito 3D sem função didática.

---

# TRANSIÇÕES ENTRE CONCEITOS

As transições devem carregar significado.

Exemplo:

RAG → AGENT

A arquitetura RAG não deve desaparecer.

Ela deve se mover visualmente e passar a ocupar uma posição dentro das capacidades que o Agent pode utilizar.

Agent → Multi-Agent

O Agent original deve se expandir e depois se separar visualmente em especialistas.

Microsserviços → Multi-Agent

Os microsserviços NÃO devem virar Agents.

Os Agents devem aparecer ACIMA deles.

Isso é extremamente importante.

---

# SIMULATION ENGINE

Separar a apresentação da simulação.

Criar estrutura semelhante a:

executeScenario("full-video")

Produz:

[
  {
    actor: "orchestrator",
    action: "delegate",
    target: "knowledge-agent"
  },
  {
    actor: "knowledge-agent",
    action: "search-knowledge"
  },
  {
    actor: "rag",
    action: "retrieve",
    result: ["chunk-17", "chunk-03"]
  }
]

A interface interpreta esses eventos.

Todos os cenários devem ser determinísticos.

Não chamar APIs externas.

---

# EVITAR CHAIN-OF-THOUGHT

Nunca mostrar raciocínio interno detalhado de LLMs.

Representar apenas estados observáveis.

Permitido:

DECISÃO

> “Preciso de informações sobre o produto.”

AÇÃO

> `search_knowledge()`

OBSERVAÇÃO

> “3 trechos relevantes recuperados.”

PRÓXIMA AÇÃO

> “Delegar criação visual.”

Nunca mostrar raciocínio interno detalhado.

---

# DESIGN DO CÓDIGO

Preferência:

React

TypeScript

Vite ou Next.js

GSAP

React Flow apenas se necessário.

Se utilizar React Flow:

customizar completamente nodes;

customizar edges;

não utilizar aparência padrão;

não deixar handles visíveis desnecessariamente.

Organização:

src/

components/

architecture/

rag/

agents/

tools/

services/

kafka/

presentation/

labs/

simulation/

scenes/

data/

hooks/

types/

---

# DADOS CENTRALIZADOS

Criar:

data/documents.ts

data/products.ts

data/tools.ts

data/agents.ts

data/scenarios.ts

data/glossary.ts

data/quiz.ts

Não espalhar textos didáticos por componentes.

---

# GLOSSÁRIO

Termos clicáveis:

LLM

RAG

Chunk

Embedding

Vector

Vector Database

Busca Semântica

Similarity

Top-K

Tool

Function Calling

Agent

State

Memory

Orchestrator

Handoff

Multi-Agent

Microsserviço

Kafka

Evento

Cada definição deve responder:

“O que é?”

“Para que serve?”

“Exemplo no nosso sistema.”

---

# EXPERIÊNCIA VISUAL

Priorizar:

1920x1080

1440x900

1366x768

Essa é uma apresentação para compartilhamento de tela.

Desktop-first.

Evitar scroll tradicional.

Cada cena deve ocupar aproximadamente 100vh e funcionar como um palco.

---

# ACESSIBILIDADE

Garantir:

bom contraste;

navegação completa por teclado;

fontes grandes;

informação não dependente exclusivamente de cor;

prefers-reduced-motion.

---

# CRITÉRIO DE QUALIDADE

Antes de considerar cada cena pronta, faça estas perguntas:

“Um aluno entende a ideia olhando para a tela sem eu precisar ler um parágrafo?”

“Existe informação demais aparecendo ao mesmo tempo?”

“A animação ajuda a explicar o conceito?”

“O texto parece algo que uma pessoa realmente diria em sala?”

“O aluno consegue identificar quem decidiu e quem executou?”

“Estamos introduzindo algum componente antes de ele ser necessário?”

Se qualquer resposta indicar problema, simplifique.

---

# TESTE PEDAGÓGICO FINAL

Ao terminar, percorra toda a apresentação e confirme se um aluno consegue responder:

1. O que uma LLM faz?

2. Por que uma LLM não conhece automaticamente meus documentos internos?

3. Para que serve RAG?

4. O que é um chunk?

5. Por que utilizamos embeddings?

6. O que é busca semântica?

7. O que um Vector Database guarda?

8. RAG é um Vector Database?

9. O que é uma Tool?

10. Quem realmente gera a imagem?

11. O que diferencia Agent de uma chamada simples de LLM?

12. O que diferencia Agent de Workflow?

13. RAG é um Agent?

14. Um Agent pode usar RAG?

15. Image Service é Image Agent?

16. Todo microsserviço precisa de Agent?

17. O que faz um Orchestrator Agent?

18. O que caracteriza um sistema Multi-Agent?

19. Multi-Agent significa vários microsserviços?

20. Onde Kafka entra?

21. Kafka é um Agent?

22. Quando NÃO vale a pena utilizar Agent?

Se algum desses pontos ainda estiver ambíguo, melhorar a narrativa antes de considerar a implementação concluída.

---

# ORDEM DE IMPLEMENTAÇÃO

Primeiro leia e siga integralmente a skill **immersive-presentations**.

Depois analise o projeto existente.

Não comece implementando componentes aleatórios.

FASE 1

Defina:

storyboard;

ritmo da apresentação;

design system;

tokens;

tipografia;

cores semânticas;

shell de apresentação;

navegação;

Presenter Mode.

FASE 2

Implemente:

microsserviços;

workflow tradicional;

variação de pedidos;

LLM.

FASE 3

Implemente toda a história do RAG:

50 mil documentos;

documentos;

chunks;

Chunking Lab;

embeddings;

Embedding Lab;

Vector Database;

retrieval;

RAG completo.

FASE 4

Implemente:

Tools;

Tool Inspector;

Agent;

execution trace;

comparação Agent x Workflow.

FASE 5

Implemente:

Agent + RAG;

transição para Multi-Agent;

Orchestrator;

Knowledge Agent;

Image Agent;

Video Agent;

Caption Agent.

FASE 6

Implemente:

execução Multi-Agent completa;

distributed trace;

Follow Data;

Follow Decisions;

X-Ray.

FASE 7

Implemente:

Kafka;

Infrastructure Mode;

arquitetura final.

FASE 8

Implemente:

quiz;

“What should I use?”;

mito ou verdade;

comparador;

ecossistema;

glossário.

FASE 9

Faça uma rodada inteira apenas de:

simplificação dos textos;

clareza pedagógica;

ritmo;

transições;

animações;

responsividade;

acessibilidade;

performance.

A cada fase:

rodar aplicação;

validar TypeScript;

rodar lint;

verificar console;

testar navegação;

corrigir erros antes de continuar.

---

# ÚLTIMA REGRA

Não tente mostrar que o sistema é sofisticado.

Tente fazer conceitos sofisticados parecerem simples.

Quando tiver que escolher entre:

uma arquitetura visualmente impressionante

e

uma arquitetura imediatamente compreensível,

ESCOLHA A SEGUNDA.

Quando tiver que escolher entre:

um termo técnico

e

uma explicação que um aluno consegue visualizar,

EXPLIQUE PRIMEIRO E DÊ O NOME DEPOIS.

A experiência deve ter momentos em que a pessoa literalmente vê:

“Ah, então RAG é essa parte.”

“Ah, então a Tool é essa ponte.”

“Ah, quem gera a imagem continua sendo o Image Service.”

“Ah, o Agent é quem decide qual capacidade utilizar.”

“Ah, vários microsserviços não significam Multi-Agent.”

Esse é o verdadeiro critério de sucesso da apresentação.