import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { cores, fontes, raio, TOQUE_MIN } from '@/theme';
import { Icone, NomeIcone } from './Icone';

type Variante = 'primario' | 'oceano' | 'contorno' | 'fantasma' | 'claro';

type Props = {
  titulo: string;
  onPress?: () => void;
  variante?: Variante;
  icone?: NomeIcone;
  desabilitado?: boolean;
  grande?: boolean;
  acessibilidade?: string;
  dica?: string;
  style?: ViewStyle;
};

// Coral (primario) só onde a pessoa precisa agir. O resto usa oceano ou contorno.
const VARIANTES: Record<Variante, { fundo: string; texto: string; borda: string }> = {
  primario: { fundo: cores.coral, texto: cores.textoCoral, borda: cores.coral },
  oceano: { fundo: cores.oceano, texto: cores.branco, borda: cores.oceano },
  contorno: { fundo: 'transparent', texto: cores.oceano, borda: cores.oceano },
  fantasma: { fundo: 'transparent', texto: cores.mare, borda: 'transparent' },
  claro: { fundo: cores.branco, texto: cores.oceano, borda: cores.branco },
};

export function Botao({ titulo, onPress, variante = 'primario', icone, desabilitado, grande, acessibilidade, dica, style }: Props) {
  const v = VARIANTES[variante];
  return (
    <Pressable
      onPress={desabilitado ? undefined : onPress}
      accessibilityRole="button"
      accessibilityLabel={acessibilidade ?? titulo}
      accessibilityHint={dica}
      accessibilityState={{ disabled: !!desabilitado }}
      style={({ pressed }) => [
        estilos.base,
        grande && estilos.grande,
        { backgroundColor: v.fundo, borderColor: v.borda },
        desabilitado && estilos.desabilitado,
        pressed && !desabilitado && { opacity: 0.85, transform: [{ scale: 0.985 }] },
        style,
      ]}
    >
      <View style={estilos.linha}>
        {icone && <Icone nome={icone} size={grande ? 24 : 20} cor={desabilitado ? cores.neblina : v.texto} />}
        <Text style={[estilos.texto, grande && estilos.textoGrande, { color: desabilitado ? cores.neblina : v.texto }]}>{titulo}</Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: raio.pilula,
    borderWidth: 2,
    paddingHorizontal: 22,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grande: { minHeight: 64, paddingVertical: 16 },
  desabilitado: { backgroundColor: cores.areiaEscura, borderColor: cores.areiaEscura },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  texto: { fontFamily: fontes.textoNegrito, fontSize: 16, textAlign: 'center' },
  textoGrande: { fontSize: 18 },
});

// Botão só com ícone. Sempre exige rótulo de acessibilidade.
export function BotaoIcone({
  icone,
  rotulo,
  onPress,
  cor = cores.oceano,
  fundo = 'transparent',
}: {
  icone: NomeIcone;
  rotulo: string;
  onPress?: () => void;
  cor?: string;
  fundo?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      hitSlop={4}
      style={({ pressed }) => [
        { minWidth: TOQUE_MIN, minHeight: TOQUE_MIN, borderRadius: raio.pilula, alignItems: 'center', justifyContent: 'center', backgroundColor: fundo },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icone nome={icone} cor={cor} />
    </Pressable>
  );
}
