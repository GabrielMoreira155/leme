// "O que quer cuidar": cada opção traz uma missão de hábito bom,
// usada como ferramenta de troca no plano.

export type IdCuidado =
  | 'sono'
  | 'foco'
  | 'relacoes'
  | 'autoestima'
  | 'dinheiro'
  | 'corpo'
  | 'calma'
  | 'trabalho'
  | 'familia'
  | 'amizades'
  | 'lazer'
  | 'casa'
  | 'proposito'
  // Escrito pela pessoa, com as palavras dela (ver cuidadoLivre)
  | 'livre';

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
  {
    id: 'calma',
    nome: 'Mais calma no dia a dia',
    porque: 'ter mais calma no dia a dia',
    missao: { id: 'cui-calma', texto: 'Fazer 2 minutos de respiração devagar, sem pressa' },
  },
  {
    id: 'trabalho',
    nome: 'Trabalho e estudos',
    porque: 'render melhor no trabalho e nos estudos',
    missao: { id: 'cui-trab', texto: 'Terminar uma tarefa pequena que estava parada' },
  },
  {
    id: 'familia',
    nome: 'Família',
    porque: 'estar bem com a sua família',
    missao: { id: 'cui-fam', texto: 'Ter uma conversa ou refeição com alguém da família, sem celular' },
  },
  {
    id: 'amizades',
    nome: 'Amizades e vida social',
    porque: 'estar mais perto dos amigos',
    missao: { id: 'cui-ami', texto: 'Combinar um encontro ou uma chamada com um amigo' },
  },
  {
    id: 'lazer',
    nome: 'Tempo livre e lazer',
    porque: 'ter tempo para o que você gosta',
    missao: { id: 'cui-lazer', texto: 'Reservar 20 minutos para algo que você gosta de fazer' },
  },
  {
    id: 'casa',
    nome: 'Casa e organização',
    porque: 'ter um canto organizado e tranquilo',
    missao: { id: 'cui-casa', texto: 'Organizar um cantinho da casa por 10 minutos' },
  },
  {
    id: 'proposito',
    nome: 'Sentido e propósito',
    porque: 'sentir que a vida vai na direção que você quer',
    missao: { id: 'cui-prop', texto: 'Escrever uma coisa que dá sentido aos seus dias' },
  },
];

export const LIMITE_CUIDADO_LIVRE = 60;

// "O que você quer cuidar", com as palavras da pessoa. Vira o porquê e uma missão de passo pequeno.
export function cuidadoLivre(texto: string): Cuidado {
  const t = texto.trim();
  const minusculo = t.charAt(0).toLowerCase() + t.slice(1);
  return {
    id: 'livre',
    nome: t,
    porque: minusculo,
    missao: { id: 'cui-livre', texto: `Dar um passo pequeno hoje por: ${minusculo}` },
  };
}

export function cuidadoPorId(id: IdCuidado | undefined): Cuidado {
  return CUIDADOS.find((c) => c.id === id) ?? CUIDADOS[0];
}
