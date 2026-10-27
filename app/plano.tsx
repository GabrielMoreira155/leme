import { Redirect, router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Botao, Cartao, Icone, Tela, Texto, Tuga } from '@/components';
import { MapaRota } from '@/components/MapaRota';
import { useEstado } from '@/lib/estado';
import { DESCRICAO_ROTA, NOME_ROTA } from '@/lib/nivel';
import { gerarPlano, missoesDoDia, textoMeta } from '@/lib/plano';
import { cores, espaco } from '@/theme';

export default function PlanoTela() {
  const { estado, atualizar } = useEstado();
  const ficha = estado.ficha;
  const plano = useMemo(() => (ficha ? gerarPlano(ficha) : null), [ficha]);

  if (!ficha || !plano) return <Redirect href="/" />;

  const missoes = missoesDoDia(ficha);

  function zarpar() {
    atualizar((e) => ({ ...e, plano }));
    router.replace('/hoje');
  }

  return (
    <Tela rodape={<Botao titulo="Bora zarpar" grande onPress={zarpar} />}>
      <View style={{ alignItems: 'center', gap: espaco.sm, marginTop: espaco.sm }}>
        <Tuga pose="padrao" size={170} />
        <Texto v="h1" style={{ textAlign: 'center' }}>
          Sua rota começa em águas calmas
        </Texto>
        <Texto v="apoio" style={{ textAlign: 'center', fontSize: 15 }}>
          {ficha.apelido}, montamos um plano a partir do que você contou. Você só precisa seguir. A gente ajusta junto pelo caminho.
        </Texto>
      </View>

      <Cartao tom="oceano" style={{ gap: espaco.lg }}>
        <View style={{ gap: 4 }}>
          <Texto v="rotulo" style={{ color: cores.turquesa }}>
            {NOME_ROTA[plano.nivel].toUpperCase()}
          </Texto>
          <Texto v="apoio" style={{ color: '#D7E2EC' }}>
            {DESCRICAO_ROTA[plano.nivel]}
          </Texto>
        </View>
        <MapaRota atual={0} claro />
        <Texto v="apoio" style={{ color: '#D7E2EC' }}>
          Cada porto é uma semana. O primeiro já está aberto.
        </Texto>
      </Cartao>

      <Cartao style={{ gap: espaco.sm }}>
        <View style={estilos.titulo}>
          <Icone nome="bussola" cor={cores.mare} />
          <Texto v="h3">Meta desta semana</Texto>
        </View>
        <Texto v="h2">{textoMeta(plano.degrau, ficha.tema)}</Texto>
        <Texto v="apoio">
          Cumpriu a semana? A meta sobe um degrau. Não deu? Ela desce sozinha, sem castigo. A rota se ajusta ao mar.
        </Texto>
      </Cartao>

      <Cartao style={{ gap: espaco.md }}>
        <View style={estilos.titulo}>
          <Icone nome="mapa" cor={cores.mare} />
          <Texto v="h3">3 missões por dia</Texto>
        </View>
        {missoes.map((m, i) => (
          <View key={m.id} style={estilos.missao}>
            <View style={estilos.numero}>
              <Texto v="rotulo" style={{ color: cores.oceano }}>
                {i + 1}
              </Texto>
            </View>
            <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
              {m.texto}
            </Texto>
          </View>
        ))}
        <Texto v="apoio">As missões mudam todo dia. A terceira é sempre um hábito bom para colocar no lugar.</Texto>
      </Cartao>

      {plano.avisoAlcool && (
        <Cartao tom="areia" style={estilos.aviso}>
          <Icone nome="farol" cor={cores.mare} />
          <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
            Com álcool, reduzir aos poucos e com acompanhamento é mais seguro. Parar de uma vez depois de muito tempo bebendo pode fazer mal ao corpo. Fale com um profissional de saúde.
          </Texto>
        </Cartao>
      )}

      {plano.convitePsicologo && (
        <Cartao tom="turquesa" style={{ gap: espaco.sm }}>
          <View style={estilos.titulo}>
            <Icone nome="conversa" cor={cores.mare} />
            <Texto v="h3">Uma tripulação ajuda</Texto>
          </View>
          <Texto v="corpo" style={{ fontSize: 15 }}>
            Pelo que você contou, conversar com um psicólogo pode deixar essa viagem bem mais leve. A primeira conversa é gratuita.
          </Texto>
          <Texto v="link">Você encontra na aba Sessões, quando quiser.</Texto>
        </Cartao>
      )}

      {plano.menorDeIdade && (
        <Cartao tom="areia" style={estilos.aviso}>
          <Icone nome="pessoa" cor={cores.mare} />
          <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
            Metas e artigos estão liberados para você. Para sessões com psicólogo, a gente vai pedir a concordância de um responsável.
          </Texto>
        </Cartao>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  titulo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  missao: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  numero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: cores.turquesaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aviso: { flexDirection: 'row', gap: espaco.md },
});
