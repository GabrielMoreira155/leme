import { Pressable, StyleSheet, View } from 'react-native';
import { cores, espaco, raio } from '@/theme';
import { Icone } from './Icone';
import { Texto } from './Texto';

type Props = {
  marcado: boolean;
  aoMudar: (v: boolean) => void;
  titulo: string;
  detalhe?: string;
  etiqueta?: string;
};

// Caixa de aceite. Usada no consentimento e nas autorizações das sessões.
export function Marcar({ marcado, aoMudar, titulo, detalhe, etiqueta }: Props) {
  return (
    <Pressable
      onPress={() => aoMudar(!marcado)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcado }}
      accessibilityLabel={`${titulo}${etiqueta ? `, ${etiqueta}` : ''}`}
      style={({ pressed }) => [estilos.linha, marcado && estilos.linhaMarcada, pressed && { opacity: 0.9 }]}
    >
      <View style={[estilos.caixa, marcado && estilos.caixaMarcada]}>{marcado && <Icone nome="check" size={18} cor={cores.branco} />}</View>
      <View style={{ flex: 1, gap: 4 }}>
        {etiqueta && <Texto v="rotulo">{etiqueta.toUpperCase()}</Texto>}
        <Texto v="corpo" style={{ fontFamily: 'Figtree_600SemiBold', fontSize: 15, lineHeight: 22 }}>
          {titulo}
        </Texto>
        {detalhe && <Texto v="apoio">{detalhe}</Texto>}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: espaco.md,
    padding: espaco.lg,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    minHeight: 44,
  },
  linhaMarcada: { borderColor: cores.mare },
  caixa: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: cores.oceano,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  caixaMarcada: { backgroundColor: cores.mare, borderColor: cores.mare },
});
