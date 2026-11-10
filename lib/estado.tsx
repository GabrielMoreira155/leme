import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { criarEstadoDemo, DEMOS, NomeDemo } from './demo';
import type { RespostaDia } from './ganhos';
import type { Ficha, Plano } from './plano';

// Todo o estado do protótipo vive no aparelho (AsyncStorage). Não existe backend.
const CHAVE = '@leme/estado/v1';

export const XP_POR_NIVEL = 200;
export const ENERGIA_MAX = 5;
export const RECARGA_MS = 2 * 60 * 60 * 1000; // 2 horas

export type Humor = 'bem' | 'mais-ou-menos' | 'dificil';

export type TipoDestino = 'guardar' | 'conta' | 'presente' | 'viagem' | 'outro';
export type Destino = { tipo: TipoDestino; texto?: string; alvo?: number };

// Base dos ganhos, destino do dinheiro e respostas de "Como foi hoje". Dado pessoal: fica só no
// aparelho, aparece em "O que está guardado" e é apagado no "Apagar tudo" e no reset.
export type Ganhos = {
  /** Respostas da tela "Calcular meus ganhos" (ex.: { valor: 150 } ou { vezes: 3, porVez: 40 }). */
  respostas: Record<string, number> | null;
  /** Para qual tema a base foi informada (ver data/ganhos.ts). */
  chave: string | null;
  /** Escolheu "Prefiro não informar". */
  recusou: boolean;
  destino: Destino | null;
};

export type Estado = {
  consentimento: { plano: boolean; melhorias: boolean; em: string } | null;
  ficha: Ficha | null;
  plano: Plano | null;
  xp: number;
  diasCuidados: string[];
  energia: number;
  energiaRecargaEm: number | null;
  missoes: { data: string; feitas: string[] };
  questFeita: string | null;
  recomeco: string | null;
  humor: { data: string; valor: Humor }[];
  artigosLidos: string[];
  tropecos: { em: string; gatilhos: string[] }[];
  diario: { em: string; gatilhos: string[]; intensidade: number; nota: string }[];
  horaDificil: { sinais: string; faco: string; chamo: string } | null;
  cartas: { em: string; abreEm: string; texto: string }[];
  sessoes: { id: string; tipo: string; com: string; horario: string; em: string }[];
  fissurasAtravessadas: number;
  ganhos: Ganhos;
  /** "Como foi hoje com ...?" por data (AAAA-MM-DD). */
  registroDiario: Record<string, RespostaDia>;
  /** Textos do "Outro" que o app não reconheceu. Só no aparelho e só com o aceite opcional. */
  textosNaoReconhecidos: { texto: string; em: string }[];
  somLigado: boolean;
  jaRespirou: boolean;
  modoDiscreto: boolean;
  pin: string | null;
  pausaAte: number | null;
  /** Força o número da semana anterior (só o painel de apresentação usa). Sem isso, conta os dias reais. */
  semanaAnterior: number | null;
};

export const ESTADO_INICIAL: Estado = {
  consentimento: null,
  ficha: null,
  plano: null,
  xp: 0,
  diasCuidados: [],
  energia: ENERGIA_MAX,
  energiaRecargaEm: null,
  missoes: { data: '', feitas: [] },
  questFeita: null,
  recomeco: null,
  humor: [],
  artigosLidos: [],
  tropecos: [],
  diario: [],
  horaDificil: null,
  cartas: [],
  sessoes: [],
  fissurasAtravessadas: 0,
  textosNaoReconhecidos: [],
  ganhos: { respostas: null, chave: null, recusou: false, destino: null },
  registroDiario: {},
  somLigado: false, // som desligado por padrão fora da respiração
  jaRespirou: false,
  modoDiscreto: false,
  pin: null,
  pausaAte: null,
  semanaAnterior: null,
};

// Data local no formato AAAA-MM-DD.
export function hoje(d = new Date()): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dia = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${dia}`;
}

// Os 7 dias da semana atual, de segunda a domingo.
export function diasDaSemana(base = new Date()): string[] {
  const d = new Date(base);
  const dow = (d.getDay() + 6) % 7; // segunda = 0
  d.setDate(d.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    return hoje(x);
  });
}

export function nivelXP(xp: number) {
  return {
    nivel: Math.floor(xp / XP_POR_NIVEL) + 1,
    noNivel: xp % XP_POR_NIVEL,
  };
}

// Só compara com a semana anterior quando ela existe: 7 dias desde o primeiro uso (consentimento),
// ou um porto já alcançado (inclusive pela simulação do painel de apresentação).
export function temSemanaCompleta(e: Estado): boolean {
  if ((e.plano?.semana ?? 0) > 0) return true;
  const inicio = e.consentimento?.em ?? e.plano?.criadoEm;
  return !!inicio && Date.now() - new Date(inicio).getTime() >= 7 * 86400000;
}

// Tempo que falta para a energia encher, no formato "1h40", "2h" ou "25 min".
export function formatarRecarga(recargaEm: number | null, agora = Date.now()): string {
  const restante = Math.ceil(((recargaEm ?? agora + RECARGA_MS) - agora) / 60000);
  const min = Math.min(RECARGA_MS / 60000, Math.max(1, restante));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

// Dias cuidados na semana anterior à atual.
export function diasSemanaAnterior(e: Estado): number {
  if (e.semanaAnterior !== null) return e.semanaAnterior;
  const base = new Date();
  base.setDate(base.getDate() - 7);
  return diasDaSemana(base).filter((d) => e.diasCuidados.includes(d)).length;
}

export const TITULOS_NIVEL = ['Grumete', 'Marujo', 'Timoneiro', 'Navegador', 'Capitão'];

type Contexto = {
  estado: Estado;
  carregado: boolean;
  desbloqueado: boolean;
  setDesbloqueado: (v: boolean) => void;
  atualizar: (fn: (e: Estado) => Estado) => void;
  ganharXP: (n: number, motivo?: string) => void;
  marcarDiaCuidado: () => void;
  gastarEnergia: () => boolean;
  aviso: string | null;
  mostrarAviso: (texto: string) => void;
  resetar: () => Promise<void>;
};

const Ctx = createContext<Contexto | null>(null);

function normalizar(e: Estado): Estado {
  let r = e;
  // Energia recarrega sozinha depois de 2h.
  if (r.energiaRecargaEm && Date.now() >= r.energiaRecargaEm) {
    r = { ...r, energia: ENERGIA_MAX, energiaRecargaEm: null };
  }
  // Missões zeram a cada dia (as concluídas continuam contando nos dias cuidados e no XP).
  if (r.missoes.data !== hoje()) {
    r = { ...r, missoes: { data: hoje(), feitas: [] } };
  }
  return r;
}

// Lê um parâmetro da URL de abertura (?reset=1, ?demo=apostas). No navegador, também tira o
// parâmetro da barra para um recarregar não repetir a ação.
async function parametroDeAbertura(nome: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') return null;
    const url = new URL(window.location.href);
    const valor = url.searchParams.get(nome);
    if (valor === null) return null;
    url.searchParams.delete(nome);
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    return valor;
  }
  const inicial = await Linking.getInitialURL();
  const achado = inicial?.match(new RegExp(`[?&]${nome}=([^&#]*)`));
  return achado ? decodeURIComponent(achado[1]) : null;
}

// Protótipo publicado para apresentações: cada nova visita ao link (aba nova, janela nova, link
// colado de novo) começa na tela de boas-vindas, do zero. Recarregar a página na mesma aba mantém
// o progresso, porque a marca fica no sessionStorage, que dura enquanto a aba estiver aberta.
// Só vale no navegador; no celular o app guarda tudo normalmente.
const MARCA_VISITA = '@leme/visita-em-andamento';

function novaVisitaNoNavegador(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  try {
    if (window.sessionStorage.getItem(MARCA_VISITA)) return false;
    window.sessionStorage.setItem(MARCA_VISITA, '1');
    return true;
  } catch {
    return false;
  }
}

export function EstadoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(ESTADO_INICIAL);
  const [carregado, setCarregado] = useState(false);
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Atalhos para apresentações:
        //   ?reset=1        começa do zero
        //   ?demo=apostas   (ou celular, outro) começa com ficha, base e alguns dias de histórico
        //   nova visita     no navegador, abrir o link de novo também começa do zero
        const reset = (await parametroDeAbertura('reset')) === '1' || novaVisitaNoNavegador();
        const demo = await parametroDeAbertura('demo');
        if (reset || demo) await AsyncStorage.clear();
        if (demo && (DEMOS as string[]).includes(demo)) {
          setEstado(normalizar(criarEstadoDemo(demo as NomeDemo, ESTADO_INICIAL)));
          return;
        }
        if (reset) return;
        const txt = await AsyncStorage.getItem(CHAVE);
        if (txt) setEstado(normalizar({ ...ESTADO_INICIAL, ...JSON.parse(txt) }));
      } catch {
      } finally {
        setCarregado(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (carregado) AsyncStorage.setItem(CHAVE, JSON.stringify(estado)).catch(() => {});
  }, [estado, carregado]);

  const atualizar = useCallback((fn: (e: Estado) => Estado) => {
    setEstado((e) => normalizar(fn(normalizar(e))));
  }, []);

  const mostrarAviso = useCallback((texto: string) => {
    setAviso(texto);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAviso(null), 2400);
  }, []);

  const marcarDiaCuidado = useCallback(() => {
    atualizar((e) => (e.diasCuidados.includes(hoje()) ? e : { ...e, diasCuidados: [...e.diasCuidados, hoje()] }));
  }, [atualizar]);

  const ganharXP = useCallback(
    (n: number, motivo?: string) => {
      atualizar((e) => ({ ...e, xp: e.xp + n }));
      marcarDiaCuidado();
      mostrarAviso(motivo ? `+${n} XP · ${motivo}` : `+${n} XP`);
    },
    [atualizar, marcarDiaCuidado, mostrarAviso],
  );

  // Retorna false quando não há energia. Nunca é chamada pela respiração nem pela fissura.
  const gastarEnergia = useCallback(() => {
    const atual = normalizar(estado);
    if (atual.energia <= 0) return false;
    atualizar((e) => {
      const energia = Math.max(0, e.energia - 1);
      // A recarga completa conta a partir da primeira energia gasta.
      return { ...e, energia, energiaRecargaEm: e.energiaRecargaEm ?? Date.now() + RECARGA_MS };
    });
    return true;
  }, [estado, atualizar]);

  const resetar = useCallback(async () => {
    await AsyncStorage.clear();
    setEstado({ ...ESTADO_INICIAL, missoes: { data: hoje(), feitas: [] } });
    setDesbloqueado(false);
  }, []);

  const valor = useMemo(
    () => ({ estado, carregado, desbloqueado, setDesbloqueado, atualizar, ganharXP, marcarDiaCuidado, gastarEnergia, aviso, mostrarAviso, resetar }),
    [estado, carregado, desbloqueado, atualizar, ganharXP, marcarDiaCuidado, gastarEnergia, aviso, mostrarAviso, resetar],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useEstado() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useEstado precisa estar dentro de EstadoProvider');
  return c;
}
