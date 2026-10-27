import { Href, router } from 'expo-router';

// Volta uma tela, ou vai para um destino seguro quando não há histórico (ex.: link direto no navegador).
export function voltar(destino: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(destino);
}
