// Presets para apresentação: abrir o app com ?demo=apostas, ?demo=celular ou ?demo=outro já
// preenche a ficha, o plano, a base dos ganhos e alguns dias de histórico.

import type { Estado } from './estado';
import type { RespostaDia } from './ganhos';
import { Ficha, gerarPlano } from './plano';

export type NomeDemo = 'apostas' | 'celular' | 'outro';
export const DEMOS: NomeDemo[] = ['apostas', 'celular', 'outro'];

function data(diasAtras: number): string {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Monta o histórico a partir de uma sequência (índice 0 = ontem).
function historico(seq: RespostaDia[]) {
  const registroDiario: Record<string, RespostaDia> = {};
  seq.forEach((r, i) => (registroDiario[data(i + 1)] = r));
  const diasCuidados = seq.map((r, i) => (r === 'sempre' ? null : data(i + 1))).filter(Boolean) as string[];
  return { registroDiario, diasCuidados };
}

const L: RespostaDia = 'livre';
const M: RespostaDia = 'menos';
const S: RespostaDia = 'sempre';

export function criarEstadoDemo(nome: NomeDemo, inicial: Estado): Estado {
  const inicio = new Date(Date.now() - 12 * 86400000).toISOString();
  const base = {
    ...inicial,
    consentimento: { plano: true, melhorias: false, em: inicio },
    missoes: { data: data(0), feitas: [] },
  };

  let ficha: Ficha;
  let resto: Partial<Estado>;

  if (nome === 'apostas') {
    ficha = {
      apelido: 'Rafa',
      faixaIdade: '25-39',
      tema: 'apostas',
      frequencia: 'quase-todo-dia',
      impacto: 'bastante',
      cuidar: ['dinheiro', 'relacoes'],
      seguranca: 'nao',
    };
    // 7 dias livres e 4 com menos que o normal: R$ 150 por semana viram R$ 192,86.
    // Alvo de R$ 200: marcar "Livre" hoje na apresentação já mostra o porto alcançado.
    const h = historico([L, M, L, L, M, S, L, M, L, L, M, L]);
    resto = {
      ...h,
      ganhos: { respostas: { valor: 150 }, chave: 'apostas', recusou: false, destino: { tipo: 'guardar', alvo: 200 } },
      xp: 340,
      fissurasAtravessadas: 4,
    };
  } else if (nome === 'celular') {
    ficha = {
      apelido: 'Bia',
      faixaIdade: '18-24',
      tema: 'celular',
      frequencia: 'varias-dia',
      impacto: 'pouco',
      cuidar: ['sono', 'foco'],
      seguranca: 'nao',
    };
    const h = historico([L, L, M, S, L, M, L, M, L]);
    resto = { ...h, ganhos: { respostas: { horas: 3 }, chave: 'celular', recusou: false, destino: null }, xp: 260, fissurasAtravessadas: 6 };
  } else {
    ficha = {
      apelido: 'Duda',
      faixaIdade: '25-39',
      tema: 'compras',
      textoOutro: 'comprar coisas por impulso',
      frequencia: 'algumas-semana',
      impacto: 'pouco',
      cuidar: ['dinheiro'],
      seguranca: 'nao',
    };
    // Algumas compras evitadas.
    const h = historico([L, M, L, S, L, L, M]);
    resto = {
      ...h,
      ganhos: { respostas: { valor: 120 }, chave: 'compras', recusou: false, destino: { tipo: 'viagem', alvo: 400 } },
      xp: 180,
      fissurasAtravessadas: 2,
    };
  }

  const plano = { ...gerarPlano(ficha), criadoEm: inicio, semana: 1 };
  return { ...base, ...resto, ficha, plano };
}
