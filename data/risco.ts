// CHECAGEM DE RISCO DO TEXTO LIVRE
// ------------------------------------------------------------------
// PROVISÓRIO: esta lista precisa ser revisada pelo psicólogo responsável.
//
// Termos ligados a se machucar, suicídio, não querer viver e violência contra si.
// Se qualquer um aparecer no texto do "Outro", o texto NÃO vira hábito: não gera missão,
// meta, ganho nem jogo. A pessoa vai para a tela de Apoio (CVV 188, SAMU 192 e psicólogo
// com prioridade) e depois pode escolher outro tema, se quiser.
//
// A lista erra de propósito para o lado da cautela: é melhor oferecer apoio a mais do que a menos.
// Escreva já normalizado (minúsculas, sem acento, sem pontuação). * vale como começo de palavra.

export const TERMOS_RISCO: string[] = [
  'suicid*',
  'me matar',
  'se matar',
  'me mato',
  'tirar minha vida',
  'tirar a minha vida',
  'acabar com a minha vida',
  'acabar com minha vida',
  'acabar com tudo',
  'quero morrer',
  'vontade de morrer',
  'queria morrer',
  'morrer',
  'nao quero mais viver',
  'nao quero viver',
  'nao quero mais estar aqui',
  'nao quero estar aqui',
  'nao aguento mais viver',
  'sumir pra sempre',
  'sumir para sempre',
  'desaparecer pra sempre',
  'me machucar',
  'me machuco',
  'me ferir',
  'me cortar',
  'me corto',
  'cortar os pulsos',
  'cortar o pulso',
  'autolesao',
  'automutila*',
  'me bater',
  'me queimar',
  'me jogar',
  'pular da ponte',
  'tomar todos os remedios',
  'overdose',
  'enforcar',
];
