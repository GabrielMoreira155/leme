import { router } from 'expo-router';
import { View } from 'react-native';
import { Botao, Tela, Texto, Tuga } from '@/components';
import { useEstado } from '@/lib/estado';
import { espaco } from '@/theme';

// Modo pausa: o app descansa por alguns dias sem perder nada.
export default function Pausa() {
  const { estado, atualizar } = useEstado();
  const ate = estado.pausaAte ? new Date(estado.pausaAte).toLocaleDateString('pt-BR') : '';

  function voltar() {
    atualizar((e) => ({ ...e, pausaAte: null }));
    router.replace('/');
  }

  return (
    <Tela
      conteudo={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
      rodape={
        <>
          <Botao titulo="Voltar agora" onPress={voltar} />
          <Botao titulo="Ajuda agora" variante="fantasma" icone="boia" onPress={() => router.push('/apoio')} />
        </>
      }
    >
      <Tuga pose="respira" size={200} />
      <View style={{ gap: espaco.sm, alignItems: 'center' }}>
        <Texto v="h1" style={{ textAlign: 'center' }}>
          Barco no porto até {ate}
        </Texto>
        <Texto v="corpo" style={{ textAlign: 'center' }}>
          Descansar também faz parte da viagem. Seu nível, seus dias cuidados e seu plano ficam guardados do jeito que estão.
        </Texto>
      </View>
    </Tela>
  );
}
