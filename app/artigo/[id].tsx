import { voltar } from '@/lib/navegar';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Botao, Cabecalho, Tela, Texto } from '@/components';
import { ARTIGOS, RODAPE_ARTIGOS } from '@/data/artigos';
import { useEstado } from '@/lib/estado';
import { cores, espaco } from '@/theme';

const XP_ARTIGO = 10;

export default function ArtigoTela() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artigo = ARTIGOS.find((a) => a.id === id);
  const { estado, atualizar, ganharXP } = useEstado();

  if (!artigo) return <Redirect href="/artigos" />;
  const lido = estado.artigosLidos.includes(artigo.id);

  function terminar() {
    if (!lido) {
      atualizar((e) => ({ ...e, artigosLidos: [...e.artigosLidos, artigo!.id] }));
      ganharXP(XP_ARTIGO, 'leitura');
    }
    voltar('/artigos');
  }

  return (
    <Tela topo={<Cabecalho titulo="Artigo" />} rodape={<Botao titulo={lido ? 'Voltar' : `Terminei de ler · +${XP_ARTIGO} XP`} onPress={terminar} />}>
      <Texto v="rotulo">{artigo.minutos} MIN DE LEITURA</Texto>
      <Texto v="h1">{artigo.titulo}</Texto>
      <Texto v="h3" style={{ color: cores.mare, fontFamily: 'Figtree_600SemiBold' }}>
        {artigo.resumo}
      </Texto>
      <View style={{ gap: espaco.lg }}>
        {artigo.paragrafos.map((p, i) => (
          <Texto key={i} v="corpo" style={{ fontSize: 17, lineHeight: 27 }}>
            {p}
          </Texto>
        ))}
      </View>
      <View style={{ borderTopWidth: 1, borderTopColor: cores.linha, paddingTop: espaco.lg, marginTop: espaco.md }}>
        <Texto v="apoio" style={{ fontSize: 13 }}>
          {RODAPE_ARTIGOS}
        </Texto>
      </View>
    </Tela>
  );
}
