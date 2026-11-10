import type { Missao } from './temas';

// Tema personalizado: quando o texto do "Outro" não é reconhecido (ou a pessoa diz "Não exatamente"),
// 3 perguntas de 1 toque montam o tema. A pessoa continua sem criar metas: tudo sai daqui.

export type Direcao = 'diminuir' | 'fazer-mais';
export type Momento = 'manha' | 'noite' | 'sozinho' | 'estressado' | 'entediado' | 'com-outros';
export type Pesa = 'dinheiro' | 'tempo' | 'energia' | 'relacoes';

export type Personalizado = { direcao: Direcao; momentos: Momento[]; pesa: Pesa };

export const DIRECOES: { id: Direcao; nome: string }[] = [
  { id: 'diminuir', nome: 'Diminuir ou parar' },
  { id: 'fazer-mais', nome: 'Fazer mais, criar o hábito' },
];

export const MOMENTOS: { id: Momento; nome: string }[] = [
  { id: 'manha', nome: 'De manhã' },
  { id: 'noite', nome: 'À noite' },
  { id: 'sozinho', nome: 'Quando estou sozinho' },
  { id: 'estressado', nome: 'Quando estou estressado' },
  { id: 'entediado', nome: 'Quando estou entediado' },
  { id: 'com-outros', nome: 'Com outras pessoas' },
];

export const PESOS: { id: Pesa; nome: string }[] = [
  { id: 'dinheiro', nome: 'Dinheiro' },
  { id: 'tempo', nome: 'Tempo' },
  { id: 'energia', nome: 'Energia e saúde' },
  { id: 'relacoes', nome: 'Relações' },
];

// Banco de missões genéricas por momento e gatilho.
export const MISSOES_POR_MOMENTO: Record<Direcao, Record<Momento, Missao>> = {
  diminuir: {
    manha: { id: 'per-d-manha', texto: 'Começar o dia com 10 minutos longe desse hábito' },
    noite: { id: 'per-d-noite', texto: 'Deixar o celular e outros gatilhos fora do quarto depois das 22h' },
    sozinho: { id: 'per-d-sozinho', texto: 'Combinar uma mensagem com alguém na hora em que você costuma ficar só' },
    estressado: { id: 'per-d-estresse', texto: 'Fazer a Respiração de emergência antes de agir no impulso' },
    entediado: { id: 'per-d-tedio', texto: 'Ter uma lista de 3 coisas rápidas para fazer quando bater o tédio' },
    'com-outros': { id: 'per-d-outros', texto: 'Combinar um limite antes de encontrar as pessoas e contar para alguém' },
  },
  'fazer-mais': {
    manha: { id: 'per-m-manha', texto: 'Fazer um pouco disso logo de manhã, antes de pegar o celular' },
    noite: { id: 'per-m-noite', texto: 'Reservar 15 minutos à noite para isso' },
    sozinho: { id: 'per-m-sozinho', texto: 'Usar um momento só seu para fazer isso hoje' },
    estressado: { id: 'per-m-estresse', texto: 'Quando bater o estresse, fazer um pouco disso no lugar do impulso' },
    entediado: { id: 'per-m-tedio', texto: 'Deixar tudo pronto para fazer isso quando bater o tédio' },
    'com-outros': { id: 'per-m-outros', texto: 'Chamar alguém para fazer isso junto' },
  },
};

// Completam as 4 missões do tema quando a pessoa marca só um momento (ou para girar entre os dias).
export const MISSOES_GENERICAS: Record<Direcao, Missao[]> = {
  diminuir: [
    { id: 'per-d-g1', texto: 'Anotar quando esse hábito apareceu hoje e o que veio antes' },
    { id: 'per-d-g2', texto: 'Na vontade, esperar 10 minutos e respirar antes de decidir' },
  ],
  'fazer-mais': [
    { id: 'per-m-g1', texto: 'Fazer um pouquinho disso hoje, nem que sejam 5 minutos' },
    { id: 'per-m-g2', texto: 'Anotar como você se sentiu depois de fazer isso' },
  ],
};
