import Svg, { Circle, Path } from 'react-native-svg';
import { cores } from '@/theme';

type Props = {
  size?: number;
  cor?: string;
  /** Modo discreto troca o leme por um ícone neutro (um círculo simples). */
  neutro?: boolean;
};

// Leme de barco: o traço turquesa é o rumo, o ponto coral no centro é a pessoa.
export function Simbolo({ size = 48, cor = cores.turquesa, neutro = false }: Props) {
  if (neutro) {
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Hábitos">
        <Circle cx="24" cy="24" r="16" fill="none" stroke={cores.neblina} strokeWidth={3.5} />
        <Path d="M17 24.5l5 5 9-10" fill="none" stroke={cores.neblina} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="Leme">
      <Circle cx="24" cy="24" r="11" fill="none" stroke={cor} strokeWidth={3.5} strokeLinecap="round" />
      <Circle cx="24" cy="24" r="3.5" fill={cores.coral} />
      <Path
        d="M24 4v9M24 35v9M4 24h9M35 24h9M10 10l6.5 6.5M31.5 31.5L38 38M38 10l-6.5 6.5M16.5 31.5L10 38"
        fill="none"
        stroke={cor}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
