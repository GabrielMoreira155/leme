// Som de ondas no navegador, gerado na hora com Web Audio (nenhum arquivo, nenhum direito autoral).
// Ruído marrom passa por um filtro passa-baixa; volume e brilho do filtro seguem a respiração:
// sobem na inspiração (4s), ficam parados na pausa (4s) e descem na expiração (6s).
// O navegador só libera áudio depois de um toque, por isso iniciar() é chamado dentro do toque em "Começar".

import type { FaseRespiracao } from './ondas';

const VOLUME_BAIXO = 0.025; // fim da expiração
const VOLUME_ALTO = 0.14; // topo da inspiração (volume baixo de propósito)
const FILTRO_BAIXO = 350;
const FILTRO_ALTO = 1100;
const FADE_ENTRADA = 1.5;
const FADE_SAIDA = 0.8;

let ctx: AudioContext | null = null;
let fonte: AudioBufferSourceNode | null = null;
let filtro: BiquadFilterNode | null = null;
let onda: GainNode | null = null; // envelope da respiração
let mestre: GainNode | null = null; // fade de entrada e saída
let pararEm: ReturnType<typeof setTimeout> | null = null;

function ruidoMarrom(contexto: AudioContext, segundos: number) {
  const buffer = contexto.createBuffer(1, contexto.sampleRate * segundos, contexto.sampleRate);
  const dados = buffer.getChannelData(0);
  let ultimo = 0;
  for (let i = 0; i < dados.length; i++) {
    ultimo = (ultimo + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    dados[i] = ultimo * 3.5;
  }
  return buffer;
}

function rampa(param: AudioParam, valor: number, segundos: number) {
  if (!ctx) return;
  const agora = ctx.currentTime;
  param.cancelScheduledValues(agora);
  param.setValueAtTime(param.value, agora);
  param.linearRampToValueAtTime(valor, agora + segundos);
}

export function iniciarOndas() {
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  if (!ctx) ctx = new Ctor();
  ctx.resume().catch(() => {});
  if (pararEm) {
    clearTimeout(pararEm);
    pararEm = null;
  }
  if (!fonte) {
    fonte = ctx.createBufferSource();
    fonte.buffer = ruidoMarrom(ctx, 4);
    fonte.loop = true;
    filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = FILTRO_BAIXO;
    filtro.Q.value = 0.7;
    onda = ctx.createGain();
    onda.gain.value = VOLUME_BAIXO;
    mestre = ctx.createGain();
    mestre.gain.value = 0;
    fonte.connect(filtro).connect(onda).connect(mestre).connect(ctx.destination);
    fonte.start();
  }
  rampa(mestre!.gain, 1, FADE_ENTRADA);
}

export function faseOndas(fase: FaseRespiracao, segundos: number) {
  if (!ctx || !onda || !filtro) return;
  if (fase === 'Inspira') {
    rampa(onda.gain, VOLUME_ALTO, segundos);
    rampa(filtro.frequency, FILTRO_ALTO, segundos);
  } else if (fase === 'Solta') {
    rampa(onda.gain, VOLUME_BAIXO, segundos);
    rampa(filtro.frequency, FILTRO_BAIXO, segundos);
  } else {
    // pausa: o mar fica parado onde está
    rampa(onda.gain, onda.gain.value, 0.05);
    rampa(filtro.frequency, filtro.frequency.value, 0.05);
  }
}

export function pararOndas() {
  if (!ctx || !mestre || !fonte) return;
  rampa(mestre.gain, 0, FADE_SAIDA);
  const f = fonte;
  pararEm = setTimeout(() => {
    try {
      f.stop();
    } catch {}
    fonte = null;
    pararEm = null;
  }, FADE_SAIDA * 1000 + 50);
}
