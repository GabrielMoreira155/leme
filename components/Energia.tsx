import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ENERGIA_MAX, formatarRecarga } from '@/lib/estado';
import { cores, espaco } from '@/theme';
import { Icone } from './Icone';
import { Texto } from './Texto';

type Props = {
  energia: number;
  recargaEm: number | null;
  /** Fundo escuro (cartão oceano). */
  escuro?: boolean;
};

// Energia: barquinhos cheios e apagados, "4 de 5" e o tempo real até recarregar.
export function Energia({ energia, recargaEm, escuro }: Props) {
  const [agora, setAgora] = useState(Date.now());

  // Atualiza o tempo que falta a cada 30s, e na hora quando a recarga muda.
  useEffect(() => {
    setAgora(Date.now());
    if (!recargaEm) return;
    const t = setInterval(() => setAgora(Date.now()), 30000);
    return () => clearInterval(t);
  }, [recargaEm]);

  const atual = recargaEm && agora >= recargaEm ? ENERGIA_MAX : energia;
  const recarga = atual < ENERGIA_MAX ? formatarRecarga(recargaEm, agora) : null;
  const corCheia = escuro ? cores.turquesa : cores.mare;
  const corApagada = escuro ? cores.branco : cores.neblina;
  const corTexto = escuro ? cores.branco : cores.oceano;
  const corApoio = escuro ? '#D7E2EC' : cores.neblina;

  return (
    <View
      accessible
      accessibilityLabel={`Energia: ${atual} de ${ENERGIA_MAX}${recarga ? `. Recarrega em ${recarga}` : ''}`}
      style={estilos.raiz}
    >
      <View style={estilos.linha}>
        <View style={estilos.barcos}>
          {Array.from({ length: ENERGIA_MAX }, (_, i) => (
            <View key={i} style={i < atual ? undefined : estilos.apagado}>
              <Icone nome="vela" size={22} cor={i < atual ? corCheia : corApagada} />
            </View>
          ))}
        </View>
        <Texto v="rotulo" style={{ color: corTexto, fontSize: 14 }}>
          {atual} de {ENERGIA_MAX}
        </Texto>
      </View>
      {recarga && (
        <Texto v="apoio" style={{ color: corApoio, fontSize: 13 }}>
          Recarrega em {recarga}
        </Texto>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { alignItems: 'flex-end', gap: 2 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  barcos: { flexDirection: 'row', gap: 4 },
  apagado: { opacity: 0.22 },
});
