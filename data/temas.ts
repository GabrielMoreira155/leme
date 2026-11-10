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
  // Questões emocionais (cuidado, metas positivas)
  | 'autoestima'
  | 'tristeza'
  | 'raiva'
  | 'solidao'
  // Montado na hora a partir das 3 perguntas do tema personalizado (ver lib/tema.ts)
  | 'personalizado';

export type Missao = { id: string; texto: string };

// Textos do momento difícil: o botão da tela Hoje ("Estou com vontade agora") e a sequência que ele abre.
// Cada tema fala a língua da sua questão. Sem `momento`, vale o texto padrão de vontade (lib/tema.ts).
export type MomentoDificil = {
  /** Texto do botão grande da tela Hoje. */
  botao: string;
  /** Linha de apoio do botão. */
  sub: string;
  /** Título da primeira tela da sequência. */
  titulo: string;
  /** Explicação da primeira tela. */
  texto: string;
  /** Título da tela final. */
  fim: string;
};

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
  /** Metas positivas em vez de dias livres (personalizado de "fazer mais" e questões emocionais). */
  fazerMais?: boolean;
  /** Ação das metas positivas: "{acao} em 3 dias da semana". Padrão: "Fazer isso". */
  acao?: string;
  /** Pergunta do dia própria. Padrão: "Como foi hoje com {nomeCurto}?" */
  perguntaDia?: string;
  /** Rótulos próprios para a resposta do dia: [100%, 50%, 0]. */
  respostasDia?: [string, string, string];
  /** Convite para o psicólogo sempre no plano, qualquer que seja o nível. */
  conviteSempre?: boolean;
  /** Com legenda própria, o ganho do tipo ondas conta "momentos": "3 momentos {legendaOndas}". */
  legendaOndas?: string;
  momento?: MomentoDificil;
  /** Complemento usado na meta da semana: "2 dias ___" */
  livre: string;
  missoes: Missao[];
  // O tipo de ganho de cada tema fica em data/ganhos.ts.
};

export const TEMAS: Tema[] = [
  {
    id: 'celular',
    momento: {
      botao: 'Não consigo largar o celular agora',
      sub: 'Uns minutos para respirar e soltar a tela. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
  },
  {
    id: 'sono',
    momento: {
      botao: 'Não consigo dormir agora',
      sub: 'Uns minutos de respiração lenta para o corpo desacelerar. Não gasta energia.',
      titulo: 'Vamos desacelerar juntos',
      texto: 'Deite ou sente de um jeito confortável. A respiração lenta avisa o corpo que dá para descansar.',
      fim: 'Corpo mais calmo agora',
    },
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
  },
  {
    id: 'procrastinacao',
    momento: {
      botao: 'Travei agora',
      sub: 'Uns minutos para respirar e dar o primeiro passo pequeno. Não gasta energia.',
      titulo: 'Vamos destravar juntos',
      texto: 'Primeiro respirar, depois lembrar por que isso importa e escolher um passo de 2 minutos.',
      fim: 'Você saiu do lugar',
    },
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
  },
  {
    id: 'doce',
    momento: {
      botao: 'Bateu vontade de beliscar agora',
      sub: 'Uns minutos para ver se é fome ou impulso. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
  },
  {
    id: 'apostas',
    momento: {
      botao: 'Bateu vontade de apostar agora',
      sub: 'Uns minutos para a onda passar antes de qualquer aposta. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
  },
  {
    id: 'alcool',
    momento: {
      botao: 'Bateu vontade de beber agora',
      sub: 'Uns minutos para atravessar a onda. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
  },
  {
    id: 'cigarro',
    momento: {
      botao: 'Bateu vontade de fumar agora',
      sub: 'Uns minutos para atravessar a onda. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
  },
  {
    id: 'ansiedade',
    momento: {
      botao: 'A ansiedade apertou agora',
      sub: 'Uns minutos de respiração para o corpo baixar o volume. Não gasta energia.',
      titulo: 'Vamos baixar o volume juntos',
      texto: 'A ansiedade sobe e desce como onda. Respirando devagar, o corpo entende que está seguro.',
      fim: 'Você atravessou esse aperto',
    },
    legendaOndas: 'de ansiedade atravessados',
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
  },
  // Temas que não aparecem na lista, mas o "Outro" reconhece pelo texto (data/sinonimos.ts).
  {
    id: 'jogos',
    momento: {
      botao: 'Bateu vontade de jogar agora',
      sub: 'Uns minutos antes de abrir o jogo. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
    momento: {
      botao: 'Bateu vontade de comprar agora',
      sub: 'Uns minutos antes de finalizar qualquer compra. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
    momento: {
      botao: 'Bateu vontade de mexer nas unhas agora',
      sub: 'Uns minutos para ocupar as mãos e respirar. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
    momento: {
      botao: 'Bateu vontade de mais uma dose agora',
      sub: 'Uns minutos para ver se é cansaço ou costume. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
    momento: {
      botao: 'Bateu vontade de maratonar agora',
      sub: 'Uns minutos antes do próximo episódio. Não gasta energia.',
      titulo: 'Vamos atravessar essa onda juntos',
      texto: 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.',
      fim: 'Você atravessou essa onda',
    },
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
  // Questões emocionais: o plano é de cuidado, com metas positivas e convite ao psicólogo quando faz sentido.
  {
    id: 'autoestima',
    nome: 'Autoestima',
    nomeCurto: 'a autoestima',
    pesado: false,
    fazerMais: true,
    acao: 'Ter um gesto de cuidado consigo',
    perguntaDia: 'Hoje você conseguiu se tratar com gentileza?',
    respostasDia: ['Consegui', 'Um pouco', 'Hoje não'],
    legendaOndas: 'difíceis atravessados com gentileza',
    livre: 'com um gesto de cuidado consigo',
    momento: {
      botao: 'Estou me sentindo pra baixo agora',
      sub: 'Uns minutos para respirar e se tratar com gentileza. Não gasta energia.',
      titulo: 'Vamos passar por esse momento juntos',
      texto: 'Pensamentos duros sobre você sobem e descem como onda. Respire, lembre do que importa e fale consigo como falaria com alguém de quem gosta.',
      fim: 'Você cuidou de você agora',
    },
    missoes: [
      { id: 'aut1', texto: 'Escrever 3 coisas que você fez bem hoje, mesmo pequenas' },
      { id: 'aut2', texto: 'Falar consigo como falaria com alguém de quem você gosta, uma vez hoje' },
      { id: 'aut3', texto: 'Silenciar por um dia um perfil que faz você se comparar' },
      { id: 'aut4', texto: 'Fazer uma coisa só porque você gosta' },
    ],
  },
  {
    id: 'tristeza',
    nome: 'Desânimo e tristeza',
    nomeCurto: 'o desânimo',
    pesado: false,
    fazerMais: true,
    conviteSempre: true,
    acao: 'Fazer uma coisa pequena que te faça bem',
    perguntaDia: 'Hoje deu para fazer uma coisa pequena que te fez bem?',
    respostasDia: ['Deu', 'Um pouco', 'Hoje não'],
    legendaOndas: 'pesados atravessados',
    livre: 'com uma coisa pequena que te faça bem',
    momento: {
      botao: 'Bateu um peso agora',
      sub: 'Uns minutos para respirar e atravessar esse momento. Não gasta energia.',
      titulo: 'Você não precisa atravessar isso só',
      texto: 'Vamos com calma: respirar, lembrar do que importa e fazer uma coisa bem pequena. Se o peso estiver grande demais, o botão Ajuda agora está sempre no topo.',
      fim: 'Você atravessou esse momento',
    },
    missoes: [
      { id: 'tri1', texto: 'Abrir a janela e pegar um pouco de luz' },
      { id: 'tri2', texto: 'Tomar um banho com calma' },
      { id: 'tri3', texto: 'Mandar mensagem para alguém de confiança' },
      { id: 'tri4', texto: 'Sair de casa por 10 minutos, nem que seja até a esquina' },
    ],
  },
  {
    id: 'raiva',
    nome: 'Raiva e irritação',
    nomeCurto: 'a raiva',
    pesado: false,
    perguntaDia: 'Como foi hoje com a raiva?',
    respostasDia: ['Tranquilo', 'Explodi menos', 'Como sempre'],
    legendaOndas: 'de raiva atravessados sem explodir',
    livre: 'sem explodir',
    momento: {
      botao: 'Estou com raiva agora',
      sub: 'Uns minutos para baixar a temperatura antes de agir. Não gasta energia.',
      titulo: 'Vamos baixar a temperatura juntos',
      texto: 'A raiva sobe rápido e desce se você der tempo. Antes de responder ou agir, respire com a gente.',
      fim: 'Você não deixou a raiva decidir',
    },
    missoes: [
      { id: 'rai1', texto: 'Na raiva, sair de perto por 5 minutos antes de responder' },
      { id: 'rai2', texto: 'Anotar o que te irritou hoje e o que estava por trás' },
      { id: 'rai3', texto: 'Fazer a Respiração de emergência quando sentir o corpo esquentar' },
      { id: 'rai4', texto: 'Mexer o corpo por 10 minutos para descarregar a tensão' },
    ],
  },
  {
    id: 'solidao',
    nome: 'Solidão',
    nomeCurto: 'a solidão',
    pesado: false,
    fazerMais: true,
    acao: 'Ter um momento de conexão com alguém',
    perguntaDia: 'Hoje você teve um momento de conexão com alguém?',
    respostasDia: ['Tive', 'Um pouco', 'Hoje não'],
    legendaOndas: 'de solidão atravessados',
    livre: 'com um momento de conexão',
    momento: {
      botao: 'Bateu a solidão agora',
      sub: 'Uns minutos para respirar e procurar uma conexão. Não gasta energia.',
      titulo: 'Vamos atravessar esse momento juntos',
      texto: 'A solidão pesa mais em alguns horários. Respire, lembre de quem importa para você e escolha um pequeno contato.',
      fim: 'Você atravessou esse momento',
    },
    missoes: [
      { id: 'sol1', texto: 'Mandar mensagem para alguém com quem você não fala há um tempo' },
      { id: 'sol2', texto: 'Ir a um lugar com gente por perto, como uma praça ou um café' },
      { id: 'sol3', texto: 'Responder uma mensagem que estava parada' },
      { id: 'sol4', texto: 'Procurar um grupo de algo que você gosta, ou uma roda anônima do Leme' },
    ],
  },
];

export const TEMAS_PRINCIPAIS = TEMAS.filter((t) => t.principal);

export function temaPorId(id: IdTema | undefined): Tema {
  return TEMAS.find((t) => t.id === id) ?? TEMAS.find((t) => t.id === 'outro')!;
}
