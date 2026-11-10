import { Redirect } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Botao, Cabecalho, Chip, Icone, Tela, Texto } from '@/components';
import { configGanho, Pergunta } from '@/data/ganhos';
import { useEstado } from '@/lib/estado';
import { formatarHoras, formatarReais } from '@/lib/ganhos';
import { voltar } from '@/lib/navegar';
import { cores, espaco, fontes, raio } from '@/theme';

// Base dos ganhos: uma pergunta curta (duas no álcool). Não fica na ficha inicial.
// Dado pessoal: fica só no aparelho.

function lerNumero(texto: string): number {
  const limpo = texto.replace(/[^\d,.]/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(limpo);
  return Number.isFinite(n) ? n : 0;
}

function rotuloExemplo(p: Pergunta, n: number) {
  if (p.unidade === 'reais') return formatarReais(n, false);
  if (p.unidade === 'horas') return formatarHoras(n);
  return `${n}x`;
}

export default function CalcularGanhos() {
  const { estado, carregado, atualizar, mostrarAviso } = useEstado();
  const ficha = estado.ficha;
  const config = ficha ? configGanho(ficha) : null;
  const anteriores = estado.ganhos.chave === config?.chave ? estado.ganhos.respostas : null;
  const [textos, setTextos] = useState<Record<string, string>>(() =>
    Object.fromEntries(Object.entries(anteriores ?? {}).map(([k, v]) => [k, String(v).replace('.', ',')])),
  );

  if (!carregado) return null;
  if (!ficha || !config || config.perguntas.length === 0) return <Redirect href="/hoje" />;

  const respostas = Object.fromEntries(config.perguntas.map((p) => [p.id, lerNumero(textos[p.id] ?? '')]));
  const completo = config.perguntas.every((p) => respostas[p.id] > 0);

  function salvar() {
    atualizar((e) => ({ ...e, ganhos: { ...e.ganhos, respostas, chave: config!.chave, recusou: false } }));
    mostrarAviso('Pronto. Seus ganhos estão na tela Hoje.');
    voltar('/hoje');
  }

  function naoInformar() {
    atualizar((e) => ({ ...e, ganhos: { ...e.ganhos, respostas: null, chave: config!.chave, recusou: true } }));
    voltar('/hoje');
  }

  return (
    <Tela
      topo={<Cabecalho titulo="Calcular meus ganhos" />}
      rodape={
        <>
          <Botao titulo="Ver meus ganhos" desabilitado={!completo} onPress={salvar} />
          <Botao titulo="Prefiro não informar" variante="fantasma" onPress={naoInformar} />
        </>
      }
    >
      <Texto v="h1">Leva 10 segundos</Texto>
      <Texto v="apoio" style={{ fontSize: 15 }}>
        Um valor aproximado já basta. A partir dele, a gente estima o que fica com você em cada dia cuidado.
      </Texto>

      {config.perguntas.map((p) => (
        <View key={p.id} style={{ gap: espaco.sm }}>
          <Texto v="h2">{p.texto}</Texto>
          {p.ajuda && <Texto v="apoio">{p.ajuda}</Texto>}
          <View style={estilos.linhaCampo}>
            {p.unidade === 'reais' && <Texto style={estilos.prefixo}>R$</Texto>}
            <TextInput
              value={textos[p.id] ?? ''}
              onChangeText={(t) => setTextos({ ...textos, [p.id]: t.replace(/[^\d,]/g, '').slice(0, 7) })}
              keyboardType={p.unidade === 'horas' ? 'decimal-pad' : 'number-pad'}
              inputMode={p.unidade === 'horas' ? 'decimal' : 'numeric'}
              placeholder="0"
              placeholderTextColor={cores.neblina}
              accessibilityLabel={p.texto}
              style={estilos.campo}
            />
            <Texto v="apoio" style={{ color: cores.oceano }}>
              {p.unidade === 'horas' ? `horas ${p.sufixo}` : p.sufixo}
            </Texto>
          </View>
          <View style={estilos.chips}>
            {p.exemplos.map((n) => (
              <Chip
                key={n}
                rotulo={rotuloExemplo(p, n)}
                selecionado={respostas[p.id] === n}
                onPress={() => setTextos({ ...textos, [p.id]: String(n) })}
              />
            ))}
          </View>
        </View>
      ))}

      <View style={estilos.nota}>
        <Icone nome="cadeado" size={18} cor={cores.mare} />
        <Texto v="apoio" style={{ flex: 1, color: cores.oceano }}>
          Fica só no seu aparelho. Dá para mudar quando quiser em "Como calculamos" ou no Perfil.
        </Texto>
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  linhaCampo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  prefixo: { fontFamily: fontes.tituloMedio, fontSize: 20, color: cores.oceano },
  campo: {
    width: 120,
    minHeight: 56,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    paddingHorizontal: 16,
    fontFamily: fontes.tituloMedio,
    fontSize: 22,
    color: cores.oceano,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  nota: { flexDirection: 'row', gap: espaco.sm, alignItems: 'center', padding: espaco.md, borderRadius: raio.md, backgroundColor: cores.turquesaSuave },
});
