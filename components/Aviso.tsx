import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import { useEstado } from '@/lib/estado';
import { cores, fontes, raio } from '@/theme';
import { Icone } from './Icone';

// Aviso flutuante de conquista (+XP). Turquesa para celebrar.
export function Aviso() {
  const { aviso } = useEstado();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: aviso ? 1 : 0, duration: 220, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [aviso, anim]);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        estilos.aviso,
        { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] },
      ]}
    >
      <Icone nome="estrela" size={18} cor={cores.oceano} />
      <Text style={estilos.texto}>{aviso ?? ''}</Text>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: cores.turquesa,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: raio.pilula,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  texto: { fontFamily: fontes.textoNegrito, fontSize: 15, color: cores.oceano },
});
