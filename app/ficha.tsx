import { voltar as voltarTela } from '@/lib/navegar';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { BarraProgresso, Botao, Cabecalho, Cartao, Chip, Icone, Tela, Texto } from '@/components';
import { CampoOutro, DecisaoOutro, MINIMO_OUTRO } from '@/components/CampoOutro';
import { CUIDADOS, IdCuidado, LIMITE_CUIDADO_LIVRE } from '@/data/cuidados';
import { Direcao, DIRECOES, Momento, MOMENTOS, Pesa, PESOS } from '@/data/personalizado';
import { IdTema, TEMAS_PRINCIPAIS } from '@/data/temas';
import { useEstado } from '@/lib/estado';
import { Interpretacao, interpretarOutro, temRisco } from '@/lib/interpretarOutro';
import type { Frequencia, Impacto } from '@/lib/nivel';
import type { FaixaIdade, Seguranca } from '@/lib/plano';
import { cores, espaco, fontes, raio } from '@/theme';

const FAIXAS: { id: FaixaIdade; nome: string }[] = [
  { id: '13-17', nome: '13 a 17' },
  { id: '18-24', nome: '18 a 24' },
  { id: '25-39', nome: '25 a 39' },
  { id: '40+', nome: '40+' },
];

const FREQUENCIAS: { id: Frequencia; nome: string }[] = [
  { id: 'varias-dia', nome: 'Várias vezes ao dia' },
  { id: 'quase-todo-dia', nome: 'Quase todo dia' },
  { id: 'algumas-semana', nome: 'Algumas vezes por semana' },
  { id: 'fases', nome: 'Em fases' },
];

const IMPACTOS: { id: Impacto; nome: string }[] = [
  { id: 'nao', nome: 'Não' },
  { id: 'pouco', nome: 'Um pouco' },
  { id: 'bastante', nome: 'Bastante' },
];

const SEGURANCA: { id: Seguranca; nome: string }[] = [
  { id: 'nao', nome: 'Não' },
  { id: 'as-vezes', nome: 'Às vezes' },
  { id: 'sim-agora', nome: 'Sim, agora' },
  { id: 'prefiro-nao', nome: 'Prefiro não responder' },
];

type PassoId = 'apelido' | 'tema' | 'personalizado' | 'frequencia' | 'impacto' | 'cuidar' | 'seguranca';

export default function FichaTela() {
  const { estado, atualizar } = useEstado();
  const [passo, setPasso] = useState(0);
  const [apelido, setApelido] = useState('');
  const [faixa, setFaixa] = useState<FaixaIdade | null>(null);
  const [tema, setTema] = useState<IdTema | null>(null);
  const [frequencia, setFrequencia] = useState<Frequencia | null>(null);
  const [impacto, setImpacto] = useState<Impacto | null>(null);
  const [cuidar, setCuidar] = useState<IdCuidado[]>([]);
  const [cuidarTexto, setCuidarTexto] = useState('');
  const [seguranca, setSeguranca] = useState<Seguranca | null>(null);

  // "Outro" com texto livre
  const [textoOutro, setTextoOutro] = useState('');
  const [interpretacao, setInterpretacao] = useState<Interpretacao | null>(null);
  const [decisao, setDecisao] = useState<DecisaoOutro>(null);
  // Tema personalizado (3 perguntas)
  const [direcao, setDirecao] = useState<Direcao | null>(null);
  const [momentos, setMomentos] = useState<Momento[]>([]);
  const [pesa, setPesa] = useState<Pesa | null>(null);

  const ehOutro = tema === 'outro';
  const textoValido = textoOutro.trim().length >= MINIMO_OUTRO;

  // Reconhece o texto enquanto a pessoa escreve (com uma pequena espera entre as teclas).
  useEffect(() => {
    setDecisao(null);
    if (!ehOutro || !textoValido) {
      setInterpretacao(null);
      return;
    }
    let ativo = true;
    const t = setTimeout(() => {
      interpretarOutro(textoOutro).then((r) => ativo && setInterpretacao(r));
    }, 350);
    return () => {
      ativo = false;
      clearTimeout(t);
    };
  }, [textoOutro, ehOutro, textoValido]);

  const vaiPersonalizar =
    ehOutro && !!interpretacao && interpretacao.tipo !== 'risco' && (!interpretacao.temaId || decisao === 'personalizado');

  const passos: PassoId[] = [
    'apelido',
    'tema',
    ...(vaiPersonalizar ? (['personalizado'] as PassoId[]) : []),
    'frequencia',
    'impacto',
    'cuidar',
    'seguranca',
  ];
  const total = passos.length;
  const atual = passos[passo];

  const temaPronto = ehOutro
    ? textoValido && !!interpretacao && (interpretacao.tipo === 'risco' || !interpretacao.temaId || decisao !== null)
    : !!tema;

  const pode: Record<PassoId, boolean> = {
    apelido: apelido.trim().length > 0 && !!faixa,
    tema: temaPronto,
    personalizado: !!direcao && momentos.length > 0 && !!pesa,
    frequencia: !!frequencia,
    impacto: !!impacto,
    cuidar: cuidar.length > 0 && (!cuidar.includes('livre') || cuidarTexto.trim().length >= MINIMO_OUTRO),
    seguranca: !!seguranca,
  };

  function alternarMomento(m: Momento) {
    if (momentos.includes(m)) return setMomentos(momentos.filter((x) => x !== m));
    // até 2: o mais antigo sai quando entra um terceiro
    setMomentos([...momentos, m].slice(-2));
  }

  function avancar() {
    // Segurança antes de tudo: texto de risco não vira hábito, vai para o Apoio.
    if (atual === 'tema' && ehOutro && interpretacao?.tipo === 'risco') {
      setTema(null);
      setTextoOutro('');
      setInterpretacao(null);
      router.push({ pathname: '/apoio', params: { origem: 'outro' } });
      return;
    }
    // O texto livre do "o que quer cuidar" também passa pela checagem de risco.
    if (atual === 'cuidar' && cuidar.includes('livre') && temRisco(cuidarTexto)) {
      setCuidar(cuidar.filter((c) => c !== 'livre'));
      setCuidarTexto('');
      router.push({ pathname: '/apoio', params: { origem: 'outro' } });
      return;
    }
    if (passo < total - 1) return setPasso(passo + 1);

    const temaFinal: IdTema = !ehOutro
      ? tema!
      : decisao === 'confirmado' && interpretacao?.temaId
        ? interpretacao.temaId
        : 'personalizado';
    const ficha = {
      apelido: apelido.trim(),
      faixaIdade: faixa!,
      tema: temaFinal,
      textoOutro: ehOutro ? textoOutro.trim() : undefined,
      personalizado: temaFinal === 'personalizado' ? { direcao: direcao!, momentos, pesa: pesa! } : undefined,
      frequencia: frequencia!,
      impacto: impacto!,
      cuidar,
      cuidarTexto: cuidar.includes('livre') ? cuidarTexto.trim() : undefined,
      seguranca: seguranca!,
    };
    // Textos não reconhecidos ajudam a equipe a ver temas novos. Só no aparelho e só com o aceite opcional.
    const guardarTexto = temaFinal === 'personalizado' && !!estado.consentimento?.melhorias;
    atualizar((e) => ({
      ...e,
      ficha,
      plano: null,
      textosNaoReconhecidos: guardarTexto
        ? [...e.textosNaoReconhecidos, { texto: textoOutro.trim(), em: new Date().toISOString() }]
        : e.textosNaoReconhecidos,
    }));
    if (seguranca === 'as-vezes' || seguranca === 'sim-agora') {
      router.replace({ pathname: '/apoio', params: { origem: 'ficha' } });
    } else {
      router.replace('/plano');
    }
  }

  function voltar() {
    if (passo === 0) return voltarTela('/consentimento');
    setPasso(passo - 1);
  }

  return (
    <Tela
      topo={
        <View>
          <Cabecalho titulo={`Passo ${passo + 1} de ${total}`} aoVoltar={voltar} />
          <View style={{ paddingHorizontal: espaco.xl, paddingBottom: espaco.sm }}>
            <BarraProgresso valor={(passo + 1) / total} rotulo={`Ficha, passo ${passo + 1} de ${total}`} />
          </View>
        </View>
      }
      rodape={<Botao titulo={passo === total - 1 ? 'Ver meu plano' : 'Continuar'} desabilitado={!pode[atual]} onPress={avancar} />}
    >
      {atual === 'apelido' && (
        <>
          <Texto v="h1">Como a gente te chama?</Texto>
          <Texto v="apoio">Pode ser um apelido. Não precisa ser seu nome.</Texto>
          <TextInput
            value={apelido}
            onChangeText={setApelido}
            placeholder="Seu apelido"
            placeholderTextColor={cores.neblina}
            maxLength={24}
            autoCapitalize="words"
            accessibilityLabel="Apelido"
            style={estilos.campo}
          />
          <Texto v="h3" style={{ marginTop: espaco.sm }}>
            Sua faixa de idade
          </Texto>
          <View style={estilos.chips} accessibilityRole="radiogroup">
            {FAIXAS.map((f) => (
              <Chip key={f.id} rotulo={f.nome} selecionado={faixa === f.id} onPress={() => setFaixa(f.id)} />
            ))}
          </View>
        </>
      )}

      {atual === 'tema' && (
        <>
          <Texto v="h1">O que mais pesa hoje?</Texto>
          <Texto v="apoio">Escolha um. Dá para ajustar depois.</Texto>
          <View style={{ gap: espaco.sm }} accessibilityRole="radiogroup">
            {TEMAS_PRINCIPAIS.map((t) => (
              <View key={t.id} style={{ gap: espaco.sm }}>
                <Chip largo rotulo={t.nome} selecionado={tema === t.id} onPress={() => setTema(t.id)} />
                {t.id === 'outro' && ehOutro && (
                  <CampoOutro
                    texto={textoOutro}
                    aoMudarTexto={setTextoOutro}
                    interpretacao={interpretacao}
                    decisao={decisao}
                    aoDecidir={setDecisao}
                  />
                )}
              </View>
            ))}
          </View>
        </>
      )}

      {atual === 'personalizado' && (
        <>
          <Texto v="h1">Sobre esse hábito</Texto>
          <Texto v="apoio">3 perguntas rápidas, de um toque. Com elas a gente monta o seu plano.</Texto>
          <Texto v="h3">Você quer diminuir isso ou fazer mais disso?</Texto>
          <View style={{ gap: espaco.sm }} accessibilityRole="radiogroup">
            {DIRECOES.map((d) => (
              <Chip key={d.id} largo rotulo={d.nome} selecionado={direcao === d.id} onPress={() => setDirecao(d.id)} />
            ))}
          </View>
          <Texto v="h3" style={{ marginTop: espaco.sm }}>
            Quando isso costuma acontecer?
          </Texto>
          <Texto v="apoio">Até 2.</Texto>
          <View style={estilos.chips}>
            {MOMENTOS.map((m) => (
              <Chip key={m.id} multiplo rotulo={m.nome} selecionado={momentos.includes(m.id)} onPress={() => alternarMomento(m.id)} />
            ))}
          </View>
          <Texto v="h3" style={{ marginTop: espaco.sm }}>
            Isso pesa mais no quê?
          </Texto>
          <View style={estilos.chips} accessibilityRole="radiogroup">
            {PESOS.map((p) => (
              <Chip key={p.id} rotulo={p.nome} selecionado={pesa === p.id} onPress={() => setPesa(p.id)} />
            ))}
          </View>
        </>
      )}

      {atual === 'frequencia' && (
        <>
          <Texto v="h1">Com que frequência isso aparece?</Texto>
          <View style={{ gap: espaco.sm }} accessibilityRole="radiogroup">
            {FREQUENCIAS.map((f) => (
              <Chip key={f.id} largo rotulo={f.nome} selecionado={frequencia === f.id} onPress={() => setFrequencia(f.id)} />
            ))}
          </View>
        </>
      )}

      {atual === 'impacto' && (
        <>
          <Texto v="h1">Isso já atrapalhou seu trabalho, estudo, dinheiro ou relações?</Texto>
          <Texto v="apoio">Sem certo ou errado. É só para a rota ficar do seu tamanho.</Texto>
          <View style={{ gap: espaco.sm }} accessibilityRole="radiogroup">
            {IMPACTOS.map((i) => (
              <Chip key={i.id} largo rotulo={i.nome} selecionado={impacto === i.id} onPress={() => setImpacto(i.id)} />
            ))}
          </View>
        </>
      )}

      {atual === 'cuidar' && (
        <>
          <Texto v="h1">O que você quer cuidar?</Texto>
          <Texto v="apoio">Pode marcar mais de um. Isso vira missão de hábito bom no seu plano e aparece como o seu porquê nas horas difíceis.</Texto>
          <View style={estilos.chips}>
            {CUIDADOS.map((c) => {
              const sel = cuidar.includes(c.id);
              return (
                <Chip
                  key={c.id}
                  multiplo
                  rotulo={c.nome}
                  selecionado={sel}
                  onPress={() => setCuidar(sel ? cuidar.filter((x) => x !== c.id) : [...cuidar, c.id])}
                />
              );
            })}
          </View>
          <Chip
            largo
            multiplo
            icone="lapis"
            rotulo="Escrever com minhas palavras"
            selecionado={cuidar.includes('livre')}
            onPress={() => setCuidar(cuidar.includes('livre') ? cuidar.filter((x) => x !== 'livre') : [...cuidar, 'livre'])}
          />
          {cuidar.includes('livre') && (
            <View style={estilos.livre}>
              <Texto v="h3">O que você quer melhorar?</Texto>
              <TextInput
                value={cuidarTexto}
                onChangeText={setCuidarTexto}
                placeholder="Ex.: voltar a tocar violão"
                placeholderTextColor={cores.neblina}
                maxLength={LIMITE_CUIDADO_LIVRE}
                accessibilityLabel="O que você quer melhorar, com suas palavras"
                style={estilos.campo}
                autoFocus
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: espaco.sm }}>
                <Texto v="apoio" style={{ flex: 1, fontSize: 13 }}>
                  Fica só no seu aparelho. Vira uma missão de passo pequeno no seu plano.
                </Texto>
                <Texto v="rotulo">
                  {cuidarTexto.length}/{LIMITE_CUIDADO_LIVRE}
                </Texto>
              </View>
            </View>
          )}
        </>
      )}

      {atual === 'seguranca' && (
        <>
          <Texto v="h1">Uma pergunta de cuidado</Texto>
          <Cartao tom="areia" style={{ flexDirection: 'row', gap: espaco.md }}>
            <Icone nome="cadeado" size={22} cor={cores.mare} />
            <Texto v="apoio" style={{ flex: 1, color: cores.oceano }}>
              Essa resposta é só para a gente cuidar melhor de você. Ela nunca entra em jogo, pontos ou ranking.
            </Texto>
          </Cartao>
          <Texto v="h2">Nas últimas semanas, você pensou em se machucar ou em não estar mais aqui?</Texto>
          <View style={{ gap: espaco.sm }} accessibilityRole="radiogroup">
            {SEGURANCA.map((s) => (
              <Chip key={s.id} largo rotulo={s.nome} selecionado={seguranca === s.id} onPress={() => setSeguranca(s.id)} />
            ))}
          </View>
        </>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  campo: {
    minHeight: 56,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    paddingHorizontal: 18,
    fontFamily: fontes.textoMedio,
    fontSize: 18,
    color: cores.oceano,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  livre: { gap: espaco.sm, padding: espaco.lg, borderRadius: raio.md, backgroundColor: cores.turquesaSuave },
});
