// Som de ondas no celular: arquivo curto (assets/sounds/ondas.wav, ver CREDITS.md) com um ciclo
// de 14s já no ritmo 4, 4, 6. No navegador quem toca é lib/ondas.web.ts, com Web Audio.

import { AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export type FaseRespiracao = 'Inspira' | 'Segura' | 'Solta';

const VOLUME = 0.45;
const PASSOS = 15;

let player: AudioPlayer | null = null;
let fade: ReturnType<typeof setInterval> | null = null;

function fadeAte(alvo: number, ms: number, depois?: () => void) {
  if (!player) return;
  if (fade) clearInterval(fade);
  const p = player;
  const inicio = p.volume;
  let passo = 0;
  fade = setInterval(() => {
    passo++;
    p.volume = inicio + ((alvo - inicio) * passo) / PASSOS;
    if (passo >= PASSOS) {
      clearInterval(fade!);
      fade = null;
      depois?.();
    }
  }, ms / PASSOS);
}

export function iniciarOndas() {
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
  try {
    if (!player) {
      player = createAudioPlayer(require('../assets/sounds/ondas.wav'));
      player.loop = true;
    }
    player.volume = 0;
    player.seekTo(0);
    player.play();
    fadeAte(VOLUME, 1500);
  } catch {}
}

// O arquivo já acompanha o ritmo. Na inspiração, realinha o começo do ciclo.
export function faseOndas(fase: FaseRespiracao, _segundos?: number) {
  if (fase === 'Inspira' && player?.playing) player.seekTo(0).catch(() => {});
}

export function pararOndas() {
  fadeAte(0, 800, () => {
    try {
      player?.pause();
    } catch {}
  });
}
