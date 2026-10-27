import { StyleSheet, View } from 'react-native';
import { Cabecalho, Cartao, Icone, Simbolo, Tela, Texto } from '@/components';
import { useEstado } from '@/lib/estado';
import { cores, espaco, fontes, raio } from '@/theme';

// Exemplo visual de notificações. Regra: nunca citar o hábito, o vício ou a recaída.
const EXEMPLOS = [
  { quando: 'agora', texto: 'Sua missão de hoje está pronta.' },
  { quando: '19:30', texto: 'Que tal uma pausa de um minuto?' },
  { quando: 'ontem', texto: 'Tem uma leitura nova esperando por você.' },
];

const REGRAS = [
  'Nunca citam o hábito, o vício ou um tropeço.',
  'No máximo uma por dia, no horário que você escolher.',
  'No modo discreto, aparecem como "Hábitos".',
  'No modo pausa, param por completo.',
];

export default function Notificacoes() {
  const { estado } = useEstado();
  const nome = estado.modoDiscreto ? 'Hábitos' : 'Leme';
  return (
    <Tela topo={<Cabecalho titulo="Notificações" />}>
      <Texto v="h1">Discretas por padrão</Texto>
      <Texto v="apoio">Assim elas aparecem na tela bloqueada. Só um exemplo, nada é enviado no protótipo.</Texto>

      <View style={estilos.celular} accessibilityLabel="Exemplo de tela bloqueada">
        <Texto style={estilos.hora}>9:41</Texto>
        <Texto style={estilos.data}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Texto>
        <View style={{ gap: espaco.sm, marginTop: espaco.xl }}>
          {EXEMPLOS.map((n) => (
            <View key={n.texto} style={estilos.notificacao}>
              <View style={estilos.iconeApp}>
                <Simbolo size={24} neutro={estado.modoDiscreto} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Texto style={estilos.app}>{nome.toUpperCase()}</Texto>
                  <Texto style={estilos.quando}>{n.quando}</Texto>
                </View>
                <Texto style={estilos.texto}>{n.texto}</Texto>
              </View>
            </View>
          ))}
        </View>
      </View>

      <Cartao style={{ gap: espaco.sm }}>
        {REGRAS.map((r) => (
          <View key={r} style={{ flexDirection: 'row', gap: espaco.sm }}>
            <Icone nome="check" size={18} cor={cores.mare} />
            <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
              {r}
            </Texto>
          </View>
        ))}
      </Cartao>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  celular: { backgroundColor: cores.oceano, borderRadius: 28, padding: espaco.lg, paddingTop: espaco.xxl, paddingBottom: espaco.xxl },
  hora: { fontFamily: fontes.titulo, fontSize: 56, lineHeight: 64, color: cores.branco, textAlign: 'center' },
  data: { fontFamily: fontes.textoMedio, fontSize: 15, color: '#D7E2EC', textAlign: 'center' },
  notificacao: { flexDirection: 'row', gap: espaco.md, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: raio.md, padding: espaco.md, alignItems: 'center' },
  iconeApp: { width: 36, height: 36, borderRadius: 9, backgroundColor: cores.areia, alignItems: 'center', justifyContent: 'center' },
  app: { fontFamily: fontes.textoNegrito, fontSize: 11, letterSpacing: 0.5, color: cores.neblina },
  quando: { fontFamily: fontes.texto, fontSize: 11, color: cores.neblina },
  texto: { fontFamily: fontes.textoForte, fontSize: 15, color: cores.oceano },
});
