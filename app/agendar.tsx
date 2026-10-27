import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Botao, Cabecalho, Cartao, Chip, Icone, Tela, Texto, Tuga } from '@/components';
import { Marcar } from '@/components/Marcar';
import { GRUPOS, PLANOS_SESSOES, PSICOLOGOS } from '@/data/psicologos';
import { useEstado } from '@/lib/estado';
import { cores, espaco, fontes, raio } from '@/theme';

// Agendamento simulado. Nenhum dado sai do aparelho e nada é cobrado.

const HORARIOS_PADRAO = ['Hoje 19h', 'Amanhã 12h', 'Amanhã 20h', 'Sáb 10h'];

function descrever(tipo: string, id: string) {
  if (tipo === 'psicologo') {
    const p = PSICOLOGOS.find((x) => x.id === id) ?? PSICOLOGOS[0];
    return { titulo: `Sessão com ${p.nome}`, tipo: 'Sessão individual', com: p.nome, horarios: p.horarios, detalhe: `${p.crp} · ${p.abordagem}` };
  }
  if (tipo === 'grupo') {
    const g = GRUPOS.find((x) => x.id === id) ?? GRUPOS[0];
    return { titulo: `Roda: ${g.tema}`, tipo: 'Roda anônima', com: g.tema, horarios: [g.quando], detalhe: '8 a 12 pessoas · preço social R$ [a definir]' };
  }
  if (tipo === 'plano') {
    const p = PLANOS_SESSOES.find((x) => x.id === id) ?? PLANOS_SESSOES[0];
    return { titulo: `Plano de ${p.sessoes} sessões`, tipo: `Plano ${p.sessoes}x`, com: 'Profissional a combinar', horarios: HORARIOS_PADRAO, detalhe: 'R$ [a definir] por mês' };
  }
  return { titulo: 'Conversa de acolhimento', tipo: 'Acolhimento', com: 'Equipe Leme', horarios: HORARIOS_PADRAO, detalhe: 'Gratuita · 20 a 30 min' };
}

export default function Agendar() {
  const { tipo = 'acolhimento', id = '' } = useLocalSearchParams<{ tipo?: string; id?: string }>();
  const { estado, atualizar } = useEstado();
  const info = descrever(tipo, id);
  const menor = !!estado.plano?.menorDeIdade;
  const [enviarFicha, setEnviarFicha] = useState(false);
  const [responsavelOk, setResponsavelOk] = useState(false);
  const [responsavel, setResponsavel] = useState('');
  const [horario, setHorario] = useState<string | null>(null);
  const [feito, setFeito] = useState(false);

  const pode = !!horario && (!menor || (responsavelOk && responsavel.trim().length > 1));

  function confirmar() {
    atualizar((e) => ({
      ...e,
      sessoes: [...e.sessoes, { id: `${tipo}-${Date.now()}`, tipo: info.tipo, com: info.com, horario: horario!, em: new Date().toISOString() }],
    }));
    setFeito(true);
  }

  if (feito) {
    return (
      <Tela topo={<Cabecalho voltar={false} />} rodape={<Botao titulo="Voltar para Sessões" onPress={() => router.back()} />}>
        <View style={{ alignItems: 'center', gap: espaco.lg, marginTop: espaco.xl }}>
          <Tuga pose="padrao" size={180} />
          <Texto v="h1" style={{ textAlign: 'center' }}>
            Combinado, {estado.ficha?.apelido}
          </Texto>
          <Texto v="corpo" style={{ textAlign: 'center' }}>
            {info.titulo} · {horario}. A gente avisa por aqui antes de começar.
          </Texto>
          <Texto v="apoio" style={{ textAlign: 'center' }}>
            {enviarFicha ? 'Sua ficha vai junto, como você autorizou.' : 'Sua ficha não foi enviada. Você conta o que quiser na conversa.'}
          </Texto>
          <Texto v="apoio" style={{ textAlign: 'center', fontSize: 12 }}>
            Agendamento simulado no protótipo.
          </Texto>
        </View>
      </Tela>
    );
  }

  return (
    <Tela topo={<Cabecalho titulo="Agendar" />} rodape={<Botao titulo="Confirmar" desabilitado={!pode} onPress={confirmar} />}>
      <Texto v="h1">{info.titulo}</Texto>
      <Texto v="apoio">{info.detalhe}</Texto>

      <Texto v="h3">Escolha um horário</Texto>
      <View style={estilos.chips} accessibilityRole="radiogroup">
        {info.horarios.map((h) => (
          <Chip key={h} icone="relogio" rotulo={h} selecionado={horario === h} onPress={() => setHorario(h)} />
        ))}
      </View>

      <Marcar
        etiqueta="Opcional"
        marcado={enviarFicha}
        aoMudar={setEnviarFicha}
        titulo="Autorizo enviar minha ficha para o profissional"
        detalhe={`Ele vai ver só o apelido "${estado.ficha?.apelido ?? ''}" e as respostas da ficha. Sem nome, sem telefone.`}
      />

      {menor && (
        <Cartao tom="areia" style={{ gap: espaco.md }}>
          <View style={{ flexDirection: 'row', gap: espaco.sm, alignItems: 'center' }}>
            <Icone nome="pessoa" cor={cores.mare} />
            <Texto v="h3" style={{ flex: 1 }}>
              Concordância de um responsável
            </Texto>
          </View>
          <Texto v="apoio">Para menores de 18 anos, a sessão precisa da concordância de um responsável. O conteúdo das conversas continua protegido pelo sigilo profissional.</Texto>
          <TextInput
            value={responsavel}
            onChangeText={setResponsavel}
            placeholder="Nome do responsável"
            placeholderTextColor={cores.neblina}
            accessibilityLabel="Nome do responsável"
            style={estilos.campo}
          />
          <Marcar marcado={responsavelOk} aoMudar={setResponsavelOk} titulo="Meu responsável sabe e concorda com as sessões" />
        </Cartao>
      )}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  campo: {
    minHeight: 52,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    paddingHorizontal: 16,
    fontFamily: fontes.texto,
    fontSize: 16,
    color: cores.oceano,
  },
});
