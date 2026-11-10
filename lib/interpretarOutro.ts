/*
 * INTERPRETAR O TEXTO DO "OUTRO"
 * ------------------------------------------------------------------
 * Recebe o que a pessoa escreveu e devolve o que fazer com isso:
 *   - risco:          frase ligada a se machucar ou não querer viver (data/risco.ts). Vai para o Apoio.
 *   - tema_existente: bate com um tema da lista principal (ex.: "tigrinho" vira Apostas).
 *   - novo_tema:      bate com um tema novo fora da lista (ex.: "videogame" vira Jogos), ou, sem temaId,
 *                     não foi reconhecido e segue para o tema personalizado (3 perguntas).
 *
 * PREPARADO PARA IA
 * O resto do app só conhece a função interpretarOutro() e o tipo Interpretacao. Hoje quem responde é o
 * dicionário (data/sinonimos.ts). Para trocar por uma classificação com IA, basta criar outro objeto que
 * siga a interface Interpretador e apontar `interpretadorAtivo` para ele. A função já é assíncrona por
 * isso: uma chamada de rede encaixa sem mudar a ficha. A checagem de risco deve continuar acontecendo
 * antes, no próprio aparelho, mesmo com IA.
 */

import { TERMOS_RISCO } from '@/data/risco';
import { SINONIMOS } from '@/data/sinonimos';
import { IdTema, temaPorId } from '@/data/temas';

export type Interpretacao = {
  tipo: 'tema_existente' | 'novo_tema' | 'risco';
  temaId?: IdTema;
  /** 0 a 1. Termo específico encontrado: alto. Só termos genéricos: médio. Nada: 0. */
  confianca: number;
};

export interface Interpretador {
  interpretar(texto: string): Promise<Interpretacao>;
}

// Minúsculas, sem acento, sem pontuação e com espaços simples.
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Procura o termo como palavra inteira (ou começo de palavra, se terminar em *).
function contem(textoNormal: string, termo: string): boolean {
  const prefixo = termo.endsWith('*');
  const base = prefixo ? termo.slice(0, -1) : termo;
  const escapado = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|\\s)${escapado}${prefixo ? '' : '(\\s|$)'}`);
  return re.test(textoNormal);
}

export function temRisco(texto: string): boolean {
  const t = normalizar(texto);
  return TERMOS_RISCO.some((termo) => contem(t, termo));
}

export const interpretadorDicionario: Interpretador = {
  async interpretar(texto) {
    if (temRisco(texto)) return { tipo: 'risco', confianca: 1 };

    const t = normalizar(texto);
    let melhor: { tema: IdTema; peso: number; forte: boolean } | null = null;

    for (const [tema, termos] of Object.entries(SINONIMOS) as [IdTema, string[]][]) {
      let peso = 0;
      let forte = false;
      for (const bruto of termos) {
        const fraco = bruto.startsWith('~');
        const termo = fraco ? bruto.slice(1) : bruto;
        if (!contem(t, termo)) continue;
        // Termos específicos pesam o triplo; termos longos pesam mais que curtos.
        peso += termo.replace('*', '').length * (fraco ? 1 : 3);
        if (!fraco) forte = true;
      }
      if (peso > 0 && (!melhor || peso > melhor.peso)) melhor = { tema, peso, forte };
    }

    if (!melhor) return { tipo: 'novo_tema', confianca: 0 };
    return {
      tipo: temaPorId(melhor.tema).principal ? 'tema_existente' : 'novo_tema',
      temaId: melhor.tema,
      confianca: melhor.forte ? 0.9 : 0.6,
    };
  },
};

// Troque aqui por um interpretador com IA no futuro.
const interpretadorAtivo: Interpretador = interpretadorDicionario;

export function interpretarOutro(texto: string): Promise<Interpretacao> {
  return interpretadorAtivo.interpretar(texto);
}
