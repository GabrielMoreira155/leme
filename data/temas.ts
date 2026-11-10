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
  | 'outro'
  // Temas fora da lista principal, reconhecidos a partir do texto do "Outro"
  | 'jogos'
  | 'compras'
  | 'unha'
  | 'cafe'
  | 'series'
  | 'substancias'
  | 'alimentacao'
  // Montado na hora a partir das 3 perguntas do tema personalizado (ver lib/tema.ts)
  | 'personalizado';

export type Missao = { id: string; texto: string };

export type Tema = {
  id: IdTema;
  nome: string;
  /** Usado nos textos gerados: "Como foi hoje com {nomeCurto}?" */
  nomeCurto: string;
  pesado: boolean;
  /** Aparece na lista do passo "O que mais pesa hoje?" */
  principal?: boolean;
  /** Ignora a regra de frequência e impacto (ex.: substâncias, relação com a comida). */
  nivelFixo?: 'leve' | 'moderado' | 'pesado';
  /** Sem metas de dias livres e sem cartão de ganhos: só cuidado, artigos e psicólogo. */
  semMetas?: boolean;
  /** Personalizado de "fazer mais": metas positivas em vez de dias livres. */
  fazerMais?: boolean;
  /** Complemento usado na meta da semana: "2 dias ___" */
  livre: string;
  missoes: Missao[];
  /** Contador de ganhos reais (valores simulados no protótipo). */
  ganho?: { rotulo: string; porDia: number; base: number; formato: 'reais' | 'horas' | 'numero'; unidade?: string };
};

export const TEMAS: Tema[] = [
  {
    id: 'celular',
    nomeCurto: 'o celular',
    principal: true,
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
    nomeCurto: 'o sono',
    principal: true,
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
    nomeCurto: 'a procrastinação',
    principal: true,
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
    nomeCurto: 'o doce e a comida por impulso',
    principal: true,
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
    nomeCurto: 'as apostas',
    principal: true,
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
    nomeCurto: 'o álcool',
    principal: true,
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
    nomeCurto: 'o cigarro ou vape',
    principal: true,
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
    nomeCurto: 'a pornografia',
    principal: true,
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
    nomeCurto: 'a ansiedade',
    principal: true,
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
    nomeCurto: 'esse hábito',
    principal: true,
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
  // Temas que não aparecem na lista, mas o "Outro" reconhece pelo texto (data/sinonimos.ts).
  {
    id: 'jogos',
    nome: 'Jogos e videogame',
    nomeCurto: 'os jogos',
    pesado: false,
    livre: 'sem passar do horário combinado no jogo',
    missoes: [
      { id: 'jog1', texto: 'Combinar um horário para desligar o jogo hoje' },
      { id: 'jog2', texto: 'Jogar só depois de terminar uma tarefa do dia' },
      { id: 'jog3', texto: 'Fazer uma pausa de 10 minutos a cada hora de jogo' },
      { id: 'jog4', texto: 'Deixar o controle ou o celular fora do quarto na hora de dormir' },
    ],
  },
  {
    id: 'compras',
    nome: 'Compras por impulso',
    nomeCurto: 'as compras por impulso',
    pesado: false,
    livre: 'sem compras por impulso',
    missoes: [
      { id: 'com1', texto: 'Esperar 24 horas antes de finalizar uma compra' },
      { id: 'com2', texto: 'Tirar o cartão salvo de um app de compras' },
      { id: 'com3', texto: 'Desligar as notificações de promoção' },
      { id: 'com4', texto: 'Anotar uma compra que você deixou de fazer hoje' },
    ],
  },
  {
    id: 'unha',
    nome: 'Roer unha ou mexer na pele',
    nomeCurto: 'roer unha ou mexer na pele',
    pesado: false,
    livre: 'sem roer unha ou mexer na pele',
    missoes: [
      { id: 'unh1', texto: 'Deixar algo para ocupar as mãos por perto' },
      { id: 'unh2', texto: 'Anotar em que momento a vontade apareceu' },
      { id: 'unh3', texto: 'Cuidar das mãos ou da pele com um creme hoje' },
      { id: 'unh4', texto: 'Na vontade, fechar as mãos e respirar 3 vezes' },
    ],
  },
  {
    id: 'cafe',
    nome: 'Café ou energético em excesso',
    nomeCurto: 'o café ou energético',
    pesado: false,
    livre: 'só com a dose combinada',
    missoes: [
      { id: 'caf1', texto: 'Trocar uma dose por água ou chá' },
      { id: 'caf2', texto: 'Nada de café ou energético depois das 15h' },
      { id: 'caf3', texto: 'Anotar quantas doses você tomou hoje' },
      { id: 'caf4', texto: 'Fazer uma pausa de 5 minutos no lugar de mais uma dose' },
    ],
  },
  {
    id: 'series',
    nome: 'Séries e maratonas',
    nomeCurto: 'as séries',
    pesado: false,
    livre: 'sem maratonar',
    missoes: [
      { id: 'ser1', texto: 'Desligar o próximo episódio automático do streaming' },
      { id: 'ser2', texto: 'Combinar quantos episódios antes de começar' },
      { id: 'ser3', texto: 'Parar no meio de um episódio, e não no final' },
      { id: 'ser4', texto: 'Desligar a tela 30 minutos antes de dormir' },
    ],
  },
  // Substâncias ilícitas: nível pesado, convite ao psicólogo e só missões genéricas de cuidado
  // (gatilhos, rotina, rede de apoio). Nenhuma missão cita a substância.
  {
    id: 'substancias',
    nome: 'Uso de substâncias',
    nomeCurto: 'esse hábito',
    pesado: true,
    nivelFixo: 'pesado',
    livre: 'no rumo que você escolheu',
    missoes: [
      { id: 'sub1', texto: 'Anotar o que veio antes da vontade hoje' },
      { id: 'sub2', texto: 'Manter um horário parecido para dormir e acordar hoje' },
      { id: 'sub3', texto: 'Mandar mensagem para alguém da sua rede de apoio' },
      { id: 'sub4', texto: 'Planejar o que fazer na próxima hora difícil' },
    ],
  },
  // Relação com a comida (vomitar, ficar sem comer, compulsão): sem metas de dias livres e sem
  // cartão de ganhos. Encaminha para o psicólogo e oferece só missões de cuidado e artigos.
  {
    id: 'alimentacao',
    nome: 'Relação com a comida',
    nomeCurto: 'a relação com a comida',
    pesado: true,
    nivelFixo: 'pesado',
    semMetas: true,
    livre: 'com cuidado',
    missoes: [
      { id: 'ali1', texto: 'Fazer uma refeição com calma, sem tela' },
      { id: 'ali2', texto: 'Anotar como você se sentiu antes de comer hoje' },
      { id: 'ali3', texto: 'Contar para alguém de confiança como está o seu dia' },
      { id: 'ali4', texto: 'Ler um artigo do Leme com calma' },
    ],
  },
];

export const TEMAS_PRINCIPAIS = TEMAS.filter((t) => t.principal);

export function temaPorId(id: IdTema | undefined): Tema {
  return TEMAS.find((t) => t.id === id) ?? TEMAS.find((t) => t.id === 'outro')!;
}
