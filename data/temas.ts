// Temas que a pessoa pode escolher na ficha.
// Na tela eles aparecem misturados, sem separar em "vícios" e "hábitos".
// O campo `pesado` só é usado pela lógica de nível (lib/nivel.ts).

export type IdTema =
  | 'celular'
  | 'sono'
  | 'procrastinacao'
  | 'doce'
  | 'apostas'
  | 'alcool'
  | 'cigarro'
  | 'pornografia'
  | 'ansiedade'
  | 'outro';

export type Missao = { id: string; texto: string };

export type Tema = {
  id: IdTema;
  nome: string;
  pesado: boolean;
  /** Complemento usado na meta da semana: "2 dias ___" */
  livre: string;
  missoes: Missao[];
  /** Contador de ganhos reais (valores simulados no protótipo). */
  ganho: { rotulo: string; porDia: number; base: number; formato: 'reais' | 'horas' | 'numero'; unidade?: string };
};

export const TEMAS: Tema[] = [
  {
    id: 'celular',
    nome: 'Celular e redes sociais',
    pesado: false,
    livre: 'com o celular fora da cama',
    missoes: [
      { id: 'cel1', texto: 'Deixar o celular em outro cômodo por 1 hora' },
      { id: 'cel2', texto: 'Tirar as notificações de um app que puxa você' },
      { id: 'cel3', texto: 'Primeira meia hora do dia sem rede social' },
      { id: 'cel4', texto: 'Colocar a tela em preto e branco à noite' },
    ],
    ganho: { rotulo: 'de tela recuperadas', porDia: 1.5, base: 3, formato: 'horas' },
  },
  {
    id: 'sono',
    nome: 'Sono bagunçado',
    pesado: false,
    livre: 'deitando no horário combinado',
    missoes: [
      { id: 'son1', texto: 'Escolher um horário para deitar e anotar' },
      { id: 'son2', texto: 'Desligar telas 30 minutos antes de dormir' },
      { id: 'son3', texto: 'Café só até as 15h hoje' },
      { id: 'son4', texto: 'Abrir a janela e pegar luz logo ao acordar' },
    ],
    ganho: { rotulo: 'de sono a mais na semana', porDia: 0.8, base: 2, formato: 'horas' },
  },
  {
    id: 'procrastinacao',
    nome: 'Procrastinação',
    pesado: false,
    livre: 'começando a tarefa principal antes do almoço',
    missoes: [
      { id: 'pro1', texto: 'Fazer 10 minutos da tarefa que você está adiando' },
      { id: 'pro2', texto: 'Escrever as 3 coisas mais importantes do dia' },
      { id: 'pro3', texto: 'Dividir uma tarefa grande em passos pequenos' },
      { id: 'pro4', texto: 'Trabalhar 25 minutos com o celular longe' },
    ],
    ganho: { rotulo: 'tarefas destravadas', porDia: 2, base: 4, formato: 'numero' },
  },
  {
    id: 'doce',
    nome: 'Doce e comida por impulso',
    pesado: false,
    livre: 'sem comer por impulso',
    missoes: [
      { id: 'doc1', texto: 'Beber um copo de água antes de beliscar' },
      { id: 'doc2', texto: 'Comer sentado, sem tela, em uma refeição' },
      { id: 'doc3', texto: 'Deixar uma fruta à vista para a hora da vontade' },
      { id: 'doc4', texto: 'Esperar 10 minutos quando a vontade bater' },
    ],
    ganho: { rotulo: 'que ficaram com você', porDia: 9, base: 18, formato: 'reais' },
  },
  {
    id: 'apostas',
    nome: 'Apostas',
    pesado: true,
    livre: 'sem apostar',
    missoes: [
      { id: 'apo1', texto: 'Sair de um grupo ou canal de palpites' },
      { id: 'apo2', texto: 'Ativar o limite de depósito ou a autoexclusão em um site' },
      { id: 'apo3', texto: 'Anotar quanto dinheiro ficou com você hoje' },
      { id: 'apo4', texto: 'Ver um jogo sem abrir nenhum app de aposta' },
    ],
    ganho: { rotulo: 'que deixaram de ir para as apostas', porDia: 85, base: 170, formato: 'reais' },
  },
  {
    id: 'alcool',
    nome: 'Álcool',
    pesado: true,
    livre: 'sem beber',
    missoes: [
      { id: 'alc1', texto: 'Alternar cada bebida com um copo de água' },
      { id: 'alc2', texto: 'Combinar um limite antes de sair e contar para alguém' },
      { id: 'alc3', texto: 'Trocar o drink do fim do dia por uma bebida sem álcool' },
      { id: 'alc4', texto: 'Anotar como você dormiu e acordou hoje' },
    ],
    ganho: { rotulo: 'que ficaram com você', porDia: 30, base: 60, formato: 'reais' },
  },
  {
    id: 'cigarro',
    nome: 'Cigarro ou vape',
    pesado: true,
    livre: 'sem fumar ou vapear',
    missoes: [
      { id: 'cig1', texto: 'Adiar o primeiro do dia em 30 minutos' },
      { id: 'cig2', texto: 'Tirar isqueiro e vape do bolso por uma tarde' },
      { id: 'cig3', texto: 'Na vontade, beber água gelada bem devagar' },
      { id: 'cig4', texto: 'Caminhar 5 minutos no lugar da pausa para fumar' },
    ],
    ganho: { rotulo: 'que ficaram com você', porDia: 16, base: 32, formato: 'reais' },
  },
  {
    id: 'pornografia',
    nome: 'Pornografia',
    pesado: true,
    livre: 'no rumo que você escolheu',
    missoes: [
      { id: 'por1', texto: 'Ativar um filtro de conteúdo no celular' },
      { id: 'por2', texto: 'Deixar o celular fora do quarto na hora de dormir' },
      { id: 'por3', texto: 'Na vontade, levantar e mudar de cômodo' },
      { id: 'por4', texto: 'Anotar a hora e o lugar em que a vontade apareceu' },
    ],
    ganho: { rotulo: 'de volta para você', porDia: 1, base: 2, formato: 'horas' },
  },
  {
    id: 'ansiedade',
    nome: 'Ansiedade',
    pesado: false,
    livre: 'com uma pausa de respiração',
    missoes: [
      { id: 'ans1', texto: 'Fazer uma respiração 4, 4, 6 por 2 minutos' },
      { id: 'ans2', texto: 'Escrever uma preocupação e o que está no seu controle' },
      { id: 'ans3', texto: 'Caminhar 10 minutos olhando ao redor' },
      { id: 'ans4', texto: 'Contar 5 coisas que você vê e 4 que você ouve' },
    ],
    ganho: { rotulo: 'pausas de calma feitas', porDia: 2, base: 3, formato: 'numero' },
  },
  {
    id: 'outro',
    nome: 'Outro',
    pesado: false,
    livre: 'no rumo que você escolheu',
    missoes: [
      { id: 'out1', texto: 'Anotar quando o hábito apareceu hoje' },
      { id: 'out2', texto: 'Trocar o hábito por uma pausa de 5 minutos uma vez' },
      { id: 'out3', texto: 'Contar para alguém de confiança o que você está cuidando' },
      { id: 'out4', texto: 'Escrever o que você ganha cuidando disso' },
    ],
    ganho: { rotulo: 'vitórias pequenas', porDia: 2, base: 2, formato: 'numero' },
  },
];

export function temaPorId(id: IdTema | undefined): Tema {
  return TEMAS.find((t) => t.id === id) ?? TEMAS[TEMAS.length - 1];
}
