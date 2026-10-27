import { Tabs } from 'expo-router';
import { Icone, NomeIcone, Topo } from '@/components';
import { cores, fontes } from '@/theme';

function icone(nome: NomeIcone) {
  return ({ color }: { color: unknown }) => <Icone nome={nome} cor={String(color ?? cores.neblina)} />;
}

export default function AbasLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <Topo />,
        tabBarActiveTintColor: cores.mare,
        tabBarInactiveTintColor: cores.neblina,
        tabBarStyle: { backgroundColor: cores.cartao, borderTopColor: cores.linha, height: 68, paddingTop: 6, paddingBottom: 10 },
        tabBarLabelStyle: { fontFamily: fontes.textoForte, fontSize: 12 },
        sceneStyle: { backgroundColor: cores.areia },
      }}
    >
      <Tabs.Screen name="hoje" options={{ title: 'Hoje', tabBarIcon: icone('leme') }} />
      <Tabs.Screen name="atividades" options={{ title: 'Atividades', tabBarIcon: icone('onda') }} />
      <Tabs.Screen name="artigos" options={{ title: 'Artigos', tabBarIcon: icone('livro') }} />
      <Tabs.Screen name="sessoes" options={{ title: 'Sessões', tabBarIcon: icone('conversa') }} />
    </Tabs>
  );
}
