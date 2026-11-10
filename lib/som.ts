import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Sons e vibração. Telas de crise nunca chamam nada daqui.
// O som de ondas da respiração fica em lib/ondas.ts (celular) e lib/ondas.web.ts (navegador).

let sininho: AudioPlayer | null = null;
let modoConfigurado = false;

async function prepararModo() {
  if (modoConfigurado) return;
  modoConfigurado = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
  } catch {}
}

// Sininho curto de conquista. Só toca se o som estiver ligado no app.
export function tocarSininho(somLigado: boolean) {
  if (!somLigado) return;
  prepararModo();
  try {
    if (!sininho) {
      sininho = createAudioPlayer(require('../assets/sounds/sininho.wav'));
      sininho.volume = 0.6;
    }
    sininho.seekTo(0);
    sininho.play();
  } catch {}
}

const temVibracao = Platform.OS === 'ios' || Platform.OS === 'android';

export function vibrarLeve() {
  if (temVibracao) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function vibrarSucesso() {
  if (temVibracao) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function vibrarSuave() {
  if (temVibracao) Haptics.selectionAsync().catch(() => {});
}
