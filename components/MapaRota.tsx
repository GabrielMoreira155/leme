import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { cores, espaco } from '@/theme';
import { Icone } from './Icone';
import { Texto } from './Texto';

type Props = {
  /** Porto atual (0 a 3). Os anteriores aparecem como alcançados, os seguintes bloqueados. */
  atual: number;
  claro?: boolean;
};

// Mapa de rota com 4 portos, um por semana.
export function MapaRota({ atual, claro }: Props) {
  const corTexto = claro ? cores.branco : cores.oceano;
  return (
    <View accessibilityLabel={`Mapa de rota: porto ${atual + 1} de 4 ativo`} accessible>
      <View style={estilos.linhaOnda}>
        <Svg width="100%" height={20} viewBox="0 0 300 20" preserveAspectRatio="none">
          <Path
            d="M0 10 q18.75 -9 37.5 0 t37.5 0 t37.5 0 t37.5 0 t37.5 0 t37.5 0 t37.5 0 t37.5 0"
            stroke={claro ? 'rgba(255,255,255,0.35)' : cores.linha}
            strokeWidth={2.5}
            strokeDasharray="6 6"
            fill="none"
          />
        </Svg>
      </View>
      <View style={estilos.portos}>
        {[0, 1, 2, 3].map((i) => {
          const ativo = i === atual;
          const feito = i < atual;
          const bloqueado = i > atual;
          return (
            <View key={i} style={estilos.porto}>
              <View
                style={[
                  estilos.circulo,
                  ativo && { backgroundColor: cores.turquesa, borderColor: cores.turquesa },
                  feito && { backgroundColor: cores.mare, borderColor: cores.mare },
                  bloqueado && { backgroundColor: claro ? cores.oceanoClaro : cores.areiaEscura, borderColor: claro ? cores.oceanoClaro : cores.linha },
                ]}
              >
                <Icone
                  nome={bloqueado ? 'cadeado' : feito ? 'check' : 'farol'}
                  size={20}
                  cor={bloqueado ? (claro ? '#9FB3C6' : cores.neblina) : ativo ? cores.oceano : cores.branco}
                />
              </View>
              <Texto v="rotulo" style={{ color: bloqueado ? (claro ? '#B7C7D6' : cores.neblina) : corTexto }}>
                Porto {i + 1}
              </Texto>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  linhaOnda: { position: 'absolute', left: '12%', right: '12%', top: 14 },
  portos: { flexDirection: 'row', justifyContent: 'space-between' },
  porto: { alignItems: 'center', gap: espaco.xs, flex: 1 },
  circulo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
