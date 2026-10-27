import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEstado } from '@/lib/estado';
import { cores, espaco, fontes, raio, TOQUE_MIN } from '@/theme';
import { BotaoIcone } from './Botao';
import { Icone } from './Icone';
import { Simbolo } from './Simbolo';

// Topo fixo do app principal: marca, mudo, perfil e o botão "Ajuda agora".
export function Topo() {
  const { estado, atualizar } = useEstado();
  const insets = useSafeAreaInsets();
  const discreto = estado.modoDiscreto;
  return (
    <View style={[estilos.topo, { paddingTop: insets.top + espaco.sm }]}>
      <View style={estilos.marca}>
        <Simbolo size={28} neutro={discreto} />
        <Text style={estilos.nome}>{discreto ? 'Hábitos' : 'Leme'}</Text>
      </View>
      <View style={estilos.acoes}>
        <BotaoIcone
          icone={estado.somLigado ? 'somLigado' : 'somDesligado'}
          rotulo={estado.somLigado ? 'Desligar sons do app' : 'Ligar sons do app'}
          onPress={() => atualizar((e) => ({ ...e, somLigado: !e.somLigado }))}
        />
        <BotaoIcone icone="pessoa" rotulo="Perfil e privacidade" onPress={() => router.push('/perfil')} />
        <Pressable
          onPress={() => router.push('/apoio')}
          accessibilityRole="button"
          accessibilityLabel="Ajuda agora"
          accessibilityHint="Abre contatos de apoio imediato"
          style={({ pressed }) => [estilos.ajuda, pressed && { opacity: 0.85 }]}
        >
          <Icone nome="boia" size={18} cor={cores.branco} />
          <Text style={estilos.ajudaTexto}>Ajuda agora</Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  topo: {
    backgroundColor: cores.areia,
    paddingHorizontal: espaco.lg,
    paddingBottom: espaco.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: cores.linha,
  },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nome: { fontFamily: fontes.titulo, fontSize: 20, color: cores.oceano },
  acoes: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ajuda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: TOQUE_MIN,
    paddingHorizontal: 14,
    borderRadius: raio.pilula,
    backgroundColor: cores.oceano,
    marginLeft: 4,
  },
  ajudaTexto: { fontFamily: fontes.textoNegrito, fontSize: 14, color: cores.branco },
});
