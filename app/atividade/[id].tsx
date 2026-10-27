import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { BarraProgresso, Botao, Cabecalho, Cartao, Chip, Icone, Tela, Texto, Tuga } from '@/components';
import { ATIVIDADES, IdAtividade, PASSOS_SURFAR, XP_ATIVIDADE } from '@/data/atividades';
import { useEstado } from '@/lib/estado';
import { cores, espaco, fontes, raio } from '@/theme';

const GATILHOS = ['Tédio', 'Estresse', 'Sozinho à noite', 'Briga ou frustração', 'Celular na cama', 'Cansaço', 'Festa ou encontro', 'Outro'];

export default function AtividadeTela() {
  const { id } = useLocalSearchParams<{ id: IdAtividade }>();
  const atividade = ATIVIDADES.find((a) => a.id === id);
  const { ganharXP } = useEstado();
  const [concluida, setConcluida] = useState(false);

  if (!atividade) return <Redirect href="/atividades" />;

  function concluir() {
    ganharXP(XP_ATIVIDADE, atividade!.titulo.toLowerCase());
    setConcluida(true);
  }

  if (concluida) {
    return (
      <Tela topo={<Cabecalho titulo={atividade.titulo} />} rodape={<Botao titulo="Voltar" onPress={() => router.back()} />}>
        <View style={{ alignItems: 'center', gap: espaco.lg, marginTop: espaco.xxl }}>
          <Tuga pose="comemora" size={200} />
          <Texto v="h1" style={{ textAlign: 'center' }}>
            Feito. Mais uma milha.
          </Texto>
          <Texto v="corpo" style={{ textAlign: 'center' }}>
            Isso fica guardado só com você.
          </Texto>
        </View>
      </Tela>
    );
  }

  return (
    <>
      {id === 'surfar' && <Surfar titulo={atividade.titulo} aoConcluir={concluir} />}
      {id === 'diario' && <Diario titulo={atividade.titulo} aoConcluir={concluir} />}
      {id === 'hora-dificil' && <HoraDificil titulo={atividade.titulo} aoConcluir={concluir} />}
      {id === 'carta' && <Carta titulo={atividade.titulo} aoConcluir={concluir} />}
    </>
  );
}

type PropsAtividade = { titulo: string; aoConcluir: () => void };

function Nota({ valor, aoMudar }: { valor: number | null; aoMudar: (n: number) => void }) {
  return (
    <View style={estilos.notas} accessibilityRole="radiogroup">
      {Array.from({ length: 11 }, (_, n) => (
        <Chip key={n} rotulo={`${n}`} selecionado={valor === n} onPress={() => aoMudar(n)} />
      ))}
    </View>
  );
}

function Surfar({ titulo, aoConcluir }: PropsAtividade) {
  const [passo, setPasso] = useState(0);
  const [antes, setAntes] = useState<number | null>(null);
  const [depois, setDepois] = useState<number | null>(null);
  const p = PASSOS_SURFAR[passo];
  const ultimo = passo === PASSOS_SURFAR.length - 1;
  const bloqueado = (passo === 1 && antes === null) || (ultimo && depois === null);

  return (
    <Tela
      topo={
        <View>
          <Cabecalho titulo={titulo} />
          <View style={{ paddingHorizontal: espaco.xl }}>
            <BarraProgresso valor={(passo + 1) / PASSOS_SURFAR.length} rotulo="Progresso" />
          </View>
        </View>
      }
      rodape={<Botao titulo={ultimo ? 'Concluir' : 'Próximo'} desabilitado={bloqueado} onPress={() => (ultimo ? aoConcluir() : setPasso(passo + 1))} />}
    >
      <View style={{ alignItems: 'center' }}>
        <Tuga pose={passo === 3 ? 'respira' : 'padrao'} size={150} />
      </View>
      <Texto v="h1">{p.titulo}</Texto>
      <Texto v="corpo">{p.texto}</Texto>
      {passo === 1 && <Nota valor={antes} aoMudar={setAntes} />}
      {ultimo && <Nota valor={depois} aoMudar={setDepois} />}
      {ultimo && antes !== null && depois !== null && (
        <Cartao tom="turquesa">
          <Texto v="corpo">
            {depois < antes
              ? `A onda foi de ${antes} para ${depois}. Você surfou ela.`
              : 'A onda ainda está alta, e tudo bem. Você ficou na prancha. Se quiser, respire mais um pouco.'}
          </Texto>
        </Cartao>
      )}
    </Tela>
  );
}

function Diario({ titulo, aoConcluir }: PropsAtividade) {
  const { estado, atualizar } = useEstado();
  const [gatilhos, setGatilhos] = useState<string[]>([]);
  const [intensidade, setIntensidade] = useState<number | null>(null);
  const [nota, setNota] = useState('');

  function salvar() {
    atualizar((e) => ({ ...e, diario: [...e.diario, { em: new Date().toISOString(), gatilhos, intensidade: intensidade ?? 0, nota }] }));
    aoConcluir();
  }

  // Mapa simples dos gatilhos mais frequentes
  const contagem: Record<string, number> = {};
  estado.diario.forEach((d) => d.gatilhos.forEach((g) => (contagem[g] = (contagem[g] ?? 0) + 1)));
  const top = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <Tela topo={<Cabecalho titulo={titulo} />} rodape={<Botao titulo="Salvar no diário" desabilitado={gatilhos.length === 0} onPress={salvar} />}>
      <Texto v="h1">O que veio antes da vontade?</Texto>
      <View style={estilos.chips}>
        {GATILHOS.map((g) => {
          const sel = gatilhos.includes(g);
          return <Chip key={g} multiplo rotulo={g} selecionado={sel} onPress={() => setGatilhos(sel ? gatilhos.filter((x) => x !== g) : [...gatilhos, g])} />;
        })}
      </View>
      <Texto v="h3">Força da vontade, de 0 a 10</Texto>
      <Nota valor={intensidade} aoMudar={setIntensidade} />
      <Texto v="h3">Quer anotar algo? (opcional)</Texto>
      <TextInput
        value={nota}
        onChangeText={setNota}
        placeholder="Onde você estava, o que sentiu..."
        placeholderTextColor={cores.neblina}
        multiline
        accessibilityLabel="Anotação do diário"
        style={[estilos.campo, { minHeight: 100 }]}
      />
      {top.length > 0 && (
        <Cartao tom="areia" style={{ gap: espaco.sm }}>
          <View style={{ flexDirection: 'row', gap: espaco.sm, alignItems: 'center' }}>
            <Icone nome="mapa" cor={cores.mare} />
            <Texto v="h3">Seu mapa até aqui</Texto>
          </View>
          {top.map(([g, n]) => (
            <Texto key={g} v="apoio">
              {g}: {n} {n === 1 ? 'vez' : 'vezes'}
            </Texto>
          ))}
        </Cartao>
      )}
    </Tela>
  );
}

function HoraDificil({ titulo, aoConcluir }: PropsAtividade) {
  const { estado, atualizar } = useEstado();
  const [sinais, setSinais] = useState(estado.horaDificil?.sinais ?? '');
  const [faco, setFaco] = useState(estado.horaDificil?.faco ?? '');
  const [chamo, setChamo] = useState(estado.horaDificil?.chamo ?? '');

  function salvar() {
    atualizar((e) => ({ ...e, horaDificil: { sinais, faco, chamo } }));
    aoConcluir();
  }

  const campos = [
    { rotulo: 'Meus sinais de que a hora difícil está chegando', valor: sinais, set: setSinais, dica: 'Ex.: fico inquieto à noite, começo a ver jogos' },
    { rotulo: 'O que eu faço quando ela chegar', valor: faco, set: setFaco, dica: 'Ex.: tomo banho, saio para andar, abro o Leme' },
    { rotulo: 'Para quem eu posso chamar', valor: chamo, set: setChamo, dica: 'Ex.: minha irmã, um amigo, o CVV 188' },
  ];

  return (
    <Tela topo={<Cabecalho titulo={titulo} />} rodape={<Botao titulo="Guardar meu plano" desabilitado={!sinais || !faco || !chamo} onPress={salvar} />}>
      <Texto v="h1">Um farol para a hora difícil</Texto>
      <Texto v="apoio">Escrito com calma agora, para usar quando o mar estiver agitado.</Texto>
      {campos.map((c) => (
        <View key={c.rotulo} style={{ gap: espaco.sm }}>
          <Texto v="h3">{c.rotulo}</Texto>
          <TextInput
            value={c.valor}
            onChangeText={c.set}
            placeholder={c.dica}
            placeholderTextColor={cores.neblina}
            multiline
            accessibilityLabel={c.rotulo}
            style={estilos.campo}
          />
        </View>
      ))}
    </Tela>
  );
}

function Carta({ titulo, aoConcluir }: PropsAtividade) {
  const { estado, atualizar } = useEstado();
  const [texto, setTexto] = useState('');
  const abreEm = new Date(Date.now() + 30 * 86400000);
  const ultima = estado.cartas[estado.cartas.length - 1];

  function salvar() {
    atualizar((e) => ({ ...e, cartas: [...e.cartas, { em: new Date().toISOString(), abreEm: abreEm.toISOString(), texto }] }));
    aoConcluir();
  }

  return (
    <Tela topo={<Cabecalho titulo={titulo} />} rodape={<Botao titulo="Lacrar a carta" desabilitado={texto.trim().length < 5} onPress={salvar} />}>
      <Texto v="h1">Uma carta para você daqui a 30 dias</Texto>
      <Texto v="apoio">
        O que você quer dizer para a pessoa que vai estar aqui em {abreEm.toLocaleDateString('pt-BR')}? Ela só abre nesse dia.
      </Texto>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Oi, eu do futuro..."
        placeholderTextColor={cores.neblina}
        multiline
        accessibilityLabel="Texto da carta"
        style={[estilos.campo, { minHeight: 180 }]}
      />
      {ultima && (
        <Cartao tom="areia" style={{ flexDirection: 'row', gap: espaco.md, alignItems: 'center' }}>
          <Icone nome="carta" cor={cores.mare} />
          <Texto v="apoio" style={{ flex: 1 }}>
            Você já tem uma carta lacrada. Ela abre em {new Date(ultima.abreEm).toLocaleDateString('pt-BR')}.
          </Texto>
        </Cartao>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  notas: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  campo: {
    minHeight: 72,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    padding: 16,
    fontFamily: fontes.texto,
    fontSize: 16,
    color: cores.oceano,
    textAlignVertical: 'top',
  },
});
