import { router } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores, espaco, fontes } from '@/theme';
import { BotaoIcone } from './Botao';

type Props = {
  titulo?: string;
  voltar?: boolean;
  aoVoltar?: () => void;
  direita?: ReactNode;
  claro?: boolean;
};

export function Cabecalho({ titulo, voltar = true, aoVoltar, direita, claro }: Props) {
  const cor = claro ? cores.branco : cores.oceano;
  return (
    <View style={estilos.linha}>
      <View style={estilos.lado}>
        {voltar && (
          <BotaoIcone
            icone="voltar"
            rotulo="Voltar"
            cor={cor}
            onPress={aoVoltar ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
          />
        )}
      </View>
      {titulo ? (
        <Text style={[estilos.titulo, { color: cor }]} numberOfLines={1} accessibilityRole="header">
          {titulo}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      <View style={[estilos.lado, { alignItems: 'flex-end' }]}>{direita}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: espaco.sm, paddingTop: espaco.xs, minHeight: 52 },
  lado: { width: 56 },
  titulo: { flex: 1, textAlign: 'center', fontFamily: fontes.tituloMedio, fontSize: 16 },
});
