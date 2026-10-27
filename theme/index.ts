// Identidade visual do Leme.
// Proporção: muita areia e oceano, turquesa para celebrar, coral só onde a pessoa precisa agir.
// Não existe cor de erro. Tropeço não é falha.

export const cores = {
  oceano: '#123A5A', // cor principal, fundos fortes e textos
  coral: '#F2795B', // ação, botões principais
  textoCoral: '#2B1D02', // texto sobre coral
  turquesa: '#3FB8AF', // progresso, conquistas e o símbolo
  mare: '#1F7A72', // turquesa para textos e links (contraste 4.5:1 sobre areia)
  areia: '#F8F1E4', // fundo padrão
  neblina: '#4F6478', // textos de apoio

  // apoio derivado da paleta
  branco: '#FFFFFF',
  cartao: '#FFFCF6',
  linha: '#E6DCCB',
  areiaEscura: '#EFE5D3',
  oceanoClaro: '#1C4C72',
  turquesaSuave: '#DDF2EF',
  coralSuave: '#FCE4DC',
  tugaPele: '#5CC2B0',
  tugaCasco: '#2E8C7E',
  tugaLinha: '#226D62',
} as const;

export const fontes = {
  titulo: 'Sora_800ExtraBold',
  tituloMedio: 'Sora_700Bold',
  texto: 'Figtree_400Regular',
  textoMedio: 'Figtree_500Medium',
  textoForte: 'Figtree_600SemiBold',
  textoNegrito: 'Figtree_700Bold',
} as const;

export const espaco = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const raio = {
  sm: 10,
  md: 16,
  lg: 22,
  pilula: 999,
} as const;

// Área mínima de toque (acessibilidade).
export const TOQUE_MIN = 44;

export const tipo = {
  display: { fontFamily: fontes.titulo, fontSize: 30, lineHeight: 38, color: cores.oceano },
  h1: { fontFamily: fontes.titulo, fontSize: 24, lineHeight: 31, color: cores.oceano },
  h2: { fontFamily: fontes.tituloMedio, fontSize: 19, lineHeight: 26, color: cores.oceano },
  h3: { fontFamily: fontes.tituloMedio, fontSize: 16, lineHeight: 22, color: cores.oceano },
  corpo: { fontFamily: fontes.texto, fontSize: 16, lineHeight: 24, color: cores.oceano },
  apoio: { fontFamily: fontes.texto, fontSize: 14, lineHeight: 20, color: cores.neblina },
  rotulo: { fontFamily: fontes.textoForte, fontSize: 13, lineHeight: 18, color: cores.neblina, letterSpacing: 0.3 },
  link: { fontFamily: fontes.textoForte, fontSize: 15, lineHeight: 22, color: cores.mare },
} as const;
