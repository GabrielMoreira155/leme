# Leme · protótipo navegável

App de saúde mental para retomar o controle de hábitos que pesam, dos leves (celular, sono, procrastinação) até vícios (apostas, álcool, pornografia).

Este é um **rascunho funcional** para apresentar a sócios e à incubadora. O foco é a experiência e o visual. Não existe backend, login real nem pagamento real: tudo fica guardado no próprio aparelho.

## Como rodar

Precisa de Node 20 ou mais novo.

```bash
npm install
npx expo start
```

- **No celular:** instale o app **Expo Go**, abra a câmera (iPhone) ou o próprio Expo Go (Android) e leia o QR code que aparece no terminal.
- **No navegador:** aperte `w` no terminal, ou rode direto `npx expo start --web`. O app abre numa coluna com largura de celular.

Outros comandos úteis:

```bash
npm run typecheck          # checagem de tipos
node scripts/gerar-sons.js # regera os sons placeholder
```

## Stack

- Expo SDK 58 (React Native) com TypeScript e Expo Router
- AsyncStorage para o estado da pessoa
- react-native-svg (Tuga, símbolo e ícones), expo-haptics (vibração), expo-audio (som)
- Fontes Sora e Figtree via `@expo-google-fonts`

## Estrutura

```
app/                  telas (cada arquivo é uma rota do Expo Router)
  index.tsx           portão: decide para onde a pessoa vai ao abrir
  boas-vindas.tsx     1. boas-vindas
  consentimento.tsx   2. consentimento LGPD
  ficha.tsx           3. ficha em 6 passos
  apoio.tsx           5. tela de apoio (crise)
  plano.tsx           6. plano gerado
  (abas)/             7. app principal: hoje, atividades, artigos, sessoes
  fissura.tsx         sequência "Estou com vontade agora" e respiração
  tropeco.tsx         "Tive um tropeço"
  atividade/[id].tsx  surfar a vontade, diário, hora difícil, carta
  artigo/[id].tsx     leitura de artigo
  agendar.tsx         agendamento simulado de sessões
  perfil.tsx          8. perfil e privacidade
  pin.tsx  pausa.tsx  bloqueio por PIN e modo pausa
  notificacoes.tsx    9. exemplo de notificações
components/           Botao, Cartao, Chip, Tuga, Simbolo, BarraProgresso, Icone, Tela, Topo...
theme/                cores, fontes, espaçamentos e tipografia
data/                 temas, cuidados, artigos, psicologos, atividades
lib/                  nivel.ts, plano.ts, estado.tsx, som.ts, navegar.ts
assets/sounds/        ondas.wav, sininho.wav e CREDITS.md
```

## Fluxo e telas

1. **Boas-vindas:** símbolo, Tuga, "Você no controle do rumo, no seu ritmo." Sem conta, só apelido.
2. **Consentimento LGPD:** finalidade, quem vê, o que nunca fazemos e direitos. Dois aceites separados: um obrigatório (montar o plano) e um opcional (dados anonimizados). O botão só libera com o obrigatório.
3. **Ficha em 6 passos** com barra de progresso: apelido e idade, o que mais pesa, frequência, impacto, o que quer cuidar e checagem de segurança.
4. **Classificação de nível** (invisível para a pessoa, ver abaixo).
5. **Apoio:** aparece se a checagem for "às vezes" ou "sim, agora", e também pelo botão fixo **Ajuda agora**. Sem Tuga, sem XP, sem som. CVV 188, SAMU 192 e psicólogo com prioridade.
6. **Plano:** "Sua rota começa em águas calmas", meta da semana, 3 missões, mapa com 4 portos, avisos de álcool, menor de idade e convite para psicólogo quando faz sentido.
7. **App principal** com 4 abas e o botão fixo "Ajuda agora":
   - **Hoje:** cartão com nível, XP, dias cuidados da semana e energia; botão de fissura; check-in de humor; meta da semana; missões (+20 XP); quest secreta (+50 XP); ganhos reais; botão "Tive um tropeço".
   - **Atividades:** respiração de emergência (sempre livre) e 4 atividades que gastam 1 de energia (+15 XP).
   - **Artigos:** 5 artigos curtos, +10 XP na primeira leitura, com rodapé de revisão profissional.
   - **Sessões:** conversa de acolhimento gratuita, psicólogos fictícios, rodas anônimas e planos com preço a definir.
8. **Perfil e privacidade:** ver, baixar (JSON), corrigir e apagar os dados; modo discreto; PIN; modo pausa; som.
9. **Notificações:** exemplo de tela bloqueada com textos discretos.

## Lógica de nível (`lib/nivel.ts`)

**Provisória.** Feita só para o protótipo e comentada para o psicólogo responsável revisar. A versão real vai usar questionários de triagem validados.

- Temas pesados: apostas, álcool, cigarro ou vape, pornografia. Os outros são leves.
- Frequência alta: "várias vezes ao dia" ou "quase todo dia".

| Tema | Regra | Nível |
|---|---|---|
| Leve | frequência alta **ou** impacto "bastante" | Moderado |
| Leve | impacto "não" ou "um pouco", frequência baixa | Leve |
| Pesado | frequência alta **ou** impacto "um pouco" ou "bastante" | Pesado |
| Pesado | impacto "não" e frequência baixa | Moderado |

O nível nunca aparece como rótulo clínico. Ele vira o nome da rota (costeira, mar aberto, com tripulação) e ajusta o plano:

- **Leve:** sessões ficam discretas.
- **Pesado** (ou resposta de risco na checagem): convite para psicólogo já aparece no plano e as sessões ficam em destaque.

## Lógica de metas (`lib/plano.ts`)

A pessoa nunca cria as próprias metas. A meta da semana tem 4 degraus:

1. 2 dias com menos do que o normal
2. 2 dias livres
3. 4 dias livres
4. 7 dias livres seguidos

O degrau inicial vem da frequência: quanto mais frequente, mais leve o começo (várias vezes ao dia começa no 1, em fases começa no 4). **Álcool sempre começa no degrau 1**, porque parar de uma vez pode fazer mal e a redução deve ser gradual e acompanhada.

Cada semana cumprida sobe um degrau e abre o próximo porto. Semana que não fecha desce um degrau sozinha, sem castigo. Tropeço nunca apaga nível nem dias cuidados.

Missões do dia: 2 do tema (giram a cada dia) e 1 do "o que quer cuidar" (hábito bom para colocar no lugar).

## O que é simulado

- Todo o armazenamento (AsyncStorage no aparelho, localStorage no navegador).
- Psicólogos, CRPs, horários, grupos e preços (placeholders).
- Agendamentos e o pedido de conversa prioritária (nada é enviado).
- Ganhos reais (valores médios fictícios por tema).
- Modo discreto: só a prévia na tela e o nome no topo. O comentário em `app/perfil.tsx` explica como seria com ícones alternativos de verdade.
- PIN: guardado junto do estado. Na versão real iria para o `expo-secure-store`.
- Notificações: só a tela de exemplo.
- Sons: gerados por código (ver `assets/sounds/CREDITS.md`).
- Os botões de CVV e SAMU abrem o discador de verdade no celular.

## Para apresentar

No **Perfil**, toque **5 vezes** (ou segure) em "Leme · protótipo v0.1" no fim da tela. Abre o painel escondido com:

- **Simular semana cumprida / que não fechou:** mostra a meta subindo ou descendo e o mapa de portos andando.
- **Recarregar energia**
- **Resetar protótipo:** volta para a tela de boas-vindas, do zero.

Sugestão de roteiro: uma ficha leve (Celular, algumas vezes por semana, impacto "um pouco"), uma pesada (Apostas, várias vezes ao dia, impacto "bastante", 13 a 17 anos) e uma com resposta "às vezes" na checagem de segurança.

## Regras de produto respeitadas

- Sem ranking entre pessoas. Comparação só com a própria semana anterior.
- Telas de crise sem mascote, sem XP, sem som e sem brincadeira.
- Nenhuma cor de erro. Tropeço não é falha.
- Áreas de toque de 44px no mínimo, rótulos de acessibilidade em botões só com ícone, legenda no áudio da respiração.
- Notificações nunca citam o hábito, o vício ou a recaída.
