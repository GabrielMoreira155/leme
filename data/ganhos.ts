// Tipo de ganho de cada tema e as perguntas da base (tela "Calcular meus ganhos").
// Todo tema precisa estar aqui, inclusive os novos e o personalizado.
// A conta em si fica em lib/ganhos.ts.

import { formatarHoras, formatarReais, type TipoGanho } from '@/lib/ganhos';
import type { Ficha } from '@/lib/plano';
import type { IdTema } from './temas';

export type Pergunta = {
  id: string;
  texto: string;
  ajuda?: string;
  unidade: 'reais' | 'horas' | 'vezes';
  /** Chips de exemplo. */
  exemplos: number[];
  sufixo: string;
};

export type ConfigGanho = {
  tipo: TipoGanho;
  /** Identifica para qual tema a base foi informada. Se o tema mudar, a base é pedida de novo. */
  chave: string;
  perguntas: Pergunta[];
  /** Converte as respostas na base: reais por semana (dinheiro) ou horas por dia (tempo). */
  base: (r: Record<string, number>) => number;
  /** Primeira frase da folha "Como calculamos". */
  fraseBase: (r: Record<string, number>) => string;
};

const R = (v: number) => formatarReais(v, v % 1 !== 0);
const H = formatarHoras;

const EX_REAIS = [50, 100, 200, 500];
const EX_HORAS = [1, 2, 3, 5];

function dinheiro(chave: string, texto: string, frase: (valor: string) => string, ajuda?: string): ConfigGanho {
  return {
    tipo: 'dinheiro',
    chave,
    perguntas: [{ id: 'valor', texto, ajuda, unidade: 'reais', exemplos: EX_REAIS, sufixo: 'por semana' }],
    base: (r) => r.valor ?? 0,
    fraseBase: (r) => frase(R(r.valor ?? 0)),
  };
}

function tempo(chave: string, texto: string, frase: (horas: string) => string, ajuda?: string): ConfigGanho {
  return {
    tipo: 'tempo',
    chave,
    perguntas: [{ id: 'horas', texto, ajuda, unidade: 'horas', exemplos: EX_HORAS, sufixo: 'por dia' }],
    base: (r) => r.horas ?? 0,
    fraseBase: (r) => frase(H(r.horas ?? 0)),
  };
}

function semPergunta(tipo: TipoGanho, chave: string): ConfigGanho {
  return { tipo, chave, perguntas: [], base: () => 0, fraseBase: () => '' };
}

const POR_TEMA: Partial<Record<IdTema, ConfigGanho>> = {
  apostas: dinheiro(
    'apostas',
    'Em média, quanto você coloca em apostas por semana?',
    (v) => `Você contou que coloca cerca de ${v} por semana em apostas.`,
    'Pense no que sai do seu bolso, sem descontar o que voltou de prêmio.',
  ),
  alcool: {
    tipo: 'dinheiro',
    chave: 'alcool',
    perguntas: [
      { id: 'vezes', texto: 'Quantas vezes por semana você bebe?', unidade: 'vezes', exemplos: [1, 2, 3, 5], sufixo: 'vezes por semana' },
      { id: 'porVez', texto: 'Quanto costuma gastar em cada vez?', unidade: 'reais', exemplos: [30, 50, 100, 200], sufixo: 'por vez' },
    ],
    base: (r) => (r.vezes ?? 0) * (r.porVez ?? 0),
    fraseBase: (r) =>
      `Você contou que bebe cerca de ${r.vezes} ${r.vezes === 1 ? 'vez' : 'vezes'} por semana e gasta ${R(r.porVez ?? 0)} em cada vez, o que dá ${R((r.vezes ?? 0) * (r.porVez ?? 0))} por semana.`,
  },
  cigarro: dinheiro(
    'cigarro',
    'Quanto você gasta por semana com cigarro, vape ou refil?',
    (v) => `Você contou que gasta cerca de ${v} por semana com cigarro, vape ou refil.`,
  ),
  doce: dinheiro(
    'doce',
    'Quanto você gasta por semana com delivery, doce ou lanche por impulso?',
    (v) => `Você contou que gasta cerca de ${v} por semana com delivery, doce ou lanche por impulso.`,
  ),
  compras: dinheiro(
    'compras',
    'Quanto você gasta por semana em compras que depois acha que não precisava?',
    (v) => `Você contou que gasta cerca de ${v} por semana em compras que depois acha que não precisava.`,
  ),
  cafe: dinheiro(
    'cafe',
    'Quanto você gasta por semana com café ou energético?',
    (v) => `Você contou que gasta cerca de ${v} por semana com café ou energético.`,
  ),
  celular: tempo(
    'celular',
    'Quantas horas por dia você passa no celular fora do trabalho ou estudo?',
    (h) => `Você contou que passa cerca de ${h} por dia no celular, fora do trabalho ou estudo.`,
    'Se não souber, o próprio celular mostra no Tempo de uso.',
  ),
  jogos: tempo('jogos', 'Quantas horas por dia isso costuma ocupar?', (h) => `Você contou que os jogos ocupam cerca de ${h} por dia.`),
  series: tempo('series', 'Quantas horas por dia isso costuma ocupar?', (h) => `Você contou que as séries ocupam cerca de ${h} por dia.`),
  procrastinacao: tempo(
    'procrastinacao',
    'Quantas horas por dia você sente que perde adiando as coisas?',
    (h) => `Você contou que sente perder cerca de ${h} por dia adiando as coisas.`,
  ),
  // Linguagem neutra, sem detalhes.
  pornografia: tempo('pornografia', 'Quanto tempo por dia, mais ou menos, isso ocupa?', (h) => `Você contou que isso ocupa cerca de ${h} por dia.`),
  sono: semPergunta('noites', 'sono'),
  ansiedade: semPergunta('ondas', 'ansiedade'),
  unha: semPergunta('ondas', 'unha'),
  substancias: semPergunta('ondas', 'substancias'),
  outro: semPergunta('ondas', 'outro'),
  // Relação com a comida: sem cartão de ganhos.
  alimentacao: semPergunta('nenhum', 'alimentacao'),
};

export function configGanho(ficha: Pick<Ficha, 'tema' | 'personalizado'>): ConfigGanho {
  if (ficha.tema === 'personalizado') {
    const pesa = ficha.personalizado?.pesa;
    const chave = `personalizado-${pesa}`;
    if (pesa === 'dinheiro') {
      return dinheiro(chave, 'Quanto você gasta por semana com esse hábito?', (v) => `Você contou que gasta cerca de ${v} por semana com esse hábito.`);
    }
    if (pesa === 'tempo') {
      return tempo(chave, 'Quantas horas por dia esse hábito ocupa?', (h) => `Você contou que esse hábito ocupa cerca de ${h} por dia.`);
    }
    // Energia e saúde ou relações: ondas atravessadas.
    return semPergunta('ondas', chave);
  }
  return POR_TEMA[ficha.tema] ?? semPergunta('ondas', ficha.tema);
}

// Texto curto da base, para o Perfil.
export function descreverBase(config: ConfigGanho, respostas: Record<string, number>): string {
  if (config.tipo === 'dinheiro') return `${formatarReais(config.base(respostas), false)} por semana`;
  if (config.tipo === 'tempo') return `${formatarHoras(config.base(respostas))} por dia`;
  return '';
}
