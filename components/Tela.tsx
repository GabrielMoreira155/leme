import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, espaco } from '@/theme';

type Props = {
  children: ReactNode;
  /** Conteúdo fixo no rodapé (ex.: botão principal). */
  rodape?: ReactNode;
  /** Conteúdo fixo no topo (ex.: cabeçalho com voltar). */
  topo?: ReactNode;
  fundo?: string;
  rolagem?: boolean;
  semTopoSeguro?: boolean;
  conteudo?: ViewStyle;
};

export function Tela({ children, rodape, topo, fundo = cores.areia, rolagem = true, semTopoSeguro, conteudo }: Props) {
  return (
    <SafeAreaView style={[estilos.raiz, { backgroundColor: fundo }]} edges={semTopoSeguro ? ['bottom'] : ['top', 'bottom']}>
      {topo}
      {rolagem ? (
        <ScrollView contentContainerStyle={[estilos.conteudo, conteudo]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[estilos.conteudo, { flex: 1 }, conteudo]}>{children}</View>
      )}
      {rodape && <View style={[estilos.rodape, { backgroundColor: fundo }]}>{rodape}</View>}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  conteudo: { padding: espaco.xl, paddingBottom: espaco.xxl, gap: espaco.lg },
  rodape: { paddingHorizontal: espaco.xl, paddingTop: espaco.md, paddingBottom: espaco.lg, gap: espaco.sm },
});
