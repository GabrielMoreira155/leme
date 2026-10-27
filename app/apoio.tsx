import { voltar } from '@/lib/navegar';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, View } from 'react-native';
import { Botao, Cabecalho, Cartao, Icone, Tela, Texto } from '@/components';
import { useEstado } from '@/lib/estado';
import { cores, espaco } from '@/theme';

// TELA DE CRISE
// Regras: sem Tuga, sem XP, sem som, sem vibração, sem brincadeira.

function ligar(numero: string) {
  Linking.openURL(`tel:${numero}`).catch(() => {});
}

export default function Apoio() {
  const { origem } = useLocalSearchParams<{ origem?: string }>();
  const { atualizar } = useEstado();
  const [pedido, setPedido] = useState(false);
  const daFicha = origem === 'ficha';

  function pedirPsicologo() {
    setPedido(true);
    atualizar((e) => ({
      ...e,
      sessoes: [
        ...e.sessoes,
        { id: `prioridade-${Date.now()}`, tipo: 'Conversa prioritária', com: 'Equipe de plantão', horario: 'Agora', em: new Date().toISOString() },
      ],
    }));
  }

  return (
    <Tela
      topo={daFicha ? undefined : <Cabecalho titulo="Apoio" />}
      rodape={
        daFicha ? (
          <Botao titulo="Continuar para o meu plano" variante="contorno" onPress={() => router.replace('/plano')} />
        ) : (
          <Botao titulo="Voltar" variante="contorno" onPress={() => voltar()} />
        )
      }
    >
      <Texto v="h1" style={{ marginTop: daFicha ? espaco.lg : 0 }}>
        Obrigado por contar. Você não precisa passar por isso só.
      </Texto>
      <Texto v="corpo">
        O que você está sentindo importa. Agora, o mais importante é falar com alguém. Tem gente preparada para ouvir, de graça, a qualquer hora.
      </Texto>

      <Cartao tom="oceano" style={{ gap: espaco.md }}>
        <Texto v="h3" style={{ color: cores.branco }}>
          Se você corre perigo agora
        </Texto>
        <Botao
          titulo="Ligar para o CVV · 188"
          variante="claro"
          icone="telefone"
          acessibilidade="Ligar para o CVV, número 188"
          onPress={() => ligar('188')}
        />
        <Texto v="apoio" style={{ color: '#D7E2EC' }}>
          Centro de Valorização da Vida. Ligação gratuita, 24 horas, sigilosa. Também atende por chat em cvv.org.br.
        </Texto>
        <Botao
          titulo="Ligar para o SAMU · 192"
          variante="claro"
          icone="telefone"
          acessibilidade="Ligar para o SAMU, número 192"
          onPress={() => ligar('192')}
        />
        <Texto v="apoio" style={{ color: '#D7E2EC' }}>
          Para emergência médica ou se você já se machucou.
        </Texto>
      </Cartao>

      <Cartao style={{ gap: espaco.md }}>
        <View style={{ flexDirection: 'row', gap: espaco.md, alignItems: 'center' }}>
          <Icone nome="conversa" cor={cores.mare} />
          <Texto v="h3" style={{ flex: 1 }}>
            Falar com um psicólogo do app
          </Texto>
        </View>
        {pedido ? (
          <Texto v="corpo">
            Pedido com prioridade enviado. Uma pessoa da equipe vai chamar você aqui no app em instantes. Enquanto isso, o CVV continua disponível no 188.
          </Texto>
        ) : (
          <>
            <Texto v="apoio">Seu pedido entra na frente da fila. A conversa inicial é gratuita.</Texto>
            <Botao titulo="Pedir conversa com prioridade" variante="oceano" onPress={pedirPsicologo} />
          </>
        )}
      </Cartao>

      <Texto v="apoio">
        Se puder, avise alguém de confiança e fique perto de outras pessoas. Afaste de você o que possa ser usado para se machucar.
      </Texto>
    </Tela>
  );
}
