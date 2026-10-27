import { Platform } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { cores } from '@/theme';

// Ícones de traço 2px, cantos arredondados, tema náutico.
// Regra: nunca usar âncora (significa ficar preso) e nunca usar emoji.
export type NomeIcone =
  | 'onda'
  | 'farol'
  | 'bussola'
  | 'boia'
  | 'mapa'
  | 'leme'
  | 'livro'
  | 'pessoa'
  | 'grupo'
  | 'somLigado'
  | 'somDesligado'
  | 'cadeado'
  | 'check'
  | 'voltar'
  | 'avancar'
  | 'fechar'
  | 'estrela'
  | 'sino'
  | 'telefone'
  | 'coracao'
  | 'conversa'
  | 'vela'
  | 'lapis'
  | 'carta'
  | 'relogio'
  | 'baixar'
  | 'apagar'
  | 'pausa'
  | 'olho'
  | 'fone'
  | 'sol'
  | 'nuvem'
  | 'chuva'
  | 'porto'
  | 'mais';

type Props = {
  nome: NomeIcone;
  size?: number;
  cor?: string;
};

function Tracos({ nome }: { nome: NomeIcone }) {
  switch (nome) {
    case 'onda':
      return (
        <>
          <Path d="M2 10c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
          <Path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2" />
        </>
      );
    case 'farol':
      return (
        <>
          <Path d="M9 21L10.5 9h3L15 21z" />
          <Path d="M10.5 9V6h3v3" />
          <Path d="M10 6l2-2.5L14 6" />
          <Path d="M4 5.5L7.5 7M20 5.5L16.5 7M6 21h12" />
        </>
      );
    case 'bussola':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="M15.5 8.5l-2.1 4.9-4.9 2.1 2.1-4.9z" />
        </>
      );
    case 'boia':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Circle cx="12" cy="12" r="4" />
          <Path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" />
        </>
      );
    case 'mapa':
      return <Path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15" />;
    case 'leme':
      return (
        <>
          <Circle cx="12" cy="12" r="5.5" />
          <Circle cx="12" cy="12" r="1.2" />
          <Path d="M12 2v4.5M12 17.5V22M2 12h4.5M17.5 12H22M5 5l3.2 3.2M15.8 15.8L19 19M19 5l-3.2 3.2M8.2 15.8L5 19" />
        </>
      );
    case 'livro':
      return <Path d="M4 19V5a2 2 0 012-2h13v16H6a2 2 0 00-2 2 2 2 0 002 2h13M8 7h7" />;
    case 'pessoa':
      return (
        <>
          <Circle cx="12" cy="8" r="4" />
          <Path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
        </>
      );
    case 'grupo':
      return (
        <>
          <Circle cx="9" cy="8" r="3.5" />
          <Path d="M2 20c0-3.5 3-5 7-5s7 1.5 7 5" />
          <Path d="M16 4.6a3.5 3.5 0 010 6.8M18 15.2c2.4.6 4 2.2 4 4.8" />
        </>
      );
    case 'somLigado':
      return (
        <>
          <Path d="M4 9h4l5-4v14l-5-4H4z" />
          <Path d="M16.5 9a4.2 4.2 0 010 6M19 6.5a8 8 0 010 11" />
        </>
      );
    case 'somDesligado':
      return (
        <>
          <Path d="M4 9h4l5-4v14l-5-4H4z" />
          <Path d="M17 9.5l5 5M22 9.5l-5 5" />
        </>
      );
    case 'cadeado':
      return (
        <>
          <Rect x="5" y="11" width="14" height="10" rx="2" />
          <Path d="M8 11V8a4 4 0 018 0v3" />
        </>
      );
    case 'check':
      return <Path d="M5 12.5l4.5 4.5L19 7" />;
    case 'voltar':
      return <Path d="M15 5l-7 7 7 7" />;
    case 'avancar':
      return <Path d="M9 5l7 7-7 7" />;
    case 'fechar':
      return <Path d="M6 6l12 12M18 6L6 18" />;
    case 'estrela':
      return <Path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />;
    case 'sino':
      return <Path d="M6 16v-5a6 6 0 0112 0v5l2 2H4zM10 21h4" />;
    case 'telefone':
      return <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />;
    case 'coracao':
      return <Path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />;
    case 'conversa':
      return <Path d="M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5" />;
    case 'vela':
      return <Path d="M12 3v14M12 4l7 11h-7M12 7l-6 8h6M4 19h16l-2 2H6z" />;
    case 'lapis':
      return <Path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />;
    case 'carta':
      return (
        <>
          <Rect x="3" y="5" width="18" height="14" rx="2" />
          <Path d="M3 7l9 6.5L21 7" />
        </>
      );
    case 'relogio':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="M12 7v5l3 2" />
        </>
      );
    case 'baixar':
      return <Path d="M12 4v11M7 10l5 5 5-5M5 20h14" />;
    case 'apagar':
      return <Path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />;
    case 'pausa':
      return <Path d="M9 5v14M15 5v14" />;
    case 'olho':
      return (
        <>
          <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
          <Circle cx="12" cy="12" r="3" />
        </>
      );
    case 'fone':
      return <Path d="M4 16v-4a8 8 0 0116 0v4M4 15h3v5H5a1 1 0 01-1-1zM20 15h-3v5h2a1 1 0 001-1z" />;
    case 'sol':
      return (
        <>
          <Circle cx="12" cy="12" r="4" />
          <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </>
      );
    case 'nuvem':
      return <Path d="M7 18h10a4 4 0 00.5-8A6 6 0 006 9.5 4.3 4.3 0 007 18z" />;
    case 'chuva':
      return <Path d="M7 15h10a4 4 0 00.5-8A6 6 0 006 6.5 4.3 4.3 0 007 15zM8 18l-1 3M12 18l-1 3M16 18l-1 3" />;
    case 'porto':
      return <Path d="M3 20h18M5 20v-6h6v6M8 14V9l3-2M14 20v-9h5v9M16.5 11V7" />;
    case 'mais':
      return <Path d="M12 5v14M5 12h14" />;
  }
}

// Ícone é decorativo: o rótulo fica no botão que o contém.
const ESCONDER_DO_LEITOR: object =
  Platform.OS === 'web' ? { 'aria-hidden': true } : { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' };

export function Icone({ nome, size = 24, cor = cores.oceano }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...ESCONDER_DO_LEITOR}
    >
      <Tracos nome={nome} />
    </Svg>
  );
}
