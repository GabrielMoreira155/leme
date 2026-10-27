import { Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold } from '@expo-google-fonts/figtree';
import { Sora_700Bold, Sora_800ExtraBold } from '@expo-google-fonts/sora';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Aviso } from '@/components/Aviso';
import { EstadoProvider } from '@/lib/estado';
import { cores } from '@/theme';

export default function RootLayout() {
  const [fontesProntas] = useFonts({
    Sora_700Bold,
    Sora_800ExtraBold,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  if (!fontesProntas) return <View style={{ flex: 1, backgroundColor: cores.areia }} />;

  return (
    <SafeAreaProvider>
      <EstadoProvider>
        <StatusBar style="dark" />
        {/* No navegador, o app aparece numa coluna de celular centralizada. */}
        <View style={estilos.fora}>
          <View style={estilos.app}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.areia }, animation: 'slide_from_right' }}>
              <Stack.Screen name="apoio" options={{ animation: 'fade' }} />
              <Stack.Screen name="fissura" options={{ animation: 'fade', gestureEnabled: false }} />
            </Stack>
            <Aviso />
          </View>
        </View>
      </EstadoProvider>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  fora: { flex: 1, backgroundColor: Platform.OS === 'web' ? cores.oceano : cores.areia },
  app: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : undefined,
    alignSelf: 'center',
    backgroundColor: cores.areia,
    overflow: 'hidden',
  },
});
