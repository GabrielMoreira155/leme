import { voltar } from '@/lib/navegar';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { Botao, BotaoIcone, Cabecalho, Cartao, Icone, Tela, Texto, Tuga } from '@/components';
import { DISTRACOES } from '@/data/atividades';
import { cuidadoPorId } from '@/data/cuidados';
import { useEstado } from '@/lib/estado';
import { textoMeta } from '@/lib/plano';
import { pararOndas, tocarOndas, vibrarLeve, vibrarSuave } from '@/lib/som';
import { cores, espaco, fontes } from '@/theme';

// Sequência de fissura (3 a 5 minutos): respiração guiada, o porquê da pessoa e uma distração rápida.
// Nunca gasta energia. Com ?modo=respiracao vira só a respiração de emergência.

type Etapa = 'intro' | 'respira' | 'porque' | 'distrair' | 'fim';

const FASES = [
  { nome: 'Inspira', segundos: 4, escala: 1 },
  { nome: 'Segura', segundos: 4, escala: 1 },
  { nome: 'Solta', segundos: 6, escala: 0.55 },
];
const CICLOS = 6; // 6 ciclos de 14s, perto de 1min30 de respiração

const nativo = Platform.OS !== 'web';

export default function Fissura() {
  const { modo } = useLocalSearchParams<{ modo?: string }>();
  const soRespiracao = modo === 'respiracao';
  const { estado, atualizar, ganharXP } = useEstado();
  const [etapa, setEtapa] = useState<Etapa>('intro');
  const [somAtivo, setSomAtivo] = useState(true); // na respiração, o som vem ligado (com mudo visível)
  const [fase, setFase] = useState(0);
  const [restante, setRestante] = useState(FASES[0].segundos);
  const [ciclo, setCiclo] = useState(1);
  const [distracao, setDistracao] = useState(() => Math.floor(Math.random() * DISTRACOES.length));
  const escala = useRef(new Animated.Value(0.55)).current;
  const primeiraVez = !estado.jaRespirou;

  // Motor da respiração: troca de fase, contagem e animação do círculo.
  useEffect(() => {
    if (etapa !== 'respira') return;
    const f = FASES[fase];
    setRestante(f.segundos);
    vibrarLeve();
    Animated.timing(escala, {
      toValue: f.escala,
      duration: f.segundos * 1000,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: nativo,
    }).start();

    const tick = setInterval(() => {
      setRestante((r) => {
        // vibração leve no ritmo enquanto inspira e solta
        if (r > 1 && f.nome !== 'Segura') vibrarSuave();
        return r - 1;
      });
    }, 1000);

    const troca = setTimeout(() => {
      clearInterval(tick);
      if (fase < FASES.length - 1) {
        setFase(fase + 1);
      } else if (ciclo < CICLOS) {
        setCiclo(ciclo + 1);
        setFase(0);
      } else {
        terminarRespiracao();
      }
    }, f.segundos * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(troca);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa, fase, ciclo]);

  // Som de ondas acompanha só a etapa de respiração.
  useEffect(() => {
    if (etapa === 'respira' && somAtivo) tocarOndas();
    else pararOndas();
  }, [etapa, somAtivo]);

  useEffect(() => () => pararOndas(), []);

  function comecar() {
    atualizar((e) => ({ ...e, jaRespirou: true }));
    setFase(0);
    setCiclo(1);
    escala.setValue(0.55);
    setEtapa('respira');
  }

  function terminarRespiracao() {
    pararOndas();
    setEtapa(soRespiracao ? 'fim' : 'porque');
  }

  function concluir() {
    atualizar((e) => ({ ...e, fissurasAtravessadas: e.fissurasAtravessadas + 1 }));
    ganharXP(10, 'onda atravessada');
    setEtapa('fim');
  }

  const sair = () => voltar('/hoje');
  const escuro = etapa === 'respira' || etapa === 'intro';
  const fundo = escuro ? cores.oceano : cores.areia;

  const botaoMudo = (
    <BotaoIcone
      icone={somAtivo ? 'somLigado' : 'somDesligado'}
      rotulo={somAtivo ? 'Silenciar som de ondas' : 'Ligar som de ondas'}
      cor={escuro ? cores.branco : cores.oceano}
      onPress={() => setSomAtivo(!somAtivo)}
    />
  );

  return (
    <Tela
      fundo={fundo}
      topo={<Cabecalho titulo={soRespiracao ? 'Respiração' : 'Atravessar a onda'} claro={escuro} aoVoltar={sair} direita={botaoMudo} />}
      rolagem={etapa !== 'respira'}
      rodape={
        etapa === 'intro' ? (
          <Botao titulo="Começar" grande onPress={comecar} />
        ) : etapa === 'respira' ? (
          <Botao titulo="Já estou melhor, seguir" variante="contornoClaro" onPress={terminarRespiracao} />
        ) : etapa === 'porque' ? (
          <Botao titulo="Seguir" onPress={() => setEtapa('distrair')} />
        ) : etapa === 'distrair' ? (
          <>
            <Botao titulo="Fiz, passou um pouco" onPress={concluir} />
            <Botao titulo="Outra ideia" variante="fantasma" onPress={() => setDistracao((distracao + 1) % DISTRACOES.length)} />
          </>
        ) : (
          <>
            <Botao titulo="Voltar para o dia" onPress={() => router.replace('/hoje')} />
            <Botao titulo="Ainda está forte" variante="fantasma" onPress={() => router.replace('/apoio')} />
          </>
        )
      }
    >
      {etapa === 'intro' && (
        <View style={estilos.centro}>
          <Tuga pose="respira" size={200} />
          <Texto v="h1" style={{ color: cores.branco, textAlign: 'center' }}>
            Vamos atravessar essa onda juntos
          </Texto>
          <Texto v="corpo" style={{ color: '#D7E2EC', textAlign: 'center' }}>
            {soRespiracao
              ? 'Inspira 4, segura 4, solta 6. Siga o círculo.'
              : 'São poucos minutos: respirar, lembrar do seu porquê e fazer uma pausa rápida. A vontade sobe e desce como onda.'}
          </Texto>
          {primeiraVez && (
            <View style={estilos.dica}>
              <Icone nome="fone" size={20} cor={cores.turquesa} />
              <Texto v="apoio" style={{ color: '#D7E2EC', flex: 1 }}>
                Primeira vez? Com fone de ouvido fica melhor. Tem som de ondas no ritmo da respiração.
              </Texto>
            </View>
          )}
        </View>
      )}

      {etapa === 'respira' && (
        <View style={[estilos.centro, { flex: 1, justifyContent: 'center' }]}>
          <View style={estilos.palco}>
            <Animated.View style={[estilos.circulo, { transform: [{ scale: escala }] }]} />
            <Animated.View style={[estilos.circuloInterno, { transform: [{ scale: escala }] }]} />
            <View style={{ zIndex: 1 }}>
              <Tuga pose="respira" size={150} />
            </View>
          </View>
          <Texto style={estilos.fase} accessibilityLiveRegion="polite">
            {FASES[fase].nome}
          </Texto>
          <Texto style={estilos.contagem}>{restante}</Texto>
          <Texto v="apoio" style={{ color: '#9FB3C6' }}>
            Ciclo {ciclo} de {CICLOS}
          </Texto>
          {somAtivo && (
            // Legenda do áudio
            <Texto v="apoio" style={{ color: '#9FB3C6', fontSize: 12 }}>
              [som de ondas no ritmo da respiração]
            </Texto>
          )}
        </View>
      )}

      {etapa === 'porque' && estado.ficha && (
        <View style={{ gap: espaco.lg }}>
          <Tuga pose="padrao" size={150} />
          <Texto v="h1">Lembra do seu porquê?</Texto>
          <Cartao tom="turquesa" style={{ gap: espaco.sm }}>
            <Texto v="rotulo" style={{ color: cores.mare }}>
              VOCÊ ESTÁ CUIDANDO DISSO PARA
            </Texto>
            {estado.ficha.cuidar.map((c) => (
              <View key={c} style={{ flexDirection: 'row', gap: espaco.sm, alignItems: 'center' }}>
                <Icone nome="coracao" size={20} cor={cores.mare} />
                <Texto v="h3" style={{ flex: 1 }}>
                  {cuidadoPorId(c).porque}
                </Texto>
              </View>
            ))}
          </Cartao>
          {estado.plano && (
            <Texto v="apoio">
              Sua meta da semana: {textoMeta(estado.plano.degrau, estado.ficha.tema).toLowerCase()}. Essa onda passando é um passo nessa direção.
            </Texto>
          )}
        </View>
      )}

      {etapa === 'distrair' && (
        <View style={{ gap: espaco.lg }}>
          <Texto v="h1">Uma pausa rápida</Texto>
          <Texto v="apoio">Mude o foco por alguns minutos. Escolha essa ou peça outra ideia.</Texto>
          <Cartao style={{ gap: espaco.md, alignItems: 'center', paddingVertical: espaco.xxl }}>
            <Icone nome="farol" size={36} cor={cores.mare} />
            <Texto v="h2" style={{ textAlign: 'center' }}>
              {DISTRACOES[distracao]}
            </Texto>
          </Cartao>
        </View>
      )}

      {etapa === 'fim' && (
        <View style={[estilos.centro, { marginTop: espaco.xl }]}>
          <Tuga pose="comemora" size={200} />
          <Texto v="h1" style={{ textAlign: 'center' }}>
            Você atravessou essa onda
          </Texto>
          <Texto v="corpo" style={{ textAlign: 'center' }}>
            Cada vez que isso acontece, o caminho fica um pouco mais fácil. Se a vontade voltar, é só abrir de novo.
          </Texto>
        </View>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: 'center', gap: espaco.lg },
  dica: { flexDirection: 'row', gap: espaco.sm, alignItems: 'center', padding: espaco.md, borderRadius: 14, backgroundColor: cores.oceanoClaro },
  palco: { width: 300, height: 300, alignItems: 'center', justifyContent: 'center' },
  circulo: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(63,184,175,0.22)' },
  circuloInterno: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(63,184,175,0.35)' },
  fase: { fontFamily: fontes.titulo, fontSize: 30, color: cores.branco },
  contagem: { fontFamily: fontes.tituloMedio, fontSize: 22, color: cores.turquesa },
});
