// Gera os sons placeholder do protótipo, sem nenhum material de terceiros.
// Rodar com: node scripts/gerar-sons.js
const fs = require('fs');
const path = require('path');

const TAXA = 22050;

function salvarWav(arquivo, amostras) {
  const dados = Buffer.alloc(amostras.length * 2);
  amostras.forEach((v, i) => {
    const s = Math.max(-1, Math.min(1, v));
    dados.writeInt16LE(Math.round(s * 32767), i * 2);
  });
  const cab = Buffer.alloc(44);
  cab.write('RIFF', 0);
  cab.writeUInt32LE(36 + dados.length, 4);
  cab.write('WAVE', 8);
  cab.write('fmt ', 12);
  cab.writeUInt32LE(16, 16);
  cab.writeUInt16LE(1, 20);
  cab.writeUInt16LE(1, 22);
  cab.writeUInt32LE(TAXA, 24);
  cab.writeUInt32LE(TAXA * 2, 28);
  cab.writeUInt16LE(2, 32);
  cab.writeUInt16LE(16, 34);
  cab.write('data', 36);
  cab.writeUInt32LE(dados.length, 40);
  fs.writeFileSync(arquivo, Buffer.concat([cab, dados]));
}

// Ondas: ruído marrom (ruído branco integrado) com envelope no ritmo da respiração.
// Ciclo de 14s: 4s inspira (sobe), 4s segura (estável), 6s solta (desce). Fecha em loop.
function ondas() {
  const dur = 14;
  const n = dur * TAXA;
  const out = new Float32Array(n);
  let marrom = 0;
  let suave = 0;
  for (let i = 0; i < n; i++) {
    const t = i / TAXA;
    marrom = (marrom + (Math.random() * 2 - 1) * 0.02) * 0.998;
    suave += (marrom - suave) * 0.15;
    let env;
    if (t < 4) env = 0.25 + 0.75 * Math.sin((t / 4) * (Math.PI / 2)) ** 2;
    else if (t < 8) env = 1;
    else env = 0.25 + 0.75 * Math.cos(((t - 8) / 6) * (Math.PI / 2)) ** 2;
    out[i] = suave * 6 * env;
  }
  // normaliza
  const max = out.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  for (let i = 0; i < n; i++) out[i] = (out[i] / max) * 0.6;
  return out;
}

// Sininho: duas parciais senoidais com decaimento exponencial.
function sininho() {
  const n = Math.round(0.9 * TAXA);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / TAXA;
    const ataque = Math.min(1, t / 0.005);
    out[i] =
      ataque *
      Math.exp(-t * 5) *
      (0.5 * Math.sin(2 * Math.PI * 1318.5 * t) + 0.25 * Math.sin(2 * Math.PI * 1975.5 * t) + 0.12 * Math.sin(2 * Math.PI * 2637 * t));
  }
  return out;
}

const pasta = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(pasta, { recursive: true });
salvarWav(path.join(pasta, 'ondas.wav'), ondas());
salvarWav(path.join(pasta, 'sininho.wav'), sininho());
console.log('Sons gerados em', pasta);
