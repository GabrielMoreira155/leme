// Testes simples da lógica de ganhos. Rodar com: npm test
// (Node 22.6+ roda TypeScript direto, sem configuração.)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calcularGanho,
  equivalenciaTempo,
  formatarHoras,
  formatarReais,
  type RespostaDia,
  valorDiario,
} from '../lib/ganhos.ts';

// 7 dias livres e 4 com menos que o normal (exemplo da folha "Como calculamos").
const registro: Record<string, RespostaDia> = {};
['01', '02', '03', '04', '05', '06', '07'].forEach((d) => (registro[`2026-11-${d}`] = 'livre'));
['08', '09', '10', '11'].forEach((d) => (registro[`2026-11-${d}`] = 'menos'));
registro['2026-11-12'] = 'sempre';

test('dinheiro: base semanal dividida por 7, livre soma tudo, menos soma metade', () => {
  const r = calcularGanho('dinheiro', 150, registro, 0);
  assert.equal(formatarReais(r.valorDia), 'R$ 21,43');
  assert.equal(r.livres, 7);
  assert.equal(r.menos, 4);
  assert.equal(r.diasContados, 11);
  assert.equal(formatarReais(r.total), 'R$ 192,86'); // 150/7 x (7 + 4 x 0,5)
});

test('tempo: base em horas por dia', () => {
  const r = calcularGanho('tempo', 4, registro, 0);
  assert.equal(r.valorDia, 4);
  assert.equal(r.total, 36); // 4 x 7 + 2 x 4
  assert.equal(formatarHoras(r.total), '36h');
});

test('noites: conta só as noites marcadas como livres (dormiu no horário)', () => {
  const r = calcularGanho('noites', null, registro, 0);
  assert.equal(r.total, 7);
});

test('ondas: conta as ondas atravessadas, sem base', () => {
  const r = calcularGanho('ondas', null, registro, 11);
  assert.equal(r.total, 11);
});

test('nenhum: sem ganho', () => {
  assert.equal(calcularGanho('nenhum', 100, registro, 3).total, 0);
});

test('nunca negativo: "como sempre" soma zero e base ausente dá zero', () => {
  assert.equal(calcularGanho('dinheiro', 100, { '2026-11-01': 'sempre' }, 0).total, 0);
  assert.equal(calcularGanho('dinheiro', null, registro, 0).total, 0);
  assert.equal(valorDiario('dinheiro', -50), 0);
});

test('dias sem resposta não contam', () => {
  assert.equal(calcularGanho('dinheiro', 70, {}, 0).total, 0);
});

test('formatos brasileiros', () => {
  assert.equal(formatarReais(1234.5), 'R$ 1.234,50');
  assert.equal(formatarReais(1234.5, false), 'R$ 1.235');
  assert.equal(formatarHoras(1.5), '1h30');
  assert.equal(formatarHoras(12), '12h');
  assert.equal(formatarHoras(0.5), '30 min');
});

test('equivalência de tempo muda conforme o sorteio', () => {
  assert.equal(equivalenciaTempo(12, 0), 'dá umas 6 sessões de filme');
  assert.equal(equivalenciaTempo(12, 0.99), 'são 3 tardes livres');
  assert.equal(equivalenciaTempo(0.2, 0.5), null);
});
