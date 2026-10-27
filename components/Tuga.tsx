import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { cores } from '@/theme';

export type PoseTuga = 'padrao' | 'comemora' | 'respira' | 'acolhe';

type Props = {
  pose?: PoseTuga;
  size?: number;
};

const ROTULOS: Record<PoseTuga, string> = {
  padrao: 'Tuga, a tartaruga do Leme, sorrindo',
  comemora: 'Tuga comemorando com a nadadeira levantada',
  respira: 'Tuga de olhos fechados, respirando com calma',
  acolhe: 'Tuga segurando uma boia salva-vidas',
};

const PELE = cores.tugaPele;

// Estrelinha de 4 pontas para a pose "comemora".
function Estrela({ x, y, r, cor }: { x: number; y: number; r: number; cor: string }) {
  const d = `M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`;
  return <Path d={d} fill={cor} />;
}

// Mascote do Leme. Regra: a Tuga NUNCA aparece nas telas de crise.
export function Tuga({ pose = 'padrao', size = 160 }: Props) {
  const altura = (size * 200) / 250;
  return (
    <Svg width={size} height={altura} viewBox="0 0 250 200" accessibilityRole="image" accessibilityLabel={ROTULOS[pose]}>
      {/* nadadeiras de trás e de apoio */}
      <Ellipse cx="62" cy="160" rx="26" ry="12" fill={PELE} transform="rotate(-20 62 160)" />
      <Ellipse cx="150" cy="164" rx="26" ry="12" fill={PELE} transform="rotate(20 150 164)" />
      <Ellipse cx="40" cy="110" rx="30" ry="13" fill={PELE} transform="rotate(-35 40 110)" />

      {/* nadadeira da frente levantada (comemora) fica atrás do casco */}
      {pose === 'comemora' && (
        <Ellipse cx="170" cy="70" rx="28" ry="12" fill={PELE} transform="rotate(-58 170 70)" />
      )}

      {/* casco */}
      <Path d="M32 148 A80 72 0 0 1 192 148 Z" fill={cores.tugaCasco} />
      <Path d="M112 84 L136 100 L130 128 L94 128 L88 100 Z" fill="none" stroke={cores.tugaLinha} strokeWidth={4} />
      <Path
        d="M88 100 L60 108 M136 100 L164 108 M94 128 L76 148 M130 128 L148 148 M112 84 L112 76"
        stroke={cores.tugaLinha}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Rect x="28" y="142" width="168" height="14" rx="7" fill={cores.areia} />

      {/* cabeça */}
      <Circle cx="200" cy="112" r="28" fill={PELE} />

      {/* olhos */}
      {pose === 'padrao' || pose === 'acolhe' ? (
        <G>
          <Circle cx="208" cy="106" r="6" fill={cores.oceano} />
          <Circle cx="210" cy="104" r="2" fill="#FFFFFF" />
        </G>
      ) : pose === 'comemora' ? (
        // olho fechado de alegria (arco para cima)
        <Path d="M201 108 Q208 99 215 108" stroke={cores.oceano} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      ) : (
        // olho fechado relaxado (arco para baixo)
        <Path d="M201 105 Q208 112 215 105" stroke={cores.oceano} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      )}

      {/* bochecha */}
      <Circle cx="214" cy="120" r="5" fill={cores.coral} opacity={0.5} />

      {/* boca */}
      {pose === 'comemora' ? (
        <G>
          <Path d="M199 121 Q210 138 221 120 Z" fill={cores.oceano} />
          <Path d="M204 127 Q210 133 216 126 Q210 129 204 127 Z" fill={cores.coral} />
        </G>
      ) : pose === 'respira' ? (
        <Path d="M206 125 Q210 128 214 125" stroke={cores.oceano} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      ) : (
        <Path d="M200 124 Q210 132 220 122" stroke={cores.oceano} strokeWidth={3.5} strokeLinecap="round" fill="none" />
      )}

      {/* quepe branco com faixa coral */}
      <Path d="M176 92 Q200 66 224 92 Z" fill="#FFFFFF" />
      <Rect x="174" y="88" width="52" height="9" rx="4" fill={cores.coral} />

      {pose === 'comemora' && (
        <G>
          <Estrela x={150} y={40} r={9} cor={cores.coral} />
          <Estrela x={236} y={62} r={7} cor={cores.turquesa} />
          <Estrela x={120} y={62} r={6} cor={cores.turquesa} />
          <Estrela x={208} y={40} r={5} cor={cores.coral} />
        </G>
      )}

      {pose === 'respira' && (
        // linhas de ar saindo devagar
        <G stroke={cores.turquesa} strokeWidth={3} strokeLinecap="round" fill="none">
          <Path d="M232 118 q6 -4 12 0" />
          <Path d="M230 128 q7 -4 14 0" />
          <Path d="M232 138 q6 -4 12 0" />
        </G>
      )}

      {pose === 'acolhe' && (
        <G>
          {/* boia branca e coral */}
          <Circle cx="178" cy="160" r="22" fill="none" stroke="#FFFFFF" strokeWidth={12} />
          <Circle
            cx="178"
            cy="160"
            r="22"
            fill="none"
            stroke={cores.coral}
            strokeWidth={12}
            strokeDasharray="17.3 17.3"
            strokeDashoffset={8}
          />
          <Circle cx="178" cy="160" r="28" fill="none" stroke={cores.linha} strokeWidth={1} />
          {/* nadadeira segurando a boia */}
          <Ellipse cx="162" cy="146" rx="22" ry="10" fill={PELE} transform="rotate(30 162 146)" />
        </G>
      )}
    </Svg>
  );
}
