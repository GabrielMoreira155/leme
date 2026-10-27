import { voltar as voltarTela } from '@/lib/navegar';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { BarraProgresso, Botao, Cabecalho, Cartao, Chip, Icone, Tela, Texto } from '@/components';
import { CUIDADOS, IdCuidado } from '@/data/cuidados';
import { IdTema, TEMAS } from '@/data/temas';
import { useEstado } from '@/lib/estado';
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

const TOTAL = 6;

export default function FichaTela() {
  const { atualizar } = useEstado();
  const [passo, setPasso] = useState(0);
  const [apelido, setApelido] = useState('');
  const [faixa, setFaixa] = useState<FaixaIdade | null>(null);
  const [tema, setTema] = useState<IdTema | null>(null);
  const [frequencia, setFrequencia] = useState<Frequencia | null>(null);
  const [impacto, setImpacto] = useState<Impacto | null>(null);
  const [cuidar, setCuidar] = useState<IdCuidado[]>([]);
  const [seguranca, setSeguranca] = useState<Seguranca | null>(null);

  const pode = [
    apelido.trim().length > 0 && !!faixa,
    !!tema,
    !!frequencia,
    !!impacto,
    cuidar.length > 0,
    !!seguranca,
  ][passo];

  function avancar() {
    if (passo < TOTAL - 1) return setPasso(passo + 1);
    const ficha = {
      apelido: apelido.trim(),
      faixaIdade: faixa!,
      tema: tema!,
      frequencia: frequencia!,
      impacto: impacto!,
      cuidar,
      seguranca: seguranca!,
    };
    atualizar((e) => ({ ...e, ficha, plano: null }));
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
          <Cabecalho titulo={`Passo ${passo + 1} de ${TOTAL}`} aoVoltar={voltar} />
          <View style={{ paddingHorizontal: espaco.xl, paddingBottom: espaco.sm }}>
            <BarraProgresso valor={(passo + 1) / TOTAL} rotulo={`Ficha, passo ${passo + 1} de ${TOTAL}`} />
          </View>
        </View>
      }
      rodape={<Botao titulo={passo === TOTAL - 1 ? 'Ver meu plano' : 'Continuar'} desabilitado={!pode} onPress={avancar} />}
    >
      {passo === 0 && (
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

      {passo === 1 && (
        <>
          <Texto v="h1">O que mais pesa hoje?</Texto>
          <Texto v="apoio">Escolha um. Dá para ajustar depois.</Texto>
          <View style={{ gap: espaco.sm }} accessibilityRole="radiogroup">
            {TEMAS.map((t) => (
              <Chip key={t.id} largo rotulo={t.nome} selecionado={tema === t.id} onPress={() => setTema(t.id)} />
            ))}
          </View>
        </>
      )}

      {passo === 2 && (
        <>
          <Texto v="h1">Com que frequência isso aparece?</Texto>
          <View style={{ gap: espaco.sm }} accessibilityRole="radiogroup">
            {FREQUENCIAS.map((f) => (
              <Chip key={f.id} largo rotulo={f.nome} selecionado={frequencia === f.id} onPress={() => setFrequencia(f.id)} />
            ))}
          </View>
        </>
      )}

      {passo === 3 && (
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

      {passo === 4 && (
        <>
          <Texto v="h1">O que você quer cuidar?</Texto>
          <Texto v="apoio">Pode marcar mais de um. Isso vira missão de hábito bom no seu plano.</Texto>
          <View style={{ gap: espaco.sm }}>
            {CUIDADOS.map((c) => {
              const sel = cuidar.includes(c.id);
              return (
                <Chip
                  key={c.id}
                  largo
                  multiplo
                  rotulo={c.nome}
                  selecionado={sel}
                  onPress={() => setCuidar(sel ? cuidar.filter((x) => x !== c.id) : [...cuidar, c.id])}
                />
              );
            })}
          </View>
        </>
      )}

      {passo === 5 && (
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
});
