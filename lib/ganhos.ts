/*
 * CÁLCULO DOS GANHOS ("Seus ganhos até aqui")
 * ------------------------------------------------------------------
 * Funções puras, sem dependências do app, para dar para testar direto no Node
 * (tests/ganhos.test.ts, rodar com `npm test`).
 *
 * Tipos de ganho (cada tema tem um, ver data/ganhos.ts):
 *   dinheiro: base em reais por semana. Valor do dia = base / 7.
 *   tempo:    base em horas por dia.    Valor do dia = base.
 *   noites:   conta as noites em que a pessoa marcou que dormiu no horário.
 *   ondas:    conta as vezes em que usou o botão de vontade ou a respiração até o fim.
 *   nenhum:   sem cartão de ganhos (ex.: relação com a comida).
 *
 * Resposta do dia ("Como foi hoje com ...?"):
 *   livre (ou "Fiz")              soma 100% do valor do dia
 *   menos (ou "Fiz um pouco")     soma 50%
 *   sempre (ou "Não deu hoje")    soma 0
 * Dias sem resposta não contam. Nada é subtraído: tropeço não desconta e o total
 * só cresce conforme novos dias são respondidos.
 */

export type TipoGanho = 'dinheiro' | 'tempo' | 'noites' | 'ondas' | 'nenhum';
export type RespostaDia = 'livre' | 'menos' | 'sempre';

export const PESO_RESPOSTA: Record<RespostaDia, number> = { livre: 1, menos: 0.5, sempre: 0 };

export type ResultadoGanho = {
  tipo: TipoGanho;
  /** Reais (dinheiro), horas (tempo), noites ou ondas. */
  total: number;
  /** Valor de um dia livre: reais ou horas. Zero para noites e ondas. */
  valorDia: number;
  livres: number;
  menos: number;
  /** Dias que somaram alguma coisa (livres + menos). */
  diasContados: number;
};

export function valorDiario(tipo: TipoGanho, base: number): number {
  if (!(base > 0)) return 0;
  if (tipo === 'dinheiro') return base / 7;
  if (tipo === 'tempo') return base;
  return 0;
}

export function contarRespostas(registro: Record<string, RespostaDia>) {
  let livres = 0;
  let menos = 0;
  for (const r of Object.values(registro)) {
    if (r === 'livre') livres++;
    else if (r === 'menos') menos++;
  }
  return { livres, menos };
}

export function calcularGanho(
  tipo: TipoGanho,
  base: number | null,
  registro: Record<string, RespostaDia>,
  ondasAtravessadas: number,
): ResultadoGanho {
  const { livres, menos } = contarRespostas(registro);
  const comum = { tipo, livres, menos, diasContados: livres + menos };

  if (tipo === 'noites') return { ...comum, total: livres, valorDia: 0 };
  if (tipo === 'ondas') return { ...comum, total: Math.max(0, ondasAtravessadas), valorDia: 0 };
  if (tipo === 'nenhum') return { ...comum, total: 0, valorDia: 0 };

  const valorDia = valorDiario(tipo, base ?? 0);
  const total = Object.values(registro).reduce((soma, r) => soma + valorDia * PESO_RESPOSTA[r], 0);
  return { ...comum, total, valorDia };
}

// "R$ 1.234,56" (ou "R$ 1.235" sem centavos). Feito à mão para funcionar igual em qualquer aparelho.
export function formatarReais(valor: number, centavos = true): string {
  const casas = centavos ? 2 : 0;
  const [inteiro, decimal] = Math.max(0, valor).toFixed(casas).split('.');
  const milhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${milhar}${decimal ? `,${decimal}` : ''}`;
}

// "12h", "1h30" ou "40 min", arredondando para blocos de 10 minutos.
export function formatarHoras(horas: number): string {
  const minutos = Math.round((Math.max(0, horas) * 60) / 10) * 10;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

// Equivalência leve para o tempo recuperado. `sorteio` (0 a 1) escolhe uma delas, para variar a cada vez.
export function equivalenciaTempo(horas: number, sorteio: number): string | null {
  const opcoes: string[] = [];
  const filmes = Math.floor(horas / 2);
  const livros = Math.floor(horas / 5);
  const tardes = Math.floor(horas / 4);
  const caminhadas = Math.floor(horas / 0.5);
  if (filmes >= 1) opcoes.push(filmes === 1 ? 'dá uma sessão de filme' : `dá umas ${filmes} sessões de filme`);
  if (livros >= 1) opcoes.push(livros === 1 ? 'dá para ler um livro curto' : `dá para ler uns ${livros} livros curtos`);
  if (tardes >= 1) opcoes.push(tardes === 1 ? 'é uma tarde livre' : `são ${tardes} tardes livres`);
  if (opcoes.length === 0 && caminhadas >= 1) opcoes.push(caminhadas === 1 ? 'dá uma boa caminhada' : `dá ${caminhadas} caminhadas de meia hora`);
  if (opcoes.length === 0) return null;
  return opcoes[Math.min(opcoes.length - 1, Math.floor(sorteio * opcoes.length))];
}
