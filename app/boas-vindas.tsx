import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Botao, Icone, Simbolo, Tela, Texto, Tuga } from '@/components';
import { cores, espaco, fontes } from '@/theme';

export default function BoasVindas() {
  return (
    <Tela
      conteudo={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', gap: espaco.xl }}
      rodape={
        <>
          <Botao titulo="Começar" grande onPress={() => router.push('/consentimento')} />
          <View style={estilos.aviso}>
            <Icone nome="olho" size={18} cor={cores.neblina} />
            <Texto v="apoio" style={{ flex: 1 }}>
              Sem conta e sem e-mail para começar. Aqui você usa só um apelido.
            </Texto>
          </View>
        </>
      }
    >
      <View style={estilos.marca}>
        <Simbolo size={44} />
        <Texto style={estilos.nome}>Leme</Texto>
      </View>
      <Tuga pose="padrao" size={230} />
      <Texto v="display" style={{ textAlign: 'center', maxWidth: 340 }}>
        Você no controle do rumo, no seu ritmo.
      </Texto>
      <Texto v="apoio" style={{ textAlign: 'center', fontSize: 16, lineHeight: 24, maxWidth: 320 }}>
        Um parceiro de viagem para cuidar dos hábitos que andam pesando. Do celular às apostas, sem julgamento.
      </Texto>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nome: { fontFamily: fontes.titulo, fontSize: 32, color: cores.oceano },
  aviso: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingHorizontal: espaco.sm },
});
