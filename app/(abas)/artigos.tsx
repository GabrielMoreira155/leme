import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Cartao, Icone, Texto } from '@/components';
import { ARTIGOS, RODAPE_ARTIGOS } from '@/data/artigos';
import { useEstado } from '@/lib/estado';
import { cores, espaco } from '@/theme';

export default function Artigos() {
  const { estado } = useEstado();
  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <Texto v="h1">Artigos</Texto>
      <Texto v="apoio">Leituras curtas e gratuitas. Primeira leitura de cada uma vale +10 XP e nunca gasta energia.</Texto>
      {ARTIGOS.map((a) => {
        const lido = estado.artigosLidos.includes(a.id);
        return (
          <Cartao
            key={a.id}
            onPress={() => router.push({ pathname: '/artigo/[id]', params: { id: a.id } })}
            acessibilidade={`${a.titulo}. ${a.minutos} minutos de leitura${lido ? ', já lido' : ''}`}
            style={{ gap: espaco.xs }}
          >
            <View style={estilos.meta}>
              <Icone nome="relogio" size={16} cor={cores.neblina} />
              <Texto v="rotulo">{a.minutos} MIN DE LEITURA</Texto>
              {lido ? (
                <View style={estilos.lido}>
                  <Icone nome="check" size={14} cor={cores.mare} />
                  <Texto v="rotulo" style={{ color: cores.mare }}>
                    LIDO
                  </Texto>
                </View>
              ) : (
                <Texto v="rotulo" style={{ color: cores.mare, marginLeft: 'auto' }}>
                  +10 XP
                </Texto>
              )}
            </View>
            <Texto v="h3" style={{ fontSize: 17 }}>
              {a.titulo}
            </Texto>
            <Texto v="apoio">{a.resumo}</Texto>
          </Cartao>
        );
      })}
      <Texto v="apoio" style={{ fontSize: 12, marginTop: espaco.sm }}>
        {RODAPE_ARTIGOS}
      </Texto>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: espaco.xl, gap: espaco.md, paddingBottom: espaco.xxxl },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  lido: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
});
