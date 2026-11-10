import { StyleSheet, View } from 'react-native';
import { cores, espaco, raio } from '@/theme';
import { Icone } from './Icone';
import { Texto } from './Texto';

// "Foco: comprar coisas por impulso". Mostra o texto que a pessoa escreveu no "Outro".
export function Foco({ texto, centro }: { texto: string; centro?: boolean }) {
  return (
    <View style={[estilos.foco, centro && { alignSelf: 'center' }]} accessible accessibilityLabel={`Foco: ${texto}`}>
      <Icone nome="bussola" size={16} cor={cores.mare} />
      <Texto v="apoio" style={{ color: cores.oceano, flexShrink: 1 }}>
        <Texto v="apoio" style={{ color: cores.mare, fontFamily: 'Figtree_700Bold' }}>
          Foco:{' '}
        </Texto>
        {texto}
      </Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  foco: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: espaco.md,
    paddingVertical: 6,
    borderRadius: raio.pilula,
    backgroundColor: cores.turquesaSuave,
  },
});
