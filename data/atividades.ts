import type { NomeIcone } from '@/components/Icone';

export type IdAtividade = 'respiracao' | 'surfar' | 'diario' | 'hora-dificil' | 'carta';

export type Atividade = {
  id: IdAtividade;
  titulo: string;
  descricao: string;
  minutos: string;
  icone: NomeIcone;
  /** Respiração de emergência é sempre livre. As interativas custam 1 de energia e dão +15 XP. */
  custaEnergia: boolean;
};

export const XP_ATIVIDADE = 15;

export const ATIVIDADES: Atividade[] = [
  {
    id: 'respiracao',
    titulo: 'Respiração de emergência',
    descricao: 'Inspira 4, segura 4, solta 6. Sempre livre.',
    minutos: '2 a 3 min',
    icone: 'onda',
    custaEnergia: false,
  },
  {
    id: 'surfar',
    titulo: 'Surfar a vontade',
    descricao: 'Observar a onda subir e descer sem precisar obedecer.',
    minutos: '5 min',
    icone: 'vela',
    custaEnergia: true,
  },
  {
    id: 'diario',
    titulo: 'Diário de gatilhos',
    descricao: 'Anotar o que veio antes da vontade e desenhar seu mapa.',
    minutos: '3 min',
    icone: 'mapa',
    custaEnergia: true,
  },
  {
    id: 'hora-dificil',
    titulo: 'Plano para a hora difícil',
    descricao: 'Seus sinais, o que fazer e para quem chamar.',
    minutos: '5 min',
    icone: 'farol',
    custaEnergia: true,
  },
  {
    id: 'carta',
    titulo: 'Carta para você daqui a 30 dias',
    descricao: 'Uma mensagem que só abre daqui a um mês.',
    minutos: '5 min',
    icone: 'carta',
    custaEnergia: true,
  },
];

export const PASSOS_SURFAR = [
  { titulo: 'Repare na onda', texto: 'Onde você sente a vontade no corpo? Peito, barriga, mãos, cabeça? Só repare.' },
  { titulo: 'Dê uma nota', texto: 'De 0 a 10, qual a força dessa vontade agora?' },
  { titulo: 'Deixe ela subir', texto: 'Imagine a vontade como uma onda. Você está na prancha. Não precisa lutar, só equilibrar.' },
  { titulo: 'Respire junto', texto: 'Inspire contando 4, solte contando 6. Repita algumas vezes enquanto observa a onda.' },
  { titulo: 'Nota de novo', texto: 'E agora, de 0 a 10? Mesmo que tenha baixado pouco, você atravessou um pedaço.' },
];

export const DISTRACOES = [
  'Beba um copo de água gelada bem devagar.',
  'Mande uma mensagem para alguém de quem você gosta.',
  'Dê uma volta no quarteirão ou mude de cômodo.',
  'Conte 5 coisas que você vê e 4 que você ouve.',
  'Lave o rosto com água fria.',
  'Coloque uma música e arrume uma gaveta.',
  'Faça 10 polichinelos ou alongue os braços.',
];
