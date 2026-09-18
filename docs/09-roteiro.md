# 09 · Roteiro da apresentação (cronometrado)

> Como executar a sessão inteira, online: slides + demo ao vivo, com backup para imprevistos.
> Duração total estimada: 60–75 min.

## 0. Antes de começar (30 min antes)

- [ ] Conferir a conexão e o compartilhamento de tela (janela do navegador + terminal)
- [ ] Slides abertos no browser
- [ ] Projeto instalado e `.env` preenchido (etapas 02 a 06 testadas)
- [ ] `npm run dev` rodando (servidor na :8000)
- [ ] Modelo de embedding já baixado e `setup()` já executado uma vez
- [ ] Uma imagem e um vídeo de teste gerados com a chave da Atlas (garante que a conta tem saldo)
- [ ] Prompt "pronto" copiado para a demo do agent (evita digitar ao vivo)
- [ ] Plano B à mão (se a internet cair → ver `10-problemas-comuns.md`)

## Bloco 1 — Slides (20–25 min)

Percorra até o Ato 5/6 usando as notas do apresentador. Fio condutor:
"quem decide ≠ quem executa".

## Bloco 2 — A base sem IA (10 min)

1. Mostre a estrutura de pastas do projeto.
2. Abra a interface web no modo **Sem IA**.
3. Rode `/health`, `/images`, `/videos`, `/captions` e `/workflow` pela interface.
4. No `/workflow`, pergunte: **"quem decidiu a ordem?"** → o desenvolvedor.

## Bloco 3 — A LLM entende (5 min)

1. Rode o chat do DeepSeek: "Crie apenas uma imagem do Vestido Aurora."
2. Mostre que ela responde entendendo, mas **não chama nada**.
3. Frase de transição: "entender não é executar."

## Bloco 4 — RAG (15 min)

1. **Crie os documentos ao vivo** (`05`): products, brand-guide, campaigns.
2. Rode `setup()` mostrando os chunks na tela.
3. Pergunte "Qual é o público do Vestido Aurora?" → resposta com **fonte**.
4. Mostre busca semântica: "quero uma roupa elegante" achando o vestido.

## Bloco 5 — 5 agentes + imagem real (15 min)

> **A demo principal agora roda na interface web** (mesma porta do backend):
> abra `http://localhost:8000/`, escolha o modo **"Objetivo (Agent)"**, digite ou
> escolha um preset e veja tudo em tempo real no painel "o que está acontecendo".

1. Mostre o registro de tools (4 funções) no código.
2. Rode o objetivo "Crie um vídeo para divulgar o Vestido Aurora." na interface.
3. Narre os 5 agentes: Orchestrator → Knowledge → Image → Video → Caption.
4. Quando a URL da imagem sair, **abra/veja a imagem no painel de resultado** — primeiro destaque.
5. Quando a URL do vídeo sair, destaque que foi o `Video Service` usando Atlas Cloud.
6. Teste um pedido diferente ("Gere apenas uma imagem") e compare o caminho.

> Plano B: se a interface falhar, o mesmo fluxo roda no terminal com
> `npm run agent:demo -- "Crie um vídeo para divulgar o Vestido Aurora"`.

## Bloco 6 — Fechamento (5 min)

- Mapa mental: conhecer (RAG) → coordenar (Orchestrator) → decidir (Agent) → executar (serviço).
- Frase final: "use a arquitetura mais simples que resolve o problema."

## Enxugamento (se atrasar)

Corte nesta ordem, mantendo o "wow" da imagem:
1. Bloco 3 (vira só fala, sem demo)
2. Busca semântica extra do Bloco 4
3. Bloco 2 → mostrar só `/workflow` no modo Sem IA

## Depois da apresentação

- [ ] Parar o `npm run dev`
- [ ] Se alguma chave vazou em chat/log, gerar chaves novas
- [ ] Salvar/exibir a imagem gerada do Vestido Aurora
- [ ] Salvar/exibir o vídeo gerado do Vestido Aurora
- [ ] Disponibilizar o passo a passo para quem assistiu
