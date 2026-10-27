import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import { Botao, Cabecalho, Cartao, Chip, Confirmacao, Icone, NomeIcone, Simbolo, Tela, Texto } from '@/components';
import { temaPorId } from '@/data/temas';
import { ENERGIA_MAX, nivelXP, useEstado } from '@/lib/estado';
import { NOME_ROTA } from '@/lib/nivel';
import { ajustarMeta } from '@/lib/plano';
import { cores, espaco, fontes, raio } from '@/theme';

function Linha({ icone, titulo, detalhe, valor, aoMudar }: { icone: NomeIcone; titulo: string; detalhe?: string; valor: boolean; aoMudar: (v: boolean) => void }) {
  return (
    <View style={estilos.linha}>
      <Icone nome={icone} cor={cores.mare} />
      <View style={{ flex: 1 }}>
        <Texto v="h3" style={{ fontSize: 15 }}>
          {titulo}
        </Texto>
        {detalhe && <Texto v="apoio">{detalhe}</Texto>}
      </View>
      <Switch
        value={valor}
        onValueChange={aoMudar}
        accessibilityLabel={titulo}
        trackColor={{ false: cores.linha, true: cores.turquesa }}
        thumbColor={cores.branco}
        {...(Platform.OS === 'web' ? { activeThumbColor: cores.branco } : {})}
      />
    </View>
  );
}

function baixarJSON(dados: object) {
  const texto = JSON.stringify(dados, null, 2);
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const blob = new Blob([texto], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leme-meus-dados.json';
    a.click();
    URL.revokeObjectURL(url);
    return true;
  }
  // No celular, a versão real usaria expo-file-system + expo-sharing para salvar ou compartilhar o arquivo.
  return false;
}

export default function Perfil() {
  const { estado, atualizar, resetar, mostrarAviso } = useEstado();
  const [confirmarApagar, setConfirmarApagar] = useState(false);
  const [verDados, setVerDados] = useState(false);
  const [novoPin, setNovoPin] = useState('');
  const [demo, setDemo] = useState(false);
  const { ficha, plano } = estado;
  const { nivel } = nivelXP(estado.xp);

  async function apagarTudo() {
    setConfirmarApagar(false);
    await resetar();
    router.replace('/boas-vindas');
  }

  function baixar() {
    const ok = baixarJSON(estado);
    if (ok) mostrarAviso('Arquivo leme-meus-dados.json baixado');
    else setVerDados(true);
  }

  function pausar(dias: number) {
    atualizar((e) => ({ ...e, pausaAte: Date.now() + dias * 86400000 }));
    router.replace('/pausa');
  }

  function salvarPin() {
    atualizar((e) => ({ ...e, pin: novoPin }));
    setNovoPin('');
    mostrarAviso('PIN ativado');
  }

  function simularSemana(cumpriu: boolean) {
    atualizar((e) => (e.plano ? { ...e, plano: ajustarMeta(e.plano, cumpriu), semanaAnterior: cumpriu ? 4 : 1 } : e));
    mostrarAviso(cumpriu ? 'Semana cumprida: meta subiu um degrau' : 'Semana puxada: meta desceu um degrau');
  }

  const guardado = [
    ficha && `Apelido: ${ficha.apelido} · idade ${ficha.faixaIdade}`,
    ficha && `Tema: ${temaPorId(ficha.tema).nome}`,
    `${estado.diasCuidados.length} dias cuidados · ${estado.xp} XP`,
    `${estado.humor.length} check-ins de humor · ${estado.tropecos.length} tropeços anotados`,
    `${estado.diario.length} entradas no diário · ${estado.cartas.length} cartas`,
    `${estado.sessoes.length} agendamentos`,
    estado.consentimento && `Consentimento dado em ${new Date(estado.consentimento.em).toLocaleDateString('pt-BR')}`,
  ].filter(Boolean) as string[];

  return (
    <Tela topo={<Cabecalho titulo="Perfil e privacidade" />}>
      <Cartao tom="oceano" style={estilos.cabeca}>
        <Simbolo size={48} neutro={estado.modoDiscreto} />
        <View style={{ flex: 1 }}>
          <Texto v="h2" style={{ color: cores.branco }}>
            {ficha?.apelido ?? 'Você'}
          </Texto>
          <Texto v="apoio" style={{ color: '#D7E2EC' }}>
            Nível {nivel} {plano ? `· ${NOME_ROTA[plano.nivel]}` : ''}
          </Texto>
        </View>
      </Cartao>

      {/* Painel de dados (LGPD) */}
      <Texto v="h2">Seus dados</Texto>
      <Cartao style={{ gap: espaco.md }}>
        <Texto v="h3">O que está guardado</Texto>
        <Texto v="apoio">Tudo fica neste aparelho. Nada é vendido nem usado para anúncio.</Texto>
        {guardado.map((g) => (
          <View key={g} style={{ flexDirection: 'row', gap: espaco.sm }}>
            <Icone nome="check" size={18} cor={cores.mare} />
            <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
              {g}
            </Texto>
          </View>
        ))}
        <Botao titulo={verDados ? 'Esconder dados completos' : 'Ver dados completos'} variante="fantasma" icone="olho" onPress={() => setVerDados(!verDados)} />
        {verDados && (
          <View style={estilos.json}>
            <Texto style={estilos.jsonTexto} selectable>
              {JSON.stringify(estado, null, 2)}
            </Texto>
          </View>
        )}
        <Botao titulo="Baixar meus dados" variante="contorno" icone="baixar" onPress={baixar} />
        <Botao titulo="Corrigir minhas respostas" variante="contorno" icone="lapis" onPress={() => router.push('/ficha')} />
        <Linha
          icone="grupo"
          titulo="Ajudar a melhorar o app"
          detalhe="Dados anonimizados, sem apelido. Opcional."
          valor={!!estado.consentimento?.melhorias}
          aoMudar={(v) => atualizar((e) => ({ ...e, consentimento: e.consentimento ? { ...e.consentimento, melhorias: v } : e.consentimento }))}
        />
        <Botao titulo="Apagar tudo" variante="fantasma" icone="apagar" onPress={() => setConfirmarApagar(true)} />
      </Cartao>

      {/* Discrição e segurança */}
      <Texto v="h2">Discrição</Texto>
      <Cartao style={{ gap: espaco.lg }}>
        <Linha
          icone="olho"
          titulo="Modo discreto"
          detalhe='Troca o nome exibido para "Hábitos" e usa um ícone neutro.'
          valor={estado.modoDiscreto}
          aoMudar={(v) => atualizar((e) => ({ ...e, modoDiscreto: v }))}
        />
        {/*
          Na versão real, o ícone e o nome na tela inicial do celular mudariam de verdade:
          - iOS: ícones alternativos declarados no app.json e trocados com setAlternateIconName
            (via um módulo como expo-alternate-app-icons).
          - Android: um activity-alias por ícone no AndroidManifest (via config plugin),
            habilitando um e desabilitando o outro.
          No protótipo, só simulamos a escolha nesta prévia e no topo do app.
        */}
        <View style={estilos.previa} accessible accessibilityLabel={`Prévia na tela inicial: ${estado.modoDiscreto ? 'Hábitos' : 'Leme'}`}>
          <View style={estilos.icone}>
            <Simbolo size={40} neutro={estado.modoDiscreto} />
          </View>
          <Texto v="rotulo" style={{ color: cores.oceano }}>
            {estado.modoDiscreto ? 'Hábitos' : 'Leme'}
          </Texto>
          <Texto v="apoio" style={{ fontSize: 12 }}>
            Prévia na tela inicial
          </Texto>
        </View>

        <View style={{ gap: espaco.sm }}>
          <View style={estilos.linha}>
            <Icone nome="cadeado" cor={cores.mare} />
            <View style={{ flex: 1 }}>
              <Texto v="h3" style={{ fontSize: 15 }}>
                Bloqueio por PIN
              </Texto>
              <Texto v="apoio">{estado.pin ? 'Ativo. O app pede o PIN ao abrir.' : 'Pede um PIN de 4 números ao abrir.'}</Texto>
            </View>
          </View>
          {estado.pin ? (
            <Botao titulo="Remover PIN" variante="contorno" onPress={() => atualizar((e) => ({ ...e, pin: null }))} />
          ) : (
            <View style={{ flexDirection: 'row', gap: espaco.sm }}>
              <TextInput
                value={novoPin}
                onChangeText={(t) => setNovoPin(t.replace(/\D/g, '').slice(0, 4))}
                placeholder="4 números"
                placeholderTextColor={cores.neblina}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={4}
                accessibilityLabel="Novo PIN de 4 números"
                style={estilos.campo}
              />
              <Botao titulo="Ativar" variante="oceano" desabilitado={novoPin.length !== 4} onPress={salvarPin} />
            </View>
          )}
        </View>

        <Pressable
          onPress={() => router.push('/notificacoes')}
          accessibilityRole="button"
          style={({ pressed }) => [estilos.linha, pressed && { opacity: 0.8 }]}
        >
          <Icone nome="sino" cor={cores.mare} />
          <View style={{ flex: 1 }}>
            <Texto v="h3" style={{ fontSize: 15 }}>
              Notificações
            </Texto>
            <Texto v="apoio">Sempre discretas. Veja um exemplo.</Texto>
          </View>
          <Icone nome="avancar" cor={cores.neblina} />
        </Pressable>
      </Cartao>

      {/* Ritmo */}
      <Texto v="h2">Ritmo</Texto>
      <Cartao style={{ gap: espaco.lg }}>
        <Linha
          icone={estado.somLigado ? 'somLigado' : 'somDesligado'}
          titulo="Sons do app"
          detalhe="Desligado por padrão. A respiração tem som próprio, com botão de mudo."
          valor={estado.somLigado}
          aoMudar={(v) => atualizar((e) => ({ ...e, somLigado: v }))}
        />
        <View style={{ gap: espaco.sm }}>
          <View style={estilos.linha}>
            <Icone nome="pausa" cor={cores.mare} />
            <View style={{ flex: 1 }}>
              <Texto v="h3" style={{ fontSize: 15 }}>
                Modo pausa
              </Texto>
              <Texto v="apoio">Dar um tempo do app sem perder nada. Missões e avisos param.</Texto>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: espaco.sm, flexWrap: 'wrap' }}>
            {[3, 7, 14].map((d) => (
              <Chip key={d} rotulo={`${d} dias`} onPress={() => pausar(d)} />
            ))}
          </View>
        </View>
      </Cartao>

      {/* Botão escondido: segurar a versão abre as ferramentas de apresentação */}
      <Pressable onLongPress={() => setDemo(!demo)} delayLongPress={800} accessibilityLabel="Versão do aplicativo" style={{ alignItems: 'center', paddingVertical: espaco.md }}>
        <Texto v="apoio" style={{ fontSize: 12 }}>
          Leme · protótipo v0.1
        </Texto>
      </Pressable>

      {demo && (
        <Cartao tom="areia" style={{ gap: espaco.sm }}>
          <Texto v="rotulo">FERRAMENTAS DE APRESENTAÇÃO</Texto>
          <Botao titulo="Simular semana cumprida" variante="contorno" onPress={() => simularSemana(true)} />
          <Botao titulo="Simular semana que não fechou" variante="contorno" onPress={() => simularSemana(false)} />
          <Botao
            titulo="Recarregar energia"
            variante="contorno"
            onPress={() => {
              atualizar((e) => ({ ...e, energia: ENERGIA_MAX, energiaRecargaEm: null }));
              mostrarAviso('Energia cheia');
            }}
          />
          <Botao titulo="Resetar protótipo" variante="oceano" onPress={apagarTudo} />
        </Cartao>
      )}

      <Confirmacao
        visivel={confirmarApagar}
        titulo="Apagar tudo?"
        texto="Seu apelido, plano, diário, cartas e progresso serão apagados deste aparelho. Isso não dá para desfazer."
        confirmar="Sim, apagar tudo"
        cancelar="Manter meus dados"
        aoConfirmar={apagarTudo}
        aoCancelar={() => setConfirmarApagar(false)}
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  cabeca: { flexDirection: 'row', alignItems: 'center', gap: espaco.lg },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, minHeight: 44 },
  json: { backgroundColor: cores.oceano, borderRadius: raio.md, padding: espaco.md, maxHeight: 280, overflow: 'hidden' },
  jsonTexto: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }), fontSize: 11, color: '#D7E2EC' },
  previa: { alignItems: 'center', gap: 6, paddingVertical: espaco.md, backgroundColor: cores.areiaEscura, borderRadius: raio.md },
  icone: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: cores.cartao,
    alignItems: 'center',
    justifyContent: 'center',
  },
  campo: {
    flex: 1,
    minHeight: 52,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    paddingHorizontal: 16,
    fontFamily: fontes.textoMedio,
    fontSize: 18,
    letterSpacing: 6,
    color: cores.oceano,
  },
});
