import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, fontes, raio, TOQUE_MIN } from '@/theme';
import { Icone, NomeIcone } from './Icone';

type Props = {
  rotulo: string;
  selecionado?: boolean;
  onPress?: () => void;
  icone?: NomeIcone;
  multiplo?: boolean;
  largo?: boolean;
};

export function Chip({ rotulo, selecionado, onPress, icone, multiplo, largo }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multiplo ? 'checkbox' : 'radio'}
      accessibilityState={multiplo ? { checked: !!selecionado } : { selected: !!selecionado }}
      accessibilityLabel={rotulo}
      style={({ pressed }) => [
        estilos.chip,
        largo && estilos.largo,
        selecionado && estilos.selecionado,
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={estilos.linha}>
        {icone && <Icone nome={icone} size={20} cor={selecionado ? cores.branco : cores.oceano} />}
        <Text style={[estilos.texto, largo && { flex: 1 }, selecionado && { color: cores.branco }]}>{rotulo}</Text>
        {largo && selecionado && <Icone nome="check" size={20} cor={cores.turquesa} />}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    minHeight: TOQUE_MIN,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: raio.pilula,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    justifyContent: 'center',
  },
  largo: { borderRadius: raio.md, minHeight: 54, paddingHorizontal: 18 },
  selecionado: { backgroundColor: cores.oceano, borderColor: cores.oceano },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  texto: { fontFamily: fontes.textoForte, fontSize: 15, color: cores.oceano },
});
