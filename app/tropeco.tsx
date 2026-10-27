import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Botao, Cabecalho, Cartao, Chip, Icone, Tela, Texto, Tuga } from '@/components';
import { hoje, useEstado } from '@/lib/estado';
import { cores, espaco } from '@/theme';

const GATILHOS = ['Tédio', 'Estresse', 'Sozinho à noite', 'Briga ou frustração', 'Celular na cama', 'Outro'];

// Tropeço não é falha: nível e dias cuidados continuam intactos.
export default function Tropeco() {
  const { atualizar, mostrarAviso } = useEstado();
  const [gatilhos, setGatilhos] = useState<string[]>([]);

  function voltar() {
    atualizar((e) => ({
      ...e,
      tropecos: [...e.tropecos, { em: new Date().toISOString(), gatilhos }],
      recomeco: hoje(),
    }));
    mostrarAviso('Missão de recomeço no seu dia');
    router.replace('/hoje');
  }

  return (
    <Tela topo={<Cabecalho />} rodape={<Botao titulo="Voltar com missão de recomeço" onPress={voltar} />}>
      <View style={{ alignItems: 'center', gap: espaco.md }}>
        <Tuga pose="acolhe" size={200} />
        <Texto v="h1" style={{ textAlign: 'center' }}>
          Onda forte, né? A gente ajusta a rota.
        </Texto>
      </View>

      <Cartao tom="turquesa" style={{ flexDirection: 'row', gap: espaco.md }}>
        <Icone nome="check" cor={cores.mare} />
        <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
          Seu nível e seus dias cuidados continuam aqui. Nada do que você construiu se perdeu.
        </Texto>
      </Cartao>

      <View style={{ gap: espaco.sm }}>
        <Texto v="h3">O que veio antes? (opcional)</Texto>
        <Texto v="apoio">Saber o gatilho ajuda a preparar a próxima travessia.</Texto>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm, marginTop: espaco.xs }}>
          {GATILHOS.map((g) => {
            const sel = gatilhos.includes(g);
            return (
              <Chip
                key={g}
                multiplo
                rotulo={g}
                selecionado={sel}
                onPress={() => setGatilhos(sel ? gatilhos.filter((x) => x !== g) : [...gatilhos, g])}
              />
            );
          })}
        </View>
      </View>

      <Botao titulo="Quero conversar com alguém" variante="fantasma" icone="conversa" onPress={() => router.push('/sessoes')} />
    </Tela>
  );
}
