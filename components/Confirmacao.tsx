import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { cores, espaco, raio } from '@/theme';
import { Botao } from './Botao';
import { Texto } from './Texto';

// Confirmação dentro do app (sem alert nativo).
type Props = {
  visivel: boolean;
  titulo: string;
  texto: string;
  confirmar: string;
  cancelar?: string;
  aoConfirmar: () => void;
  aoCancelar: () => void;
};

export function Confirmacao({ visivel, titulo, texto, confirmar, cancelar = 'Cancelar', aoConfirmar, aoCancelar }: Props) {
  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoCancelar}>
      <Pressable style={estilos.fundo} onPress={aoCancelar} accessibilityLabel="Fechar">
        <Pressable style={estilos.caixa} onPress={() => {}}>
          <Texto v="h2">{titulo}</Texto>
          <Texto v="apoio" style={{ fontSize: 15, lineHeight: 22 }}>
            {texto}
          </Texto>
          <View style={{ gap: espaco.sm, marginTop: espaco.sm }}>
            <Botao titulo={confirmar} variante="oceano" onPress={aoConfirmar} />
            <Botao titulo={cancelar} variante="fantasma" onPress={aoCancelar} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(18,58,90,0.55)', justifyContent: 'center', padding: espaco.xl },
  caixa: { backgroundColor: cores.areia, borderRadius: raio.lg, padding: espaco.xl, gap: espaco.md, maxWidth: 420, width: '100%', alignSelf: 'center' },
});
