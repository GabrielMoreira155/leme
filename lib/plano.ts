/*
 * GERAÇÃO DO PLANO
 * A pessoa nunca cria as próprias metas. O plano sai da ficha.
 *
 * Meta da semana (degraus, do mais leve para o mais firme):
 *   0: 2 dias com menos do que o normal
 *   1: 2 dias livres
 *   2: 4 dias livres
 *   3: 7 dias livres seguidos
 * No tema personalizado de "fazer mais", as metas viram positivas:
 *   0: 2 dias  1: 3 dias  2: 5 dias  3: todos os dias, sempre "fazer isso".
 * Temas com semMetas (relação com a comida) não têm meta de dias livres.
 *
 * Degrau inicial pela frequência: quanto mais frequente o hábito,
 * mais leve o começo (várias vezes ao dia: 0, quase todo dia: 1,
 * algumas vezes por semana: 2, em fases: 3). Exceção: álcool começa sempre no 0. A meta sobe um degrau por semana cumprida e
 * desce um sozinha se a semana não fechar, sem castigo nenhum.
 */

import type { IdCuidado } from '@/data/cuidados';
import type { Personalizado } from '@/data/personalizado';
import type { IdTema, Missao } from '@/data/temas';
import { classificarNivel, Frequencia, Impacto, Nivel } from './nivel';
import { cuidadoDaFicha, temaDaFicha } from './tema';

export type FaixaIdade = '13-17' | '18-24' | '25-39' | '40+';
export type Seguranca = 'nao' | 'as-vezes' | 'sim-agora' | 'prefiro-nao';

export type Ficha = {
  apelido: string;
  faixaIdade: FaixaIdade;
  tema: IdTema;
  /** Texto livre do "Outro", mostrado como "Foco: ...". Fica só no aparelho. */
  textoOutro?: string;
  /** Respostas das 3 perguntas quando tema === 'personalizado'. */
  personalizado?: Personalizado;
  frequencia: Frequencia;
  impacto: Impacto;
  cuidar: IdCuidado[];
  /** O que quer cuidar, com as palavras da pessoa (quando marca "Escrever com minhas palavras"). */
  cuidarTexto?: string;
  seguranca: Seguranca;
};

export type Plano = {
  nivel: Nivel;
  degrau: number; // 0 a 3
  semana: number; // porto atual, 0 a 3
  convitePsicologo: boolean;
  avisoAlcool: boolean;
  menorDeIdade: boolean;
  sessoesEmDestaque: boolean;
  criadoEm: string;
};

const DIAS_META = [2, 2, 4, 7];
const DIAS_META_FAZER_MAIS = [2, 3, 5, 7];

type FichaDoTema = Pick<Ficha, 'tema' | 'personalizado'>;

export function diasMeta(degrau: number, ficha: FichaDoTema): number {
  return (temaDaFicha(ficha).fazerMais ? DIAS_META_FAZER_MAIS : DIAS_META)[degrau];
}

export function textoMeta(degrau: number, ficha: FichaDoTema): string {
  const tema = temaDaFicha(ficha);
  if (tema.fazerMais) {
    const dias = DIAS_META_FAZER_MAIS[degrau];
    const acao = tema.acao ?? 'Fazer isso';
    return dias === 7 ? `${acao} todos os dias da semana` : `${acao} em ${dias} dias da semana`;
  }
  const livre = tema.livre;
  switch (degrau) {
    case 0:
      return '2 dias com menos do que o normal';
    case 1:
      return `2 dias ${livre}`;
    case 2:
      return `4 dias ${livre}`;
    default:
      return `7 dias seguidos ${livre}`;
  }
}

function degrauInicial(f: Frequencia): number {
  switch (f) {
    case 'varias-dia':
      return 0;
    case 'quase-todo-dia':
      return 1;
    case 'algumas-semana':
      return 2;
    case 'fases':
      return 3;
  }
}

export function gerarPlano(ficha: Ficha): Plano {
  const tema = temaDaFicha(ficha);
  const nivel = classificarNivel(tema, ficha.frequencia, ficha.impacto);
  const risco = ficha.seguranca === 'as-vezes' || ficha.seguranca === 'sim-agora';
  return {
    nivel,
    // Álcool sempre começa em "menos do que o normal": parar de uma vez pode ser perigoso
    // para quem bebe muito, então a redução é gradual e com acompanhamento.
    degrau: ficha.tema === 'alcool' ? 0 : degrauInicial(ficha.frequencia),
    semana: 0,
    convitePsicologo: nivel === 'pesado' || risco || !!tema.conviteSempre,
    avisoAlcool: ficha.tema === 'alcool',
    menorDeIdade: ficha.faixaIdade === '13-17',
    sessoesEmDestaque: nivel !== 'leve' || risco || !!tema.conviteSempre,
    criadoEm: new Date().toISOString(),
  };
}

// Sobe um degrau quando a semana é cumprida e desce sozinho quando não é.
export function ajustarMeta(plano: Plano, cumpriu: boolean): Plano {
  const degrau = cumpriu ? Math.min(3, plano.degrau + 1) : Math.max(0, plano.degrau - 1);
  return { ...plano, degrau, semana: Math.min(3, plano.semana + 1) };
}

// 3 missões do dia: 2 do tema (giram conforme o dia) e 1 do "o que quer cuidar".
export function missoesDoDia(ficha: Ficha, data = new Date()): Missao[] {
  const tema = temaDaFicha(ficha);
  const dia = Math.floor(data.getTime() / 86400000);
  const i = dia % tema.missoes.length;
  const a = tema.missoes[i];
  const b = tema.missoes[(i + 1) % tema.missoes.length];
  const cuidado = cuidadoDaFicha(ficha, ficha.cuidar[dia % Math.max(1, ficha.cuidar.length)]);
  return [a, b, cuidado.missao];
}

export const MISSAO_RECOMECO: Missao = {
  id: 'recomeco',
  texto: 'Missão de recomeço: escrever uma coisa que você aprendeu com essa onda',
};
