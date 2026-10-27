import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BarraProgresso, Botao, Cartao, Chip, Icone, Texto, Tuga } from '@/components';
import { MapaRota } from '@/components/MapaRota';
import { temaPorId } from '@/data/temas';
import { diasDaSemana, ENERGIA_MAX, hoje, Humor, nivelXP, TITULOS_NIVEL, useEstado, XP_POR_NIVEL } from '@/lib/estado';
import { DIAS_META, MISSAO_RECOMECO, missoesDoDia, textoMeta } from '@/lib/plano';
import { tocarSininho, vibrarSucesso } from '@/lib/som';
import { cores, espaco, fontes, raio } from '@/theme';

const XP_MISSAO = 20;
const XP_QUEST = 50;
const LETRAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const NOMES_DIAS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];

const QUESTS = [
  'Mande uma mensagem de carinho para alguém, sem motivo nenhum.',
  'Escreva 3 coisas que deram certo hoje, mesmo pequenas.',
  'Saia para olhar o céu por 2 minutos.',
  'Arrume um cantinho da casa por 10 minutos.',
];

const HUMORES: { id: Humor; nome: string; icone: 'sol' | 'nuvem' | 'chuva' }[] = [
  { id: 'bem', nome: 'Bem', icone: 'sol' },
  { id: 'mais-ou-menos', nome: 'Mais ou menos', icone: 'nuvem' },
  { id: 'dificil', nome: 'Difícil', icone: 'chuva' },
];

function formatarGanho(valor: number, formato: 'reais' | 'horas' | 'numero') {
  const v = Math.round(valor);
  if (formato === 'reais') return `R$ ${v.toLocaleString('pt-BR')}`;
  if (formato === 'horas') return `${v}h`;
  return `${v}`;
}

export default function Hoje() {
  const { estado, atualizar, ganharXP, mostrarAviso } = useEstado();
  const [questAberta, setQuestAberta] = useState(false);
  const { ficha, plano } = estado;
  if (!ficha || !plano) return <Redirect href="/" />;

  const tema = temaPorId(ficha.tema);
  const { nivel, noNivel } = nivelXP(estado.xp);
  const titulo = TITULOS_NIVEL[Math.min(nivel - 1, TITULOS_NIVEL.length - 1)];
  const semana = diasDaSemana();
  const hojeStr = hoje();
  const cuidadosSemana = semana.filter((d) => estado.diasCuidados.includes(d)).length;
  const meta = DIAS_META[plano.degrau];

  const missoes = missoesDoDia(ficha);
  const feitas = estado.missoes.feitas;
  const todasFeitas = missoes.every((m) => feitas.includes(m.id));
  const recomecoAtivo = estado.recomeco === hojeStr;
  const questFeitaHoje = estado.questFeita === hojeStr;
  const quest = QUESTS[Math.floor(Date.now() / 86400000) % QUESTS.length];
  const humorHoje = estado.humor.find((h) => h.data === hojeStr)?.valor;
  const ganho = tema.ganho.base + tema.ganho.porDia * estado.diasCuidados.length;

  function concluirMissao(id: string, texto: string) {
    if (feitas.includes(id)) return;
    atualizar((e) => ({ ...e, missoes: { data: hojeStr, feitas: [...e.missoes.feitas, id] } }));
    vibrarSucesso();
    tocarSininho(estado.somLigado);
    const vaiCompletar = missoes.every((m) => m.id === id || feitas.includes(m.id)) && missoes.some((m) => m.id === id);
    ganharXP(XP_MISSAO, vaiCompletar ? 'quest secreta liberada' : 'missão feita');
  }

  function concluirQuest() {
    atualizar((e) => ({ ...e, questFeita: hojeStr }));
    vibrarSucesso();
    tocarSininho(estado.somLigado);
    ganharXP(XP_QUEST, 'quest secreta');
  }

  function registrarHumor(valor: Humor) {
    atualizar((e) => ({ ...e, humor: [...e.humor.filter((h) => h.data !== hojeStr), { data: hojeStr, valor }] }));
    mostrarAviso('Anotado. Obrigado por contar.');
  }

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <View>
        <Texto v="h1">Oi, {ficha.apelido}</Texto>
        <Texto v="apoio">Um dia de cada vez. Hoje é {NOMES_DIAS[(new Date().getDay() + 6) % 7]}.</Texto>
      </View>

      {/* Cartão oceano: nível, XP, dias cuidados e energia */}
      <Cartao tom="oceano" style={{ gap: espaco.lg }}>
        <View style={estilos.linhaEntre}>
          <View>
            <Texto v="rotulo" style={{ color: cores.turquesa }}>
              NÍVEL {nivel}
            </Texto>
            <Texto v="h2" style={{ color: cores.branco }}>
              {titulo}
            </Texto>
          </View>
          <Texto v="apoio" style={{ color: '#D7E2EC' }}>
            {noNivel} de {XP_POR_NIVEL} XP
          </Texto>
        </View>
        <BarraProgresso valor={noNivel / XP_POR_NIVEL} trilho={cores.oceanoClaro} rotulo={`Experiência: ${noNivel} de ${XP_POR_NIVEL}`} />

        <View style={{ gap: espaco.sm }}>
          <Texto v="rotulo" style={{ color: '#D7E2EC' }}>
            DIAS CUIDADOS NESTA SEMANA
          </Texto>
          <View style={estilos.linhaEntre} accessible accessibilityLabel={`${cuidadosSemana} dias cuidados nesta semana`}>
            {semana.map((d, i) => {
              const cuidado = estado.diasCuidados.includes(d);
              const ehHoje = d === hojeStr;
              return (
                <View key={d} style={{ alignItems: 'center', gap: 4 }}>
                  <View
                    style={[
                      estilos.dia,
                      cuidado && { backgroundColor: cores.turquesa, borderColor: cores.turquesa },
                      ehHoje && !cuidado && { borderColor: cores.branco },
                    ]}
                  >
                    {cuidado && <Icone nome="check" size={16} cor={cores.oceano} />}
                  </View>
                  <Texto v="rotulo" style={{ color: ehHoje ? cores.branco : '#9FB3C6' }}>
                    {LETRAS[i]}
                  </Texto>
                </View>
              );
            })}
          </View>
          <Texto v="apoio" style={{ color: '#D7E2EC' }}>
            {cuidadosSemana} {cuidadosSemana === 1 ? 'dia' : 'dias'} até agora. Semana passada: {estado.semanaAnterior}.
          </Texto>
        </View>

        <View style={estilos.linhaEntre}>
          <Texto v="rotulo" style={{ color: '#D7E2EC' }}>
            ENERGIA
          </Texto>
          <View style={{ flexDirection: 'row', gap: 4 }} accessible accessibilityLabel={`Energia: ${estado.energia} de ${ENERGIA_MAX}`}>
            {Array.from({ length: ENERGIA_MAX }, (_, i) => (
              <Icone key={i} nome="vela" size={22} cor={i < estado.energia ? cores.turquesa : cores.oceanoClaro} />
            ))}
          </View>
        </View>
      </Cartao>

      {/* Botão de fissura */}
      <Pressable
        onPress={() => router.push('/fissura')}
        accessibilityRole="button"
        accessibilityLabel="Estou com vontade agora"
        accessibilityHint="Abre uma respiração guiada de poucos minutos"
        style={({ pressed }) => [estilos.fissura, pressed && { transform: [{ scale: 0.985 }], opacity: 0.95 }]}
      >
        <View style={estilos.fissuraIcone}>
          <Icone nome="onda" size={30} cor={cores.textoCoral} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Texto style={estilos.fissuraTitulo}>Estou com vontade agora</Texto>
          <Texto style={estilos.fissuraSub}>Uns minutos para atravessar a onda. Não gasta energia.</Texto>
        </View>
      </Pressable>

      {/* Check-in de humor */}
      <Cartao style={{ gap: espaco.md }}>
        <Texto v="h3">Como você está agora?</Texto>
        <View style={estilos.chips} accessibilityRole="radiogroup">
          {HUMORES.map((h) => (
            <Chip key={h.id} icone={h.icone} rotulo={h.nome} selecionado={humorHoje === h.id} onPress={() => registrarHumor(h.id)} />
          ))}
        </View>
        {humorHoje === 'dificil' && (
          <View style={{ gap: espaco.xs }}>
            <Texto v="apoio">Dias difíceis acontecem. Quer uma ajuda agora?</Texto>
            <View style={estilos.chips}>
              <Botao titulo="Respirar um pouco" variante="fantasma" onPress={() => router.push({ pathname: '/fissura', params: { modo: 'respiracao' } })} />
              <Botao titulo="Falar com alguém" variante="fantasma" onPress={() => router.push('/sessoes')} />
            </View>
          </View>
        )}
      </Cartao>

      {/* Meta da semana */}
      <Cartao style={{ gap: espaco.md }}>
        <View style={estilos.linhaEntre}>
          <View style={estilos.linha}>
            <Icone nome="bussola" cor={cores.mare} />
            <Texto v="h3">Meta da semana</Texto>
          </View>
          <Texto v="rotulo">PORTO {plano.semana + 1} DE 4</Texto>
        </View>
        <Texto v="h2">{textoMeta(plano.degrau, ficha.tema)}</Texto>
        <BarraProgresso valor={Math.min(1, cuidadosSemana / meta)} rotulo="Progresso da meta da semana" />
        <Texto v="apoio">
          {Math.min(cuidadosSemana, meta)} de {meta} dias. Cada semana cuidada é uma milha a mais.
        </Texto>
        <MapaRota atual={plano.semana} />
      </Cartao>

      {/* Missões do dia */}
      <Cartao style={{ gap: espaco.sm }}>
        <View style={estilos.linhaEntre}>
          <View style={estilos.linha}>
            <Icone nome="mapa" cor={cores.mare} />
            <Texto v="h3">Missões de hoje</Texto>
          </View>
          <Texto v="rotulo">+{XP_MISSAO} XP CADA</Texto>
        </View>
        {recomecoAtivo && (
          <ItemMissao
            texto={MISSAO_RECOMECO.texto}
            feita={feitas.includes(MISSAO_RECOMECO.id)}
            onPress={() => concluirMissao(MISSAO_RECOMECO.id, MISSAO_RECOMECO.texto)}
            destaque
          />
        )}
        {missoes.map((m) => (
          <ItemMissao key={m.id} texto={m.texto} feita={feitas.includes(m.id)} onPress={() => concluirMissao(m.id, m.texto)} />
        ))}
      </Cartao>

      {/* Quest secreta */}
      {!todasFeitas ? (
        <Cartao tom="areia" style={estilos.quest}>
          <View style={estilos.cadeado}>
            <Icone nome="cadeado" cor={cores.neblina} />
          </View>
          <View style={{ flex: 1 }}>
            <Texto v="h3">Quest secreta</Texto>
            <Texto v="apoio">Complete as 3 missões de hoje para abrir. Vale +{XP_QUEST} XP.</Texto>
          </View>
        </Cartao>
      ) : questFeitaHoje ? (
        <Cartao tom="turquesa" style={estilos.quest}>
          <Tuga pose="comemora" size={90} />
          <View style={{ flex: 1 }}>
            <Texto v="h3">Quest concluída</Texto>
            <Texto v="apoio" style={{ color: cores.oceano }}>
              Dia completo. Amanhã tem outra esperando.
            </Texto>
          </View>
        </Cartao>
      ) : questAberta ? (
        <Cartao tom="turquesa" style={{ gap: espaco.md, alignItems: 'center' }}>
          <Tuga pose="comemora" size={160} />
          <Texto v="h2" style={{ textAlign: 'center' }}>
            Quest secreta aberta
          </Texto>
          <Texto v="corpo" style={{ textAlign: 'center' }}>
            {quest}
          </Texto>
          <Botao titulo={`Concluí · +${XP_QUEST} XP`} onPress={concluirQuest} style={{ alignSelf: 'stretch' }} />
        </Cartao>
      ) : (
        <Cartao tom="turquesa" style={estilos.quest} onPress={() => setQuestAberta(true)} acessibilidade="Abrir quest secreta">
          <View style={[estilos.cadeado, { backgroundColor: cores.turquesa }]}>
            <Icone nome="estrela" cor={cores.oceano} />
          </View>
          <View style={{ flex: 1 }}>
            <Texto v="h3">Quest secreta liberada</Texto>
            <Texto v="link">Toque para abrir</Texto>
          </View>
          <Icone nome="avancar" cor={cores.mare} />
        </Cartao>
      )}

      {/* Ganhos reais */}
      <Cartao style={{ gap: espaco.xs }}>
        <Texto v="rotulo">SEUS GANHOS ATÉ AQUI</Texto>
        <Texto style={estilos.ganho}>{formatarGanho(ganho, tema.ganho.formato)}</Texto>
        <Texto v="corpo" style={{ fontSize: 15 }}>
          {tema.ganho.rotulo}
        </Texto>
        <Texto v="apoio" style={{ fontSize: 12 }}>
          Valor simulado no protótipo. Na versão real, você informa a sua média.
        </Texto>
      </Cartao>

      <Botao titulo="Tive um tropeço" variante="contorno" icone="boia" onPress={() => router.push('/tropeco')} />
      <Texto v="apoio" style={{ textAlign: 'center' }}>
        Tropeçar faz parte. Nada do que você construiu se perde.
      </Texto>
    </ScrollView>
  );
}

function ItemMissao({ texto, feita, onPress, destaque }: { texto: string; feita: boolean; onPress: () => void; destaque?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: feita }}
      accessibilityLabel={texto}
      style={({ pressed }) => [estilos.missao, destaque && { backgroundColor: cores.coralSuave }, pressed && { opacity: 0.85 }]}
    >
      <View style={[estilos.caixa, feita && { backgroundColor: cores.turquesa, borderColor: cores.turquesa }]}>
        {feita && <Icone nome="check" size={18} cor={cores.oceano} />}
      </View>
      <Texto v="corpo" style={[{ flex: 1, fontSize: 15 }, feita && { color: cores.neblina, textDecorationLine: 'line-through' }]}>
        {texto}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: espaco.xl, gap: espaco.lg, paddingBottom: espaco.xxxl },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  linhaEntre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  dia: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: cores.oceanoClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fissura: {
    backgroundColor: cores.coral,
    borderRadius: raio.lg,
    padding: espaco.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.lg,
    minHeight: 104,
  },
  fissuraIcone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fissuraTitulo: { fontFamily: fontes.titulo, fontSize: 20, lineHeight: 26, color: cores.textoCoral },
  fissuraSub: { fontFamily: fontes.textoMedio, fontSize: 14, lineHeight: 20, color: cores.textoCoral },
  missao: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, minHeight: 52, paddingVertical: 6, paddingHorizontal: 6, borderRadius: raio.sm },
  caixa: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: cores.mare,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quest: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  cadeado: { width: 48, height: 48, borderRadius: 24, backgroundColor: cores.areia, alignItems: 'center', justifyContent: 'center' },
  ganho: { fontFamily: fontes.titulo, fontSize: 34, lineHeight: 42, color: cores.mare },
});
