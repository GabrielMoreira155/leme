import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Ficha, Plano } from './plano';

// Todo o estado do protótipo vive no aparelho (AsyncStorage). Não existe backend.
const CHAVE = '@leme/estado/v1';

export const XP_POR_NIVEL = 200;
export const ENERGIA_MAX = 5;
export const RECARGA_MS = 2 * 60 * 60 * 1000; // 2 horas

export type Humor = 'bem' | 'mais-ou-menos' | 'dificil';

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
  somLigado: boolean;
  jaRespirou: boolean;
  modoDiscreto: boolean;
  pin: string | null;
  pausaAte: number | null;
  /** Dias cuidados na semana anterior (simulado para mostrar a comparação). */
  semanaAnterior: number;
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
  somLigado: false, // som desligado por padrão fora da respiração
  jaRespirou: false,
  modoDiscreto: false,
  pin: null,
  pausaAte: null,
  semanaAnterior: 2,
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

export function EstadoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(ESTADO_INICIAL);
  const [carregado, setCarregado] = useState(false);
  const [desbloqueado, setDesbloqueado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE)
      .then((txt) => {
        if (txt) setEstado(normalizar({ ...ESTADO_INICIAL, ...JSON.parse(txt) }));
      })
      .catch(() => {})
      .finally(() => setCarregado(true));
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
      return { ...e, energia, energiaRecargaEm: energia === 0 ? Date.now() + RECARGA_MS : e.energiaRecargaEm };
    });
    return true;
  }, [estado, atualizar]);

  const resetar = useCallback(async () => {
    await AsyncStorage.removeItem(CHAVE);
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
