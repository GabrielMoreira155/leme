import { StyleSheet, View } from 'react-native';
import type { RespostaDia } from '@/lib/ganhos';
import { hoje, useEstado } from '@/lib/estado';
import { temaDaFicha } from '@/lib/tema';
import { cores, espaco } from '@/theme';
import { Chip } from './Chip';
import { Icone } from './Icone';
import { Texto } from './Texto';

// "Como foi hoje com ...?" de 1 toque, junto do check-in de humor. Alimenta o cartão de ganhos.
// Depois de respondida, a resposta do dia fica fixa: o total de ganhos nunca diminui.

const OPCOES_PADRAO: Record<RespostaDia, string> = { livre: 'Livre', menos: 'Menos que o normal', sempre: 'Como sempre' };
const OPCOES_FAZER_MAIS: Record<RespostaDia, string> = { livre: 'Fiz', menos: 'Fiz um pouco', sempre: 'Não deu hoje' };
const OPCOES_SONO: Record<RespostaDia, string> = { livre: 'Dormi no horário', menos: 'Quase no horário', sempre: 'Como sempre' };

export function PerguntaDoDia() {
  const { estado, atualizar, marcarDiaCuidado, mostrarAviso } = useEstado();
  if (!estado.ficha) return null;
  const tema = temaDaFicha(estado.ficha);
  if (tema.semMetas) return null;

  const rotulos: Record<RespostaDia, string> = tema.respostasDia
    ? { livre: tema.respostasDia[0], menos: tema.respostasDia[1], sempre: tema.respostasDia[2] }
    : tema.fazerMais
      ? OPCOES_FAZER_MAIS
      : tema.id === 'sono'
        ? OPCOES_SONO
        : OPCOES_PADRAO;
  const pergunta = tema.perguntaDia ?? `Como foi hoje com ${tema.nomeCurto}?`;
  const dia = hoje();
  const resposta = estado.registroDiario[dia];

  function responder(r: RespostaDia) {
    atualizar((e) => ({ ...e, registroDiario: { ...e.registroDiario, [dia]: r } }));
    if (r !== 'sempre') marcarDiaCuidado();
    mostrarAviso(r === 'sempre' ? 'Anotado. Amanhã é outro dia.' : 'Anotado. Isso entra nos seus ganhos.');
  }

  return (
    <View style={estilos.bloco}>
      <Texto v="h3">{pergunta}</Texto>
      {resposta ? (
        <View style={estilos.feito}>
          <Icone nome="check" size={18} cor={cores.mare} />
          <Texto v="apoio" style={{ color: cores.oceano, flex: 1 }}>
            Anotado: {rotulos[resposta].toLowerCase()}. Obrigado por contar.
          </Texto>
        </View>
      ) : (
        <View style={estilos.chips} accessibilityRole="radiogroup">
          {(Object.keys(rotulos) as RespostaDia[]).map((r) => (
            <Chip key={r} rotulo={rotulos[r]} onPress={() => responder(r)} />
          ))}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: { gap: espaco.sm, borderTopWidth: 1, borderTopColor: cores.linha, paddingTop: espaco.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  feito: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
});
