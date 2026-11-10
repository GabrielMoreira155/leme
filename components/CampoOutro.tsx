import { StyleSheet, TextInput, View } from 'react-native';
import { temaPorId } from '@/data/temas';
import type { Interpretacao } from '@/lib/interpretarOutro';
import { cores, espaco, fontes, raio } from '@/theme';
import { Botao } from './Botao';
import { Icone } from './Icone';
import { Texto } from './Texto';

export const LIMITE_OUTRO = 60;
export const MINIMO_OUTRO = 3;

export type DecisaoOutro = 'confirmado' | 'personalizado' | null;

type Props = {
  texto: string;
  aoMudarTexto: (t: string) => void;
  interpretacao: Interpretacao | null;
  decisao: DecisaoOutro;
  aoDecidir: (d: DecisaoOutro) => void;
};

// Campo que aparece quando a pessoa toca em "Outro" no passo "O que mais pesa hoje?".
export function CampoOutro({ texto, aoMudarTexto, interpretacao, decisao, aoDecidir }: Props) {
  const reconhecido = interpretacao && interpretacao.tipo !== 'risco' && interpretacao.temaId ? temaPorId(interpretacao.temaId) : null;
  const naoReconhecido = interpretacao && interpretacao.tipo !== 'risco' && !interpretacao.temaId;

  return (
    <View style={estilos.caixa}>
      <Texto v="h3">Conta pra gente, com suas palavras</Texto>
      <TextInput
        value={texto}
        onChangeText={aoMudarTexto}
        placeholder="Ex.: comprar coisas por impulso"
        placeholderTextColor={cores.neblina}
        maxLength={LIMITE_OUTRO}
        accessibilityLabel="O que mais pesa hoje, com suas palavras"
        style={estilos.campo}
        autoFocus
      />
      <View style={estilos.rodape}>
        <Texto v="apoio" style={{ flex: 1, fontSize: 13 }}>
          Fica só no seu aparelho. Escreva do jeito que preferir.
        </Texto>
        <Texto v="rotulo" accessibilityLabel={`${texto.length} de ${LIMITE_OUTRO} caracteres`}>
          {texto.length}/{LIMITE_OUTRO}
        </Texto>
      </View>

      {reconhecido && decisao === null && (
        <View style={estilos.confirmar} accessibilityLiveRegion="polite">
          <Texto v="corpo" style={{ fontSize: 15 }}>
            Parece que você quer cuidar de <Texto style={{ fontFamily: fontes.textoNegrito }}>{reconhecido.nome}</Texto>. É isso?
          </Texto>
          <View style={estilos.botoes}>
            <Botao titulo="Isso mesmo" variante="oceano" onPress={() => aoDecidir('confirmado')} style={{ flex: 1 }} />
            <Botao titulo="Não exatamente" variante="contorno" onPress={() => aoDecidir('personalizado')} style={{ flex: 1 }} />
          </View>
        </View>
      )}

      {reconhecido && decisao === 'confirmado' && (
        <View style={estilos.nota}>
          <Icone nome="check" size={18} cor={cores.mare} />
          <Texto v="apoio" style={{ flex: 1, color: cores.oceano }}>
            Combinado: {reconhecido.nome}. O seu texto aparece no app como foco.
          </Texto>
          <Botao titulo="Mudar" variante="fantasma" onPress={() => aoDecidir(null)} style={{ paddingHorizontal: 8 }} />
        </View>
      )}

      {((reconhecido && decisao === 'personalizado') || naoReconhecido) && (
        <View style={estilos.nota}>
          <Icone nome="bussola" size={18} cor={cores.mare} />
          <Texto v="apoio" style={{ flex: 1, color: cores.oceano }}>
            Tudo bem. No próximo passo, 3 perguntas rápidas para montar um plano do seu jeito.
          </Texto>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: { gap: espaco.sm, padding: espaco.lg, borderRadius: raio.md, backgroundColor: cores.turquesaSuave },
  campo: {
    minHeight: 52,
    borderRadius: raio.md,
    borderWidth: 1.5,
    borderColor: cores.linha,
    backgroundColor: cores.cartao,
    paddingHorizontal: 16,
    fontFamily: fontes.textoMedio,
    fontSize: 16,
    color: cores.oceano,
  },
  rodape: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  confirmar: { gap: espaco.sm, padding: espaco.md, borderRadius: raio.md, backgroundColor: cores.cartao },
  botoes: { flexDirection: 'row', gap: espaco.sm },
  nota: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, padding: espaco.md, borderRadius: raio.md, backgroundColor: cores.cartao },
});
