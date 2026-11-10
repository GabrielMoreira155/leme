/*
 * CLASSIFICAÇÃO DE NÍVEL (PROVISÓRIA)
 * ------------------------------------------------------------------
 * Para revisão do psicólogo responsável.
 *
 * Esta regra é um rascunho de produto feito só para o protótipo.
 * Ela NÃO é um instrumento clínico e não deve ser usada para decidir
 * nada sobre a saúde de ninguém.
 *
 * A versão real vai trocar esta lógica por questionários de triagem
 * validados no Brasil, escolhidos pelo psicólogo responsável. Exemplos
 * em discussão: AUDIT para álcool, PGSI para apostas, Fagerström para
 * tabaco e escalas específicas para uso de internet e pornografia.
 *
 * O nível NÃO aparece como rótulo para a pessoa. Ele só ajusta o plano:
 *  - leve:      sessões ficam discretas, foco em missões e artigos
 *  - moderado:  plano padrão, sessões visíveis
 *  - pesado:    convite para conversar com um psicólogo já aparece no plano
 */

import type { Tema } from '@/data/temas';

export type Frequencia = 'varias-dia' | 'quase-todo-dia' | 'algumas-semana' | 'fases';
export type Impacto = 'nao' | 'pouco' | 'bastante';
export type Nivel = 'leve' | 'moderado' | 'pesado';

// Frequência alta = várias vezes ao dia ou quase todo dia.
export function frequenciaAlta(f: Frequencia): boolean {
  return f === 'varias-dia' || f === 'quase-todo-dia';
}

export function classificarNivel(tema: Pick<Tema, 'pesado' | 'nivelFixo'>, frequencia: Frequencia, impacto: Impacto): Nivel {
  // Alguns temas têm nível fixo, sem olhar frequência e impacto:
  // substâncias ilícitas e relação com a comida são sempre "pesado".
  if (tema.nivelFixo) return tema.nivelFixo;
  // Temas pesados no protótipo: apostas, álcool, cigarro ou vape, pornografia.
  // O tema personalizado segue a regra dos temas leves.
  const pesado = tema.pesado;
  const alta = frequenciaAlta(frequencia);

  if (pesado) {
    // Pesado: tema pesado com frequência alta, ou com impacto médio ("um pouco") ou alto ("bastante").
    if (alta || impacto === 'pouco' || impacto === 'bastante') return 'pesado';
    // Moderado: tema pesado com impacto baixo ("não") e frequência baixa.
    return 'moderado';
  }

  // Tema leve.
  // Moderado: frequência alta OU impacto "bastante".
  if (alta || impacto === 'bastante') return 'moderado';
  // Leve: impacto baixo ("não") ou médio ("um pouco") com frequência baixa.
  return 'leve';
}

// Nome de rota mostrado para a pessoa (sem rótulo clínico).
export const NOME_ROTA: Record<Nivel, string> = {
  leve: 'Rota costeira',
  moderado: 'Rota de mar aberto',
  pesado: 'Rota com tripulação',
};

export const DESCRICAO_ROTA: Record<Nivel, string> = {
  leve: 'Passos leves e constantes, perto da costa.',
  moderado: 'Um pouco mais de estrutura para atravessar as ondas.',
  pesado: 'Mais apoio por perto. Ninguém precisa navegar sozinho.',
};
