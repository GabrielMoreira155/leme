import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { cores, espaco, raio } from '@/theme';

type Tom = 'claro' | 'oceano' | 'turquesa' | 'areia' | 'coral';

const FUNDOS: Record<Tom, string> = {
  claro: cores.cartao,
  oceano: cores.oceano,
  turquesa: cores.turquesaSuave,
  areia: cores.areiaEscura,
  coral: cores.coralSuave,
};

type Props = {
  children: ReactNode;
  tom?: Tom;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  acessibilidade?: string;
};

export function Cartao({ children, tom = 'claro', style, onPress, acessibilidade }: Props) {
  const base = [estilos.cartao, { backgroundColor: FUNDOS[tom] }, tom === 'claro' && estilos.borda, style];
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={acessibilidade}
        style={({ pressed }) => [...base, pressed && { opacity: 0.9 }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

const estilos = StyleSheet.create({
  cartao: { borderRadius: raio.lg, padding: espaco.lg + 2 },
  borda: { borderWidth: 1, borderColor: cores.linha },
});
