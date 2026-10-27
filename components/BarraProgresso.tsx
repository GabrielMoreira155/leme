import { StyleSheet, View } from 'react-native';
import { cores, raio } from '@/theme';

type Props = {
  valor: number; // 0 a 1
  altura?: number;
  cor?: string;
  trilho?: string;
  rotulo?: string;
};

export function BarraProgresso({ valor, altura = 10, cor = cores.turquesa, trilho = cores.areiaEscura, rotulo }: Props) {
  const v = Math.max(0, Math.min(1, valor));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(v * 100) }}
      style={[estilos.trilho, { height: altura, backgroundColor: trilho }]}
    >
      <View style={[estilos.barra, { width: `${v * 100}%`, backgroundColor: cor }]} />
    </View>
  );
}

const estilos = StyleSheet.create({
  trilho: { width: '100%', borderRadius: raio.pilula, overflow: 'hidden' },
  barra: { height: '100%', borderRadius: raio.pilula },
});
