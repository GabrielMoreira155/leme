import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Botao, Cartao, Icone, Texto } from '@/components';
import { Atividade, ATIVIDADES, XP_ATIVIDADE } from '@/data/atividades';
import { ENERGIA_MAX, RECARGA_MS, useEstado } from '@/lib/estado';
import { cores, espaco, raio } from '@/theme';

function tempoRecarga(em: number | null) {
  if (!em) return '2h';
  const min = Math.max(1, Math.round((em - Date.now()) / 60000));
  if (min >= 60) return `${Math.floor(min / 60)}h${min % 60 ? `${min % 60}min` : ''}`;
  return `${min} min`;
}

export default function Atividades() {
  const { estado, gastarEnergia } = useEstado();
  const [semEnergia, setSemEnergia] = useState(false);

  function abrir(a: Atividade) {
    if (a.id === 'respiracao') {
      router.push({ pathname: '/fissura', params: { modo: 'respiracao' } });
      return;
    }
    if (a.custaEnergia && !gastarEnergia()) {
      setSemEnergia(true);
      return;
    }
    router.push({ pathname: '/atividade/[id]', params: { id: a.id } });
  }

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <Texto v="h1">Atividades</Texto>
      <Cartao tom="areia" style={estilos.energia}>
        <View style={{ flexDirection: 'row', gap: 4 }} accessible accessibilityLabel={`Energia: ${estado.energia} de ${ENERGIA_MAX}`}>
          {Array.from({ length: ENERGIA_MAX }, (_, i) => (
            <Icone key={i} nome="vela" size={22} cor={i < estado.energia ? cores.mare : cores.linha} />
          ))}
        </View>
        <Texto v="apoio" style={{ flex: 1 }}>
          As interativas usam 1 de energia e dão +{XP_ATIVIDADE} XP.
        </Texto>
      </Cartao>

      {(semEnergia || estado.energia === 0) && (
        <Cartao tom="turquesa" style={{ gap: espaco.sm }}>
          <Texto v="h3">Sua energia está recarregando</Texto>
          <Texto v="corpo" style={{ fontSize: 15 }}>
            Ela volta em {tempoRecarga(estado.energiaRecargaEm)}. Enquanto isso, a respiração, os artigos e o psicólogo continuam livres para você.
          </Texto>
        </Cartao>
      )}

      {ATIVIDADES.map((a) => {
        const travada = a.custaEnergia && estado.energia === 0;
        return (
          <Cartao key={a.id} onPress={() => abrir(a)} acessibilidade={`${a.titulo}. ${a.descricao}`} style={estilos.item}>
            <View style={[estilos.icone, a.id === 'respiracao' && { backgroundColor: cores.turquesa }]}>
              <Icone nome={a.icone} cor={cores.oceano} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Texto v="h3">{a.titulo}</Texto>
              <Texto v="apoio">{a.descricao}</Texto>
              <View style={estilos.tags}>
                <Texto v="rotulo">{a.minutos}</Texto>
                <Texto v="rotulo" style={{ color: a.custaEnergia ? (travada ? cores.neblina : cores.mare) : cores.mare }}>
                  {a.custaEnergia ? `1 energia · +${XP_ATIVIDADE} XP` : 'Sempre livre'}
                </Texto>
              </View>
            </View>
            <Icone nome={travada ? 'relogio' : 'avancar'} cor={cores.neblina} />
          </Cartao>
        );
      })}

      <Botao titulo="Estou com vontade agora" icone="onda" onPress={() => router.push('/fissura')} />
      <Texto v="apoio" style={{ textAlign: 'center' }}>
        O botão de vontade nunca gasta energia. Recarga completa a cada {RECARGA_MS / 3600000}h.
      </Texto>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: espaco.xl, gap: espaco.md, paddingBottom: espaco.xxxl },
  energia: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, padding: espaco.lg },
  item: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  icone: { width: 48, height: 48, borderRadius: raio.md, backgroundColor: cores.turquesaSuave, alignItems: 'center', justifyContent: 'center' },
  tags: { flexDirection: 'row', gap: espaco.md, marginTop: 4, flexWrap: 'wrap' },
});
