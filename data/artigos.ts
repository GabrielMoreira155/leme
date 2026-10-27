// Artigos curtos e gratuitos. Textos provisórios, a revisar pelo psicólogo responsável.

export type Artigo = {
  id: string;
  titulo: string;
  resumo: string;
  minutos: number;
  paragrafos: string[];
};

export const RODAPE_ARTIGOS =
  'Conteúdo educativo, não substitui acompanhamento profissional. Revisado por [psicólogo responsável · CRP a definir].';

export const ARTIGOS: Artigo[] = [
  {
    id: 'fissura',
    titulo: 'O que é a fissura e por que ela passa',
    resumo: 'A vontade forte parece que vai durar para sempre. Ela não dura.',
    minutos: 3,
    paragrafos: [
      'Fissura é aquela vontade intensa que aparece de repente e parece ocupar a cabeça inteira. Ela é uma reação do corpo e do cérebro a um costume antigo, e não um sinal de fraqueza.',
      'A boa notícia é que a fissura se comporta como uma onda. Ela sobe, chega num pico e desce. Na maioria das vezes, o pico passa em poucos minutos, mesmo quando parece que não vai passar.',
      'O que ajuda é atravessar o pico sem brigar com ele. Respirar devagar, mudar de lugar, beber água ou falar com alguém dá tempo para a onda baixar.',
      'Cada vez que você atravessa uma onda, o cérebro aprende que dá para sentir a vontade sem obedecer a ela. Com o tempo, as ondas tendem a ficar menores e mais espaçadas.',
    ],
  },
  {
    id: 'gatilhos',
    titulo: 'Gatilhos: como descobrir os seus',
    resumo: 'Lugares, horários e sentimentos que puxam o hábito. Dá para mapear.',
    minutos: 4,
    paragrafos: [
      'Gatilho é tudo aquilo que costuma vir antes do hábito: um horário, um lugar, uma pessoa, um sentimento. Tédio à noite, estresse depois do trabalho e celular na cama são exemplos comuns.',
      'Para descobrir os seus, observe sem julgar. Quando a vontade aparecer, anote rapidinho onde você estava, o que estava sentindo e o que tinha acabado de acontecer.',
      'Depois de alguns dias, os padrões aparecem. É como desenhar um mapa das áreas de mar agitado.',
      'Com o mapa em mãos, dá para planejar: evitar algumas rotas, preparar uma alternativa para outras e chegar mais preparado nas horas difíceis.',
    ],
  },
  {
    id: 'tropecar',
    titulo: 'Tropeçar não apaga o que você construiu',
    resumo: 'Uma onda forte não desfaz as milhas que você já navegou.',
    minutos: 3,
    paragrafos: [
      'Quase toda mudança de hábito tem idas e vindas. Um tropeço não significa voltar para o começo. Tudo o que você aprendeu continua com você.',
      'O pensamento de "já que errei, tanto faz" é uma armadilha comum. Ele transforma uma onda num temporal. O caminho mais leve é olhar para o que aconteceu com curiosidade.',
      'Pergunte: o que veio antes? O que eu estava sentindo? O que posso fazer diferente da próxima vez? Essas respostas ajustam a rota.',
      'No Leme, os seus dias cuidados e o seu nível não somem quando você tropeça. A gente só ajusta a meta para ela caber na semana que você está vivendo.',
    ],
  },
  {
    id: 'contar',
    titulo: 'Como contar para alguém de confiança',
    resumo: 'Ter uma pessoa por perto faz a viagem ficar mais leve.',
    minutos: 4,
    paragrafos: [
      'Contar para alguém pode dar medo, mas costuma aliviar. Você não precisa contar tudo de uma vez nem para todo mundo.',
      'Escolha uma pessoa que costuma ouvir sem julgar. Pode ser um amigo, alguém da família ou um profissional.',
      'Comece simples: "Estou cuidando de um hábito que tem pesado para mim. Queria que você soubesse." Depois diga como ela pode ajudar, por exemplo mandando uma mensagem à noite.',
      'Se a conversa não sair como você esperava, tudo bem. Isso diz mais sobre o momento da outra pessoa do que sobre você. Dá para tentar com outra pessoa.',
    ],
  },
  {
    id: 'sono-humor',
    titulo: 'Sono, humor e vontade: tudo conectado',
    resumo: 'Noites mal dormidas deixam as ondas mais fortes no dia seguinte.',
    minutos: 3,
    paragrafos: [
      'Quando a gente dorme pouco, o cérebro fica com menos freio e mais busca por recompensa rápida. Por isso a vontade costuma bater mais forte no dia seguinte a uma noite ruim.',
      'Cuidar do sono é uma das formas mais simples de deixar o mar mais calmo. Horário parecido para deitar, luz baixa à noite e celular longe da cama já ajudam.',
      'Se o sono estiver muito difícil por muitas semanas, vale conversar com um profissional de saúde.',
    ],
  },
];
