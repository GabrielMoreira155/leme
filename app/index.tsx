import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useEstado } from '@/lib/estado';
import { cores } from '@/theme';

// Portão de entrada: decide para onde a pessoa vai ao abrir o app.
export default function Inicio() {
  const { estado, carregado, desbloqueado } = useEstado();

  if (!carregado) return <View style={{ flex: 1, backgroundColor: cores.areia }} />;
  if (estado.pin && !desbloqueado) return <Redirect href="/pin" />;
  if (estado.pausaAte && estado.pausaAte > Date.now()) return <Redirect href="/pausa" />;
  if (estado.plano) return <Redirect href="/hoje" />;
  if (estado.ficha) return <Redirect href="/plano" />;
  if (estado.consentimento) return <Redirect href="/ficha" />;
  return <Redirect href="/boas-vindas" />;
}
