import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { configGanho } from '@/data/ganhos';
import { Destino, Estado, TipoDestino, useEstado } from '@/lib/estado';
import { calcularGanho, equivalenciaTempo, formatarHoras, formatarReais, ResultadoGanho } from '@/lib/ganhos';
import { temaDaFicha } from '@/lib/tema';
import { cores, espaco, fontes, raio } from '@/theme';
import { BarraProgresso } from './BarraProgresso';
import { Botao } from './Botao';
import { Cartao } from './Cartao';
import { Chip } from './Chip';
import { Icone } from './Icone';
import { Texto } from './Texto';
import { Tuga } from './Tuga';

// "Seus ganhos até aqui", personalizado pelo tipo de ganho do tema (data/ganhos.ts).
// Mostra só o que foi ganho, nunca o que foi gasto. Nunca aparece em telas de crise.

const DESTINOS: { id: TipoDestino; nome: string }[] = [
  { id: 'guardar', nome: 'Guardar' },
  { id: 'conta', nome: 'Quitar uma conta' },
  { id: 'presente', nome: 'Um presente para alguém' },
  { id: 'viagem', nome: 'Uma viagem' },
  { id: 'outro', nome: 'Outro' },
];

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;

export function dadosGanhos(estado: Estado) {
  if (!estado.ficha) return null;
  const config = configGanho(estado.ficha);
  const precisaBase = config.perguntas.length > 0;
  const baseValida = precisaBase && estado.ganhos.chave === config.chave && !!estado.ganhos.respostas;
  const recusou = precisaBase && estado.ganhos.chave === config.chave && estado.ganhos.recusou;
  const base = baseValida ? config.base(estado.ganhos.respostas!) : null;
  const resultado = calcularGanho(config.tipo, base, estado.registroDiario, estado.fissurasAtravessadas);
  return { config, precisaBase, baseValida, recusou, resultado };
}

export function CartaoGanhos() {
  const { estado } = useEstado();
  const [folha, setFolha] = useState(false);
  const sorteio = useMemo(() => Math.random(), []);
  const dados = dadosGanhos(estado);
  if (!dados || !estado.ficha) return null;
  const { config, precisaBase, baseValida, recusou, resultado } = dados;
  if (config.tipo === 'nenhum') return null;

  const tema = temaDaFicha(estado.ficha);

  // Primeira vez: cartão vazio com convite.
  if (precisaBase && !baseValida && !recusou) {
    return (
      <Cartao style={{ gap: espaco.md, alignItems: 'center' }}>
        <Texto v="rotulo" style={{ alignSelf: 'flex-start' }}>
          SEUS GANHOS ATÉ AQUI
        </Texto>
        <Tuga pose="padrao" size={120} />
        <Texto v="h3" style={{ textAlign: 'center' }}>
          Quer ver quanto você está ganhando de volta? Leva 10 segundos.
        </Texto>
        <Botao titulo="Calcular meus ganhos" onPress={() => router.push('/ganhos')} style={{ alignSelf: 'stretch' }} />
      </Cartao>
    );
  }

  // Preferiu não informar: mostra dias cuidados e ondas atravessadas.
  if (recusou) {
    return (
      <Cartao style={{ gap: espaco.md }}>
        <Texto v="rotulo">SEUS GANHOS ATÉ AQUI</Texto>
        <View style={estilos.dupla}>
          <View style={{ flex: 1 }}>
            <Texto style={estilos.numero}>{estado.diasCuidados.length}</Texto>
            <Texto v="apoio">{estado.diasCuidados.length === 1 ? 'dia cuidado' : 'dias cuidados'}</Texto>
          </View>
          <View style={{ flex: 1 }}>
            <Texto style={estilos.numero}>{estado.fissurasAtravessadas}</Texto>
            <Texto v="apoio">{estado.fissurasAtravessadas === 1 ? 'onda atravessada' : 'ondas atravessadas'}</Texto>
          </View>
        </View>
        <Botao titulo="Calcular meus ganhos" variante="fantasma" onPress={() => router.push('/ganhos')} />
      </Cartao>
    );
  }

  const { numero, legenda } = textoPrincipal(resultado);
  const equivalencia = resultado.tipo === 'tempo' ? equivalenciaTempo(resultado.total, sorteio) : null;

  return (
    <Cartao style={{ gap: espaco.xs }}>
      <Texto v="rotulo">SEUS GANHOS ATÉ AQUI</Texto>
      <Texto style={estilos.ganho} accessibilityLabel={`${numero} ${legenda}`}>
        {numero}
      </Texto>
      <Texto v="corpo" style={{ fontSize: 15 }}>
        {legenda}
      </Texto>
      {equivalencia && (
        <Texto v="apoio" style={{ color: cores.mare }}>
          {equivalencia.charAt(0).toUpperCase() + equivalencia.slice(1)}.
        </Texto>
      )}
      {resultado.diasContados === 0 && (resultado.tipo === 'dinheiro' || resultado.tipo === 'tempo' || resultado.tipo === 'noites') && (
        <Texto v="apoio">Responda "Como foi hoje com {tema.nomeCurto}?" para começar a somar.</Texto>
      )}
      {tema.id === 'apostas' && resultado.tipo === 'dinheiro' && (
        <Texto v="apoio" style={{ fontSize: 13 }}>
          Esse é o dinheiro que não saiu do seu bolso. Guardar longe do app de apostas ajuda a manter assim.
        </Texto>
      )}
      <View style={estilos.rodape}>
        <Texto v="apoio" style={{ fontSize: 12 }}>
          estimativa
        </Texto>
        <Pressable onPress={() => setFolha(true)} accessibilityRole="button" hitSlop={12} style={estilos.link}>
          <Texto v="link">Como calculamos</Texto>
        </Pressable>
      </View>

      {resultado.tipo === 'dinheiro' && <DestinoDinheiro total={resultado.total} />}

      <FolhaCalculo visivel={folha} aoFechar={() => setFolha(false)} />
    </Cartao>
  );
}

function textoPrincipal(r: ResultadoGanho): { numero: string; legenda: string } {
  const dias = plural(r.diasContados, 'dia cuidado', 'dias cuidados');
  switch (r.tipo) {
    case 'dinheiro':
      return { numero: formatarReais(r.total, false), legenda: `que ficaram com você em ${dias}` };
    case 'tempo':
      return { numero: formatarHoras(r.total), legenda: `de volta para você em ${dias}` };
    case 'noites':
      return { numero: plural(r.total, 'noite', 'noites'), legenda: 'dormidas no seu horário' };
    default:
      return { numero: plural(r.total, 'onda', 'ondas'), legenda: 'atravessadas sem precisar obedecer' };
  }
}

// Folha "Como calculamos", com os números reais da pessoa.
function FolhaCalculo({ visivel, aoFechar }: { visivel: boolean; aoFechar: () => void }) {
  const { estado } = useEstado();
  const dados = dadosGanhos(estado);
  if (!dados || !estado.ficha) return null;
  const { config, resultado } = dados;
  const tema = temaDaFicha(estado.ficha);
  const fazerMais = !!tema.fazerMais;
  const respostas = estado.ganhos.respostas ?? {};

  const nomeLivre = fazerMais ? 'dia em que você fez' : 'dia livre';
  const nomeMenos = fazerMais ? 'dia em que fez um pouco' : 'dia com menos que o normal';
  const contagem = fazerMais
    ? `${plural(resultado.livres, 'dia em que você fez', 'dias em que você fez')} e ${plural(resultado.menos, 'em que fez um pouco', 'em que fez um pouco')}`
    : `${plural(resultado.livres, 'dia livre', 'dias livres')} e ${resultado.menos} com menos que o normal`;

  let paragrafos: string[];
  if (resultado.tipo === 'dinheiro') {
    paragrafos = [
      `${config.fraseBase(respostas)} Isso dá ${formatarReais(resultado.valorDia)} por dia.`,
      `Em cada ${nomeLivre} a gente soma o valor inteiro, e em ${nomeMenos}, metade.`,
      `Até agora foram ${contagem}: ${formatarReais(resultado.total)}.`,
    ];
  } else if (resultado.tipo === 'tempo') {
    paragrafos = [
      config.fraseBase(respostas),
      `Em cada ${nomeLivre} a gente soma ${formatarHoras(resultado.valorDia)}, e em ${nomeMenos}, metade.`,
      `Até agora foram ${contagem}: ${formatarHoras(resultado.total)}.`,
    ];
  } else if (resultado.tipo === 'noites') {
    paragrafos = [
      'A gente conta as noites em que você marcou "Dormi no horário" na pergunta de como foi o dia.',
      `Até agora foram ${plural(resultado.total, 'noite', 'noites')}.`,
    ];
  } else {
    paragrafos = [
      'A gente conta as vezes em que você usou o botão "Estou com vontade agora" ou a respiração e foi até o fim. Cada uma é uma onda atravessada sem precisar obedecer.',
      `Até agora foram ${plural(resultado.total, 'onda', 'ondas')}.`,
    ];
  }

  const temValor = resultado.tipo === 'dinheiro' || resultado.tipo === 'tempo';

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={aoFechar}>
      <Pressable style={estilos.fundoFolha} onPress={aoFechar} accessibilityLabel="Fechar">
        <Pressable style={estilos.folha} onPress={() => {}}>
          <View style={estilos.alca} />
          <Texto v="h2">Como calculamos</Texto>
          {paragrafos.map((p) => (
            <Texto key={p} v="corpo" style={{ fontSize: 15, lineHeight: 23 }}>
              {p}
            </Texto>
          ))}
          <Texto v="apoio" style={{ fontSize: 13 }}>
            É uma estimativa a partir do que você contou, e fica só no seu aparelho. Dias sem resposta não contam, e tropeços nunca descontam nada.
          </Texto>
          <View style={{ gap: espaco.sm, marginTop: espaco.sm }}>
            {temValor && (
              <Botao
                titulo="Mudar meu valor"
                variante="oceano"
                onPress={() => {
                  aoFechar();
                  router.push('/ganhos');
                }}
              />
            )}
            <Botao titulo="Fechar" variante="fantasma" onPress={aoFechar} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// "Pra onde vai esse dinheiro?" (opcional, só no tipo dinheiro), com valor alvo e barra de progresso.
function DestinoDinheiro({ total }: { total: number }) {
  const { estado, atualizar } = useEstado();
  const destino = estado.ganhos.destino;
  const [editando, setEditando] = useState(false);
  const [tipo, setTipo] = useState<TipoDestino | null>(destino?.tipo ?? null);
  const [texto, setTexto] = useState(destino?.texto ?? '');
  const [alvo, setAlvo] = useState(destino?.alvo ? String(destino.alvo) : '');

  function salvar() {
    const novo: Destino = { tipo: tipo!, texto: tipo === 'outro' ? texto.trim() : undefined, alvo: parseInt(alvo, 10) || undefined };
    atualizar((e) => ({ ...e, ganhos: { ...e.ganhos, destino: novo } }));
    setEditando(false);
  }

  if (editando) {
    return (
      <View style={estilos.destino}>
        <Texto v="h3">Pra onde vai esse dinheiro?</Texto>
        <View style={estilos.chips} accessibilityRole="radiogroup">
          {DESTINOS.map((d) => (
            <Chip key={d.id} rotulo={d.nome} selecionado={tipo === d.id} onPress={() => setTipo(d.id)} />
          ))}
        </View>
        {tipo === 'outro' && (
          <TextInput
            value={texto}
            onChangeText={setTexto}
            maxLength={30}
            placeholder="Ex.: curso de inglês"
            placeholderTextColor={cores.neblina}
            accessibilityLabel="Destino do dinheiro, com suas palavras"
            style={estilos.campo}
          />
        )}
        <Texto v="apoio">Quer um valor alvo? (opcional)</Texto>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco.sm }}>
          <Texto style={{ fontFamily: fontes.tituloMedio, color: cores.oceano }}>R$</Texto>
          <TextInput
            value={alvo}
            onChangeText={(t) => setAlvo(t.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder="500"
            placeholderTextColor={cores.neblina}
            accessibilityLabel="Valor alvo em reais"
            style={[estilos.campo, { width: 120 }]}
          />
        </View>
        <View style={{ flexDirection: 'row', gap: espaco.sm }}>
          <Botao titulo="Salvar" variante="oceano" desabilitado={!tipo || (tipo === 'outro' && texto.trim().length < 2)} onPress={salvar} style={{ flex: 1 }} />
          <Botao titulo="Cancelar" variante="fantasma" onPress={() => setEditando(false)} />
        </View>
      </View>
    );
  }

  if (!destino) {
    return <Botao titulo="Pra onde vai esse dinheiro?" variante="fantasma" icone="mapa" onPress={() => setEditando(true)} />;
  }

  const nome = destino.tipo === 'outro' ? destino.texto : DESTINOS.find((d) => d.id === destino.tipo)?.nome;
  const alcancou = !!destino.alvo && total >= destino.alvo;

  return (
    <View style={estilos.destino}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco.sm }}>
        <Icone nome="mapa" size={18} cor={cores.mare} />
        <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
          Destino: {nome}
        </Texto>
        <Pressable onPress={() => setEditando(true)} accessibilityRole="button" hitSlop={12} style={estilos.link}>
          <Texto v="link">Trocar</Texto>
        </Pressable>
      </View>
      {!!destino.alvo && !alcancou && (
        <>
          <BarraProgresso valor={total / destino.alvo} rotulo="Progresso até o valor alvo" />
          <Texto v="apoio">
            {formatarReais(total, false)} de {formatarReais(destino.alvo, false)}
          </Texto>
        </>
      )}
      {alcancou && (
        <View style={estilos.porto}>
          <Tuga pose="comemora" size={110} />
          <Texto v="h3" style={{ flex: 1 }}>
            Porto alcançado! Esse dinheiro ficou com você.
          </Texto>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  ganho: { fontFamily: fontes.titulo, fontSize: 34, lineHeight: 42, color: cores.mare },
  numero: { fontFamily: fontes.titulo, fontSize: 30, lineHeight: 38, color: cores.mare },
  dupla: { flexDirection: 'row', gap: espaco.lg },
  rodape: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: espaco.xs },
  link: { minHeight: 44, justifyContent: 'center' },
  destino: { gap: espaco.sm, marginTop: espaco.sm, paddingTop: espaco.md, borderTopWidth: 1, borderTopColor: cores.linha },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  campo: {
    minHeight: 48,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    paddingHorizontal: 14,
    fontFamily: fontes.textoMedio,
    fontSize: 16,
    color: cores.oceano,
  },
  porto: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, padding: espaco.md, borderRadius: raio.md, backgroundColor: cores.turquesaSuave },
  fundoFolha: { flex: 1, backgroundColor: 'rgba(18,58,90,0.55)', justifyContent: 'flex-end' },
  folha: {
    backgroundColor: cores.areia,
    borderTopLeftRadius: raio.lg,
    borderTopRightRadius: raio.lg,
    padding: espaco.xl,
    paddingBottom: espaco.xxl,
    gap: espaco.md,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  alca: { width: 44, height: 5, borderRadius: 3, backgroundColor: cores.linha, alignSelf: 'center' },
});
