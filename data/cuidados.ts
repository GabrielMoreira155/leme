// "O que quer cuidar": cada opção traz uma missão de hábito bom,
// usada como ferramenta de troca no plano.

export type IdCuidado = 'sono' | 'foco' | 'relacoes' | 'autoestima' | 'dinheiro' | 'corpo';

export type Cuidado = {
  id: IdCuidado;
  nome: string;
  /** Como aparece no "porquê" durante a fissura. */
  porque: string;
  missao: { id: string; texto: string };
};

export const CUIDADOS: Cuidado[] = [
  {
    id: 'sono',
    nome: 'Dormir melhor',
    porque: 'acordar com mais descanso',
    missao: { id: 'cui-sono', texto: 'Preparar o quarto para dormir: luz baixa e celular longe' },
  },
  {
    id: 'foco',
    nome: 'Foco',
    porque: 'ter a cabeça no que importa',
    missao: { id: 'cui-foco', texto: 'Fazer uma coisa de cada vez por 20 minutos' },
  },
  {
    id: 'relacoes',
    nome: 'Relações',
    porque: 'estar presente com quem você gosta',
    missao: { id: 'cui-rel', texto: 'Mandar mensagem ou ligar para alguém de quem você gosta' },
  },
  {
    id: 'autoestima',
    nome: 'Autoestima',
    porque: 'gostar de quem você está se tornando',
    missao: { id: 'cui-auto', texto: 'Anotar uma coisa que você fez bem hoje' },
  },
  {
    id: 'dinheiro',
    nome: 'Dinheiro',
    porque: 'ter dinheiro sobrando para seus planos',
    missao: { id: 'cui-din', texto: 'Anotar um gasto de hoje e se valeu a pena' },
  },
  {
    id: 'corpo',
    nome: 'Corpo e energia',
    porque: 'ter energia no corpo',
    missao: { id: 'cui-corpo', texto: 'Mexer o corpo por 15 minutos, do jeito que der' },
  },
];

export function cuidadoPorId(id: IdCuidado | undefined): Cuidado {
  return CUIDADOS.find((c) => c.id === id) ?? CUIDADOS[0];
}
