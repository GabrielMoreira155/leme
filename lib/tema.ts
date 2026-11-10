// Tema efetivo da ficha. Para temas da lista (ou reconhecidos pelo "Outro"), é o tema do catálogo.
// Para o tema personalizado, é montado aqui a partir das 3 perguntas: missões por momento,
// direção (diminuir ou fazer mais) e o que mais pesa. A pessoa nunca cria metas.

import { Cuidado, cuidadoLivre, cuidadoPorId, IdCuidado } from '@/data/cuidados';
import { MISSOES_GENERICAS, MISSOES_POR_MOMENTO } from '@/data/personalizado';
import { MomentoDificil, Tema, temaPorId } from '@/data/temas';
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

const MOMENTO_VONTADE: MomentoDificil = {
  botao: 'Estou com vontade agora',
  sub: 'Uns minutos para atravessar a onda. Não gasta energia.',
  titulo: 'Vamos atravessar essa onda juntos',
  texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
  fim: 'Você atravessou essa onda',
};

const MOMENTO_EMPURRAO: MomentoDificil = {
  botao: 'Preciso de um empurrão agora',
  sub: 'Uns minutos para respirar e começar pelo passo menor. Não gasta energia.',
  titulo: 'Vamos começar juntos',
  texto: 'Primeiro respirar, depois lembrar por que isso importa para você e escolher um passo bem pequeno.',
  fim: 'Você deu o primeiro passo',
};

// Textos do botão de momento difícil e da sequência que ele abre, na língua de cada questão.
// No modo discreto, o botão volta ao texto neutro para não expor o tema na tela.
export function momentoDoTema(tema: Pick<Tema, 'id' | 'fazerMais' | 'momento'> | null, discreto = false): MomentoDificil {
  const base = tema?.momento ?? (tema?.id === 'personalizado' && tema.fazerMais ? MOMENTO_EMPURRAO : MOMENTO_VONTADE);
  if (!discreto) return base;
  return { ...base, botao: 'Preciso de uma pausa agora', sub: 'Uns minutos para respirar. Não gasta energia.' };
}

// Cuidado escolhido na ficha. "livre" usa o texto que a pessoa escreveu.
export function cuidadoDaFicha(ficha: Pick<Ficha, 'cuidarTexto'>, id: IdCuidado): Cuidado {
  if (id === 'livre' && ficha.cuidarTexto?.trim()) return cuidadoLivre(ficha.cuidarTexto);
  return cuidadoPorId(id);
}

// Texto que a pessoa escreveu, para exibir como "Foco: ...".
export function focoDaFicha(ficha: Pick<Ficha, 'textoOutro'>): string | null {
  const t = ficha.textoOutro?.trim();
  return t ? t : null;
}
