import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Botao, Cartao, Icone, Texto } from '@/components';
import { GRUPOS, PLANOS_SESSOES, PSICOLOGOS } from '@/data/psicologos';
import { useEstado } from '@/lib/estado';
import { cores, espaco, fontes } from '@/theme';

function agendar(tipo: string, id?: string) {
  router.push({ pathname: '/agendar', params: { tipo, id: id ?? '' } });
}

export default function Sessoes() {
  const { estado } = useEstado();
  const [inicio, setInicio] = useState(0);
  const destaque = estado.plano?.sessoesEmDestaque ?? true;
  const menor = estado.plano?.menorDeIdade;
  const visiveis = [0, 1, 2].map((i) => PSICOLOGOS[(inicio + i) % PSICOLOGOS.length]);

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <Texto v="h1">Sessões</Texto>
      <Texto v="apoio">Conversar com alguém preparado faz a viagem ficar mais leve. Você escolhe se e quando.</Texto>

      {estado.sessoes.length > 0 && (
        <Cartao tom="turquesa" style={{ gap: espaco.sm }}>
          <Texto v="rotulo" style={{ color: cores.mare }}>
            SEUS AGENDAMENTOS
          </Texto>
          {estado.sessoes.map((s) => (
            <View key={s.id} style={{ flexDirection: 'row', gap: espaco.sm, alignItems: 'center' }}>
              <Icone nome="relogio" size={18} cor={cores.mare} />
              <Texto v="corpo" style={{ flex: 1, fontSize: 15 }}>
                {s.tipo} · {s.com} · {s.horario}
              </Texto>
            </View>
          ))}
        </Cartao>
      )}

      {menor && (
        <Cartao tom="areia" style={{ flexDirection: 'row', gap: espaco.md }}>
          <Icone nome="pessoa" cor={cores.mare} />
          <Texto v="apoio" style={{ flex: 1, color: cores.oceano }}>
            Como você tem menos de 18 anos, as sessões pedem a concordância de um responsável. A gente explica tudo na hora de agendar.
          </Texto>
        </Cartao>
      )}

      {/* Destaque: conversa de acolhimento gratuita */}
      <Cartao tom={destaque ? 'oceano' : 'claro'} style={{ gap: espaco.md }}>
        <Texto v="rotulo" style={{ color: destaque ? cores.turquesa : cores.mare }}>
          GRATUITA · 20 A 30 MIN
        </Texto>
        <Texto v="h2" style={{ color: destaque ? cores.branco : cores.oceano }}>
          Conversa de acolhimento
        </Texto>
        <Texto v="apoio" style={{ color: destaque ? '#D7E2EC' : cores.neblina }}>
          Um primeiro papo para entender o seu momento. Sua ficha só vai para o psicólogo se você autorizar, e você aparece só pelo apelido.
        </Texto>
        <Botao titulo="Agendar conversa gratuita" variante={destaque ? 'primario' : 'oceano'} onPress={() => agendar('acolhimento')} />
      </Cartao>

      <Texto v="h2" style={{ marginTop: espaco.sm }}>
        Psicólogos
      </Texto>
      {visiveis.map((p) => (
        <Cartao key={p.id} style={{ gap: espaco.sm }}>
          <View style={estilos.linha}>
            <View style={estilos.avatar}>
              <Texto style={estilos.iniciais}>
                {p.nome
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Texto>
            </View>
            <View style={{ flex: 1 }}>
              <Texto v="h3">{p.nome}</Texto>
              <Texto v="apoio">
                {p.crp} · {p.abordagem}
              </Texto>
            </View>
          </View>
          <Texto v="corpo" style={{ fontSize: 15 }}>
            {p.descricao}
          </Texto>
          <Botao titulo="Ver horários" variante="contorno" onPress={() => agendar('psicologo', p.id)} />
        </Cartao>
      ))}
      <Botao
        titulo="Quero conhecer outro profissional"
        variante="fantasma"
        icone="grupo"
        onPress={() => setInicio((inicio + 3) % PSICOLOGOS.length)}
      />
      <Texto v="apoio" style={{ textAlign: 'center', marginTop: -espaco.sm }}>
        Trocar de profissional é normal e ninguém fica sabendo.
      </Texto>

      <Texto v="h2" style={{ marginTop: espaco.sm }}>
        Rodas anônimas
      </Texto>
      <Texto v="apoio">Grupos por tema, de 8 a 12 pessoas, com um psicólogo conduzindo. Câmera opcional, só apelido.</Texto>
      {GRUPOS.map((g) => (
        <Cartao key={g.id} style={estilos.grupo} onPress={() => agendar('grupo', g.id)} acessibilidade={`Roda ${g.tema}, ${g.quando}`}>
          <Icone nome="grupo" cor={cores.mare} />
          <View style={{ flex: 1 }}>
            <Texto v="h3">{g.tema}</Texto>
            <Texto v="apoio">
              {g.quando} · {g.vagas} vagas · preço social R$ [a definir]
            </Texto>
          </View>
          <Icone nome="avancar" cor={cores.neblina} />
        </Cartao>
      ))}

      <Texto v="h2" style={{ marginTop: espaco.sm }}>
        Planos individuais
      </Texto>
      <View style={estilos.planos}>
        {PLANOS_SESSOES.map((p) => (
          <Cartao key={p.id} style={estilos.plano} onPress={() => agendar('plano', p.id)} acessibilidade={`Plano de ${p.sessoes} sessões por mês`}>
            <Texto style={estilos.numero}>{p.sessoes}</Texto>
            <Texto v="rotulo">SESSÕES/MÊS</Texto>
            <Texto v="apoio" style={{ textAlign: 'center', fontSize: 13 }}>
              {p.descricao}
            </Texto>
            <Texto v="h3" style={{ fontSize: 14 }}>
              R$ [a definir]
            </Texto>
          </Cartao>
        ))}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: espaco.xl, gap: espaco.md, paddingBottom: espaco.xxxl },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: cores.turquesaSuave, alignItems: 'center', justifyContent: 'center' },
  iniciais: { fontFamily: fontes.tituloMedio, fontSize: 16, color: cores.mare },
  grupo: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  planos: { flexDirection: 'row', gap: espaco.sm },
  plano: { flex: 1, alignItems: 'center', gap: 4, padding: espaco.md },
  numero: { fontFamily: fontes.titulo, fontSize: 30, lineHeight: 36, color: cores.oceano },
});
