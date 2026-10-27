// Psicólogos fictícios do protótipo. Nomes e CRPs são placeholders.
// Regra de texto: "atende hábitos e vícios", nunca "especialista" sem título registrado.

export type Psicologo = {
  id: string;
  nome: string;
  crp: string;
  abordagem: string;
  descricao: string;
  horarios: string[];
};

export const PSICOLOGOS: Psicologo[] = [
  {
    id: 'helena',
    nome: 'Helena Prado',
    crp: 'CRP [a definir]',
    abordagem: 'Terapia cognitivo comportamental',
    descricao: 'Atende hábitos e vícios. Acolhe adultos e jovens a partir de 16 anos.',
    horarios: ['Seg 19h', 'Qua 18h', 'Sex 12h'],
  },
  {
    id: 'rafael',
    nome: 'Rafael Nunes',
    crp: 'CRP [a definir]',
    abordagem: 'Entrevista motivacional',
    descricao: 'Atende hábitos e vícios, com foco em apostas e uso de álcool.',
    horarios: ['Ter 20h', 'Qui 19h', 'Sáb 10h'],
  },
  {
    id: 'marina',
    nome: 'Marina Costa',
    crp: 'CRP [a definir]',
    abordagem: 'Terapia de aceitação e compromisso',
    descricao: 'Atende hábitos e vícios. Experiência com ansiedade e sono.',
    horarios: ['Seg 12h', 'Qua 20h', 'Qui 8h'],
  },
  {
    id: 'joao',
    nome: 'João Teixeira',
    crp: 'CRP [a definir]',
    abordagem: 'Terapia cognitivo comportamental',
    descricao: 'Atende hábitos e vícios. Experiência com uso de telas e jogos.',
    horarios: ['Ter 7h', 'Qui 21h', 'Sex 18h'],
  },
  {
    id: 'bianca',
    nome: 'Bianca Rocha',
    crp: 'CRP [a definir]',
    abordagem: 'Psicanálise',
    descricao: 'Atende hábitos e vícios. Acolhe adultos.',
    horarios: ['Seg 17h', 'Sex 9h'],
  },
];

export type Grupo = { id: string; tema: string; quando: string; vagas: number };

// Rodas anônimas com psicólogo, 8 a 12 pessoas, preço social.
export const GRUPOS: Grupo[] = [
  { id: 'g-apostas', tema: 'Apostas e dinheiro', quando: 'Terças, 20h', vagas: 3 },
  { id: 'g-telas', tema: 'Celular, redes e sono', quando: 'Quartas, 19h', vagas: 5 },
  { id: 'g-alcool', tema: 'Álcool e noites', quando: 'Quintas, 20h', vagas: 2 },
  { id: 'g-ansiedade', tema: 'Ansiedade e impulsos', quando: 'Sábados, 10h', vagas: 6 },
];

export const PLANOS_SESSOES = [
  { id: 'p4', sessoes: 4, descricao: 'Uma conversa por semana' },
  { id: 'p6', sessoes: 6, descricao: 'Para fases mais puxadas' },
  { id: 'p10', sessoes: 10, descricao: 'Acompanhamento mais próximo' },
];
