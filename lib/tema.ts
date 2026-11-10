// Tema efetivo da ficha. Para temas da lista (ou reconhecidos pelo "Outro"), é o tema do catálogo.
// Para o tema personalizado, é montado aqui a partir das 3 perguntas: missões por momento,
// direção (diminuir ou fazer mais) e o que mais pesa. A pessoa nunca cria metas.

import { MISSOES_GENERICAS, MISSOES_POR_MOMENTO } from '@/data/personalizado';
import { Tema, temaPorId } from '@/data/temas';
import type { Ficha } from './plano';

export function temaDaFicha(ficha: Pick<Ficha, 'tema' | 'personalizado'>): Tema {
  if (ficha.tema !== 'personalizado' || !ficha.personalizado) return temaPorId(ficha.tema);

  const { direcao, momentos } = ficha.personalizado;
  const porMomento = momentos.slice(0, 2).map((m) => MISSOES_POR_MOMENTO[direcao][m]);
  const missoes = [...porMomento, ...MISSOES_GENERICAS[direcao]].slice(0, 4);

  return {
    id: 'personalizado',
    nome: 'Esse hábito',
    nomeCurto: 'esse hábito',
    pesado: false,
    fazerMais: direcao === 'fazer-mais',
    livre: 'livres desse hábito',
    missoes,
  };
}

// Texto que a pessoa escreveu, para exibir como "Foco: ...".
export function focoDaFicha(ficha: Pick<Ficha, 'textoOutro'>): string | null {
  const t = ficha.textoOutro?.trim();
  return t ? t : null;
}
