import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Botao, Simbolo, Tela, Texto } from '@/components';
import { useEstado } from '@/lib/estado';
import { cores, espaco, fontes } from '@/theme';

// Bloqueio por PIN (simulado). Na versão real, o PIN ficaria no expo-secure-store
// e daria para usar a biometria do aparelho.

const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'apagar'];

export default function Pin() {
  const { estado, setDesbloqueado, atualizar } = useEstado();
  const [digitado, setDigitado] = useState('');
  const [errou, setErrou] = useState(false);
  const [esqueci, setEsqueci] = useState(false);

  function tecla(t: string) {
    if (t === 'apagar') return setDigitado(digitado.slice(0, -1));
    if (!t || digitado.length >= 4) return;
    const novo = digitado + t;
    setDigitado(novo);
    setErrou(false);
    if (novo.length === 4) {
      if (novo === estado.pin) {
        setDesbloqueado(true);
        router.replace('/');
      } else {
        setErrou(true);
        setTimeout(() => setDigitado(''), 400);
      }
    }
  }

  return (
    <Tela rolagem={false} conteudo={{ alignItems: 'center', justifyContent: 'center' }}>
      <Simbolo size={56} neutro={estado.modoDiscreto} />
      <Texto v="h1">{estado.modoDiscreto ? 'Hábitos' : 'Leme'}</Texto>
      <Texto v="apoio" accessibilityLiveRegion="polite">
        {errou ? 'Não bateu. Tenta de novo, com calma.' : 'Digite seu PIN'}
      </Texto>
      <View style={estilos.pontos} accessible accessibilityLabel={`${digitado.length} de 4 números digitados`}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[estilos.ponto, i < digitado.length && { backgroundColor: cores.oceano }]} />
        ))}
      </View>
      <View style={estilos.teclado}>
        {TECLAS.map((t, i) =>
          t ? (
            <Pressable
              key={i}
              onPress={() => tecla(t)}
              accessibilityRole="button"
              accessibilityLabel={t === 'apagar' ? 'Apagar' : t}
              style={({ pressed }) => [estilos.tecla, pressed && { backgroundColor: cores.areiaEscura }]}
            >
              <Texto style={[estilos.teclaTexto, t === 'apagar' && { fontSize: 15 }]}>{t === 'apagar' ? 'Apagar' : t}</Texto>
            </Pressable>
          ) : (
            <View key={i} style={estilos.tecla} />
          ),
        )}
      </View>
      {esqueci ? (
        <View style={{ gap: espaco.sm, alignItems: 'center' }}>
          <Texto v="apoio" style={{ textAlign: 'center' }}>
            No app real, você recupera o acesso pelo contato que cadastrar. No protótipo, dá para remover o PIN.
          </Texto>
          <Botao
            titulo="Remover PIN e entrar"
            variante="contorno"
            onPress={() => {
              atualizar((e) => ({ ...e, pin: null }));
              setDesbloqueado(true);
              router.replace('/');
            }}
          />
        </View>
      ) : (
        <Botao titulo="Esqueci o PIN" variante="fantasma" onPress={() => setEsqueci(true)} />
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  pontos: { flexDirection: 'row', gap: 16, marginVertical: espaco.md },
  ponto: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: cores.oceano },
  teclado: { flexDirection: 'row', flexWrap: 'wrap', width: 264, justifyContent: 'space-between', rowGap: 12 },
  tecla: { width: 76, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  teclaTexto: { fontFamily: fontes.tituloMedio, fontSize: 26, color: cores.oceano },
});
