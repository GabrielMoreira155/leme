import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Botao, Cabecalho, Cartao, Icone, NomeIcone, Tela, Texto } from '@/components';
import { Marcar } from '@/components/Marcar';
import { useEstado } from '@/lib/estado';
import { cores, espaco } from '@/theme';

// Dado de saúde é dado sensível (LGPD, art. 11). Por isso o consentimento é
// específico, destacado e com aceites separados para cada finalidade.

const ITENS: { icone: NomeIcone; titulo: string; texto: string }[] = [
  {
    icone: 'bussola',
    titulo: 'Para que usamos',
    texto: 'Suas respostas servem para montar o seu plano: metas, missões e conteúdos que fazem sentido para você.',
  },
  {
    icone: 'olho',
    titulo: 'Quem vê',
    texto: 'Só você. Se você agendar uma conversa, o psicólogo vê a sua ficha apenas se você autorizar naquele momento.',
  },
  {
    icone: 'cadeado',
    titulo: 'O que nunca fazemos',
    texto: 'Nunca vendemos seus dados e nunca usamos para anúncio.',
  },
  {
    icone: 'baixar',
    titulo: 'Seus direitos',
    texto: 'Você pode ver, baixar, corrigir e apagar tudo quando quiser, direto no seu perfil.',
  },
];

export default function Consentimento() {
  const { atualizar } = useEstado();
  const [plano, setPlano] = useState(false);
  const [melhorias, setMelhorias] = useState(false);

  function continuar() {
    atualizar((e) => ({ ...e, consentimento: { plano, melhorias, em: new Date().toISOString() } }));
    router.push('/ficha');
  }

  return (
    <Tela
      topo={<Cabecalho titulo="Privacidade" />}
      rodape={
        <>
          <Botao titulo="Concordo e continuar" desabilitado={!plano} onPress={continuar} />
          {!plano && (
            <Texto v="apoio" style={{ textAlign: 'center' }}>
              Marque o primeiro aceite para seguir.
            </Texto>
          )}
        </>
      }
    >
      <Texto v="h1">Antes de zarpar, combinado sobre seus dados</Texto>
      <Texto v="apoio" style={{ fontSize: 15, lineHeight: 22 }}>
        O que você contar aqui é sobre a sua saúde. A lei trata isso como dado sensível, e a gente também.
      </Texto>

      <Cartao style={{ gap: espaco.lg }}>
        {ITENS.map((i) => (
          <View key={i.titulo} style={estilos.item}>
            <View style={estilos.icone}>
              <Icone nome={i.icone} size={20} cor={cores.mare} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Texto v="h3">{i.titulo}</Texto>
              <Texto v="apoio">{i.texto}</Texto>
            </View>
          </View>
        ))}
      </Cartao>

      <Marcar
        etiqueta="Obrigatório"
        marcado={plano}
        aoMudar={setPlano}
        titulo="Autorizo o Leme a usar minhas respostas para montar e ajustar o meu plano."
      />
      <Marcar
        etiqueta="Opcional"
        marcado={melhorias}
        aoMudar={setMelhorias}
        titulo="Autorizo o uso dos meus dados de forma anonimizada para melhorar o app."
        detalhe="Sem apelido e sem nada que identifique você. Dá para mudar depois no perfil."
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  item: { flexDirection: 'row', gap: espaco.md },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.turquesaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
