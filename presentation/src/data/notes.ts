export type NotesMap = Record<string, string[]>

export const notes: NotesMap = {
  s00: [
    'Apresente o roteiro: vamos crescer um sistema simples até multi-agentes.',
    'Deixe claro que nada aqui é mágica: cada conceito nasce de uma necessidade.',
  ],
  s01: [
    'Pergunte antes de mostrar: “precisamos de IA para coordenar isso?”',
    'Resposta esperada: “não necessariamente”. Segure a resposta por um instante.',
  ],
  s02: [
    'Mostre um serviço por vez; não despeje os três juntos.',
    'Enfatize: cada serviço sabe fazer exatamente uma coisa.',
    'Deixe o aluno clicar para ver entrada/saída. Microsserviço é software especializado.',
  ],
  s03: [
    'Rode o workflow devagar, mostrando o dado descendo a cadeia.',
    'Pergunte: “quem decidiu essa ordem?”. A resposta é o desenvolvedor.',
    'Conclusão-chave: automação não é a mesma coisa que agente.',
  ],
  s04: [
    'Mostre os quatro pedidos. Cada um tem uma necessidade diferente.',
    'Destaque etapas desnecessárias no fluxo fixo.',
    'Feche com: “agora surgiu uma decisão” — ainda sem falar de agent.',
  ],
  s05: [
    'Enfatize que entender ≠ executar.',
    'A LLM não ganha acesso aos nossos sistemas magicamente.',
    'Guarde esta ideia: ela volta nos próximos atos.',
  ],
  s05b: [
    'Pausa para respirar e consolidar. Leia os itens em voz alta.',
  ],
  s06: [
    'Mude o cenário por completo: agora são 50 mil documentos.',
    'Deixe a pergunta “qual é o público do Vestido Aurora?” no ar.',
    'Risque: mandar tudo toda vez não seria uma boa ideia.',
    'Só então diga o nome: RAG.',
  ],
  s07: [
    'Abra os documentos reais. Conteúdo pequeno, fácil de ler.',
    'Pergunta-guia: como tornar isso pesquisável por significado?',
  ],
  s08: [
    'Mostre o documento grande entrando.',
    'Corte em pedaços. Pergunte por que dividimos.',
    'Revele o nome: CHUNK. Definição em uma frase.',
  ],
  s08b: [
    'Convite à experimentação no Chunking Lab.',
    'Aumente o overlap e destaque o texto repetido.',
    'Pergunta: por que repetir uma parte?',
  ],
  s09: [
    'Trecho A e consulta usam palavras diferentes.',
    'Mas o significado é parecido. É a porta de entrada para embeddings.',
  ],
  s10: [
    'Embedding = significado vira números.',
    'Deixe claro que é uma simplificação em 2D para enxergar.',
    'Permita que os alunos digitem frases e observem onde “caem”.',
  ],
  s11: [
    'Chunks entram no Vector Database como vetores.',
    'Pergunta-armadilha: “então RAG é um Vector Database?” → NÃO.',
    'RAG é o processo; Vector Database é uma peça possível dele.',
  ],
  s12: [
    'Execute a busca em câmera lenta.',
    'Mostre Top-K e threshold filtrando o contexto.',
    'Faça os alunos verem resultados entrando/saindo do contexto.',
  ],
  s13: [
    'Monte o RAG completo, progressivamente.',
    'Termine mostrando a fonte da resposta (products.pdf, Chunk #17).',
    'Conclusão: RAG ajuda a IA a encontrar o que ela precisa saber.',
  ],
  s13b: [
    'Pausa conceitual. Reforce o que RAG é — e o que não é.',
  ],
  s14: [
    'Cena mais importante. Congele a tela no SABER ≠ FAZER.',
    'Deixe o silêncio trabalhar antes de continuar.',
  ],
  s15: [
    'Aqui é importante separar Agent de serviço.',
    'O Agent não sabe chamar nossas APIs sozinho.',
    'Precisamos disponibilizar tools.',
    'Por baixo da tool pode existir REST, gRPC, Kafka — simplificamos para REST.',
  ],
  s15b: [
    'Deixe os alunos inspecionarem cada tool.',
    'Repare que cada tool aponta para um microsserviço real.',
  ],
  s16: [
    'Evite definição formal. Volte aos pedidos e pergunte: quem escolhe?',
    'O Agent entra como a entidade que decide.',
    'Não mostre chain-of-thought; mostre estado observável.',
  ],
  s16b: [
    'Mostre o loop decisão → tool → observação girando.',
    'Deixe claro: é um ciclo, não uma linha reta.',
  ],
  s17: [
    'Acompanhe as decisões operacionais do Agent.',
    'Mostre apenas o observável: decisão, ação, observação, próxima decisão.',
  ],
  s18: [
    'Experimento principal: peça que alunos escolham um pedido.',
    'O caminho muda com o objetivo. Compare os casos.',
    'Feche: “o objetivo mudou. O caminho também.”',
  ],
  s19: [
    'Divida a tela: Workflow × Agent.',
    'Se o sistema sempre roda Imagem → Vídeo → Legenda, não precisa de agent.',
    'Não use agent só porque parece moderno.',
  ],
  s20: [
    'Junção final: o Agent usa RAG como capacidade de conhecimento.',
    'AGENT ≠ RAG. Mas AGENT PODE USAR RAG.',
    'Mostre o dado indo ao Vector DB e voltando como contexto.',
  ],
  s21: [
    'O Agent central começa a acumular tudo.',
    'Pergunte: isso é ruim? Não — mas separar responsabilidades fica difícil.',
  ],
  s22: [
    'Transformação: o agente grande se divide em especialistas.',
    'Revele um por um: Orchestrator, Knowledge, Image, Video, Caption.',
  ],
  s23: [
    'Cuidado: cada microsserviço precisa virar agente? NÃO.',
    'O Image Agent decide. O Image Service continua executando.',
  ],
  s24: [
    'Orchestrator não gera imagem, nem vídeo, nem legenda.',
    'Ele coordena. Liste as responsabilidades.',
  ],
  s25: [
    'Knowledge Agent não é o próprio RAG.',
    'RAG é o mecanismo que esse agente usa para encontrar conhecimento.',
  ],
  s26: [
    'Mostre claramente o dado indo e voltando ao Orchestrator.',
  ],
  s27: [
    'Mesmo fluxo, agora no Video Agent.',
  ],
  s28: [
    'Mesmo fluxo, agora no Caption Agent.',
  ],
  s29: [
    'Experiência culminante: execução completa passo a passo.',
    'Não acelere. Cada etapa tem um porquê de existir.',
  ],
  s30: [
    'Avançar evento a evento como um trace.',
    'Pergunte quem decidiu e quem executou em cada linha.',
  ],
  s30b: [
    'Use as lentes: seguir dados, seguir decisões e raio-x.',
    'Pergunta-chave: “percebem que decisão e dado não são a mesma coisa?”',
  ],
  s31: [
    'Serviços não precisam conversar só por HTTP.',
    'Mostre eventos viajando por Kafka.',
    'Kafka não é agente: é infraestrutura de mensageria.',
  ],
  s32: [
    'Monte a arquitetura em camadas, uma por vez.',
    'Use o toggle para revelar a infraestrutura por baixo.',
  ],
  s33: [
    'Jogo rápido: “quem faz o quê?”. Deixe os alunos tentarem.',
    'A resposta deve vir acompanhada de uma frase do porquê.',
  ],
  s34: [
    'Jogo de decisão: qual peça usar em cada caso.',
    'Explique cada resposta em uma frase.',
  ],
  s35: [
    'Quiz relâmpago de mito ou verdade.',
    'Mantenha o ritmo; é um teste dos conceitos, não uma aula nova.',
  ],
  s36: [
    'Ferramentas reais só agora, depois dos conceitos.',
    'Não vire catálogo. Uma frase por ferramenta, no máximo.',
  ],
  s37: [
    'Matriz comparativa. Passe o mouse sobre as células para ver exemplos.',
    'Use para responder “quando usar o quê?”.',
  ],
  s38: [
    'Mapa mental final: conhecer → decidir → agir → coordenar.',
    'Reconecte cada conceito ao lugar dele no sistema.',
  ],
  s39: [
    'Encerramento. Leia as seis frases com calma.',
    'Mensagem final: use a arquitetura mais simples que resolve o problema.',
  ],
}
