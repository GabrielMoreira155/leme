import { Text, TextProps } from 'react-native';
import { tipo } from '@/theme';

type Variante = keyof typeof tipo;

export function Texto({ v = 'corpo', style, ...props }: TextProps & { v?: Variante }) {
  const ehTitulo = v === 'display' || v === 'h1' || v === 'h2' || v === 'h3';
  return <Text accessibilityRole={ehTitulo ? 'header' : undefined} style={[tipo[v], style]} {...props} />;
}
