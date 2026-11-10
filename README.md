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
npm test                   # testes da lógica de ganhos (lib/ganhos.ts)
npm run publicar           # gera a versão web e publica no GitHub Pages
node scripts/gerar-sons.js # regera os sons placeholder
```

Versões online:

- Vercel: https://leme-mauve.vercel.app (publica sozinha a cada push no `master`; a build é configurada no `vercel.json`)
- GitHub Pages: https://gabrielmoreira155.github.io/leme/ (atualizar com `npm run publicar`)

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
  ficha.tsx           3. ficha em 6 passos (7 com o tema personalizado)
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
  ganhos.tsx          "Calcular meus ganhos" (base do cartão de ganhos)
components/           Botao, Cartao, Chip, Tuga, Simbolo, BarraProgresso, Icone, Tela, Topo...
theme/                cores, fontes, espaçamentos e tipografia
data/                 temas, cuidados, artigos, psicologos, atividades,
                      sinonimos, risco, personalizado, ganhos
lib/                  nivel.ts, plano.ts, tema.ts, interpretarOutro.ts, ganhos.ts,
                      estado.tsx, demo.ts, som.ts, ondas.ts, navegar.ts
tests/                ganhos.test.ts (npm test)
assets/sounds/        ondas.wav, sininho.wav e CREDITS.md
```

## Fluxo e telas

1. **Boas-vindas:** símbolo, Tuga, "Você no controle do rumo, no seu ritmo." Sem conta, só apelido.
2. **Consentimento LGPD:** finalidade, quem vê, o que nunca fazemos e direitos. Dois aceites separados: um obrigatório (montar o plano) e um opcional (dados anonimizados). O botão só libera com o obrigatório.
3. **Ficha em 6 passos** com barra de progresso: apelido e idade, o que mais pesa, frequência, impacto, o que quer cuidar e checagem de segurança. Se a pessoa escolher "Outro", escreve com as palavras dela (ver abaixo).
4. **Classificação de nível** (invisível para a pessoa, ver abaixo).
5. **Apoio:** aparece se a checagem for "às vezes" ou "sim, agora", e também pelo botão fixo **Ajuda agora**. Sem Tuga, sem XP, sem som. CVV 188, SAMU 192 e psicólogo com prioridade.
6. **Plano:** "Sua rota começa em águas calmas", meta da semana, 3 missões, mapa com 4 portos, avisos de álcool, menor de idade e convite para psicólogo quando faz sentido.
7. **App principal** com 4 abas e o botão fixo "Ajuda agora":
   - **Hoje:** cartão com nível, XP, dias cuidados da semana e energia; botão de fissura; check-in de humor; meta da semana; "Como foi hoje com ...?"; missões (+20 XP); quest secreta (+50 XP); cartão de ganhos personalizado; botão "Tive um tropeço".
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

## "Outro" com texto livre (`lib/interpretarOutro.ts`)

Ao tocar em "Outro", aparece um campo ("Conta pra gente, com suas palavras", até 60 caracteres). O texto fica só no aparelho.

1. **Checagem de risco primeiro** (`data/risco.ts`, lista provisória a revisar pelo psicólogo responsável). Frases sobre se machucar ou não querer viver não viram hábito: abrem a tela de Apoio e depois a pessoa pode escolher outro tema.
2. **Reconhecimento** com o dicionário `data/sinonimos.ts`. O texto é normalizado (minúsculas, sem acento, sem pontuação) e comparado com sinônimos e gírias. Termos específicos pesam mais que genéricos: "beber energético" vira café ou energético, não álcool.
3. **Confirmação:** "Parece que você quer cuidar de Apostas. É isso?". "Isso mesmo" usa o tema e guarda o texto para mostrar como "Foco: ...". "Não exatamente" vai para o tema personalizado.
4. **Temas novos** fora da lista: jogos e videogame, compras por impulso, roer unha ou mexer na pele, café ou energético, séries e maratonas. Substâncias ilícitas viram nível pesado com missões genéricas de cuidado e convite ao psicólogo. Relação com a comida (vomitar, ficar sem comer, compulsão) não tem metas de dias livres nem cartão de ganhos: só cuidado, artigos e psicólogo.
5. **Tema personalizado** (texto não reconhecido): 3 perguntas de um toque. Diminuir ou fazer mais; quando acontece (até 2 momentos, que escolhem as missões em `data/personalizado.ts`); e no que pesa (define o tipo de ganho). "Fazer mais" troca as metas de dias livres por metas positivas ("Fazer isso em 3 dias da semana"). A pessoa continua sem criar metas.

Textos não reconhecidos ficam guardados no aparelho, só se a pessoa marcou o aceite opcional, para a equipe ver que temas novos aparecem.

**Preparado para IA:** o app só conhece `interpretarOutro()` e o tipo `Interpretacao`. Para trocar o dicionário por uma classificação com IA, basta criar outro objeto com a interface `Interpretador` e apontar `interpretadorAtivo` para ele. A função já é assíncrona por isso. A checagem de risco continua no aparelho, antes de tudo.

## Cartão de ganhos (`data/ganhos.ts` e `lib/ganhos.ts`)

Todo tema tem um tipo de ganho:

| Tipo | Temas | Base |
|---|---|---|
| Dinheiro | apostas, álcool, cigarro ou vape, doce, compras, café ou energético, personalizado que pesa no dinheiro | reais por semana |
| Tempo | celular, jogos, séries, procrastinação, pornografia, personalizado que pesa no tempo | horas por dia |
| Noites | sono | sem pergunta: noites marcadas como "Dormi no horário" |
| Ondas | ansiedade, roer unha, substâncias, personalizado de energia ou relações | sem pergunta: vezes em que usou o botão de vontade ou a respiração até o fim |
| Nenhum | relação com a comida | sem cartão |

- **Base:** não fica na ficha. Na primeira vez o cartão aparece vazio, com a Tuga e "Calcular meus ganhos". A tela tem a pergunta do tema, campo numérico, exemplos e "Prefiro não informar" (aí o cartão mostra dias cuidados e ondas atravessadas). Dá para mudar em "Como calculamos" e no Perfil.
- **Conta:** a pessoa responde "Como foi hoje com ...?" com um toque (Livre, Menos que o normal, Como sempre; ou Fiz, Fiz um pouco, Não deu hoje para "fazer mais"). Valor do dia = base semanal ÷ 7 (dinheiro) ou base diária (tempo). Livre soma 100%, menos soma 50%, como sempre soma zero. Dias sem resposta não contam e nada é descontado: o total só cresce.
- **"Como calculamos"** abre uma folha com os números reais da pessoa e o botão "Mudar meu valor".
- **Destino do dinheiro** (opcional): guardar, quitar uma conta, presente, viagem ou outro, com valor alvo e barra. Ao bater o alvo, a Tuga comemora: "Porto alcançado!".
- Tudo isso é dado pessoal: fica só no aparelho, aparece em "O que está guardado" e some no "Apagar tudo" e no reset.

## O que é simulado

- Todo o armazenamento (AsyncStorage no aparelho, localStorage no navegador).
- Psicólogos, CRPs, horários, grupos e preços (placeholders).
- Agendamentos e o pedido de conversa prioritária (nada é enviado).
- Nos presets `?demo=...`, a base dos ganhos e o histórico de dias são inventados para a apresentação.
- Modo discreto: só a prévia na tela e o nome no topo. O comentário em `app/perfil.tsx` explica como seria com ícones alternativos de verdade.
- PIN: guardado junto do estado. Na versão real iria para o `expo-secure-store`.
- Notificações: só a tela de exemplo.
- Sons: gerados por código (ver `assets/sounds/CREDITS.md`).
- Os botões de CVV e SAMU abrem o discador de verdade no celular.

## Para apresentar

Para começar do zero, use o botão **Resetar protótipo (para apresentações)** no fim do Perfil, ou abra o link com `?reset=1` no final (ex.: https://leme-mauve.vercel.app/?reset=1). Os dois apagam todo o estado salvo e voltam para a tela de boas-vindas.

Presets que já abrem na tela Hoje com ficha, base dos ganhos e alguns dias de histórico (apagam o estado atual):

- https://leme-mauve.vercel.app/?demo=apostas: R$ 150 por semana, 7 dias livres e 4 com menos, destino "Guardar" com alvo de R$ 200. Marcar "Livre" hoje já mostra o porto alcançado.
- https://leme-mauve.vercel.app/?demo=celular: 3h por dia, ganhos em horas com equivalência.
- https://leme-mauve.vercel.app/?demo=outro: "Outro" com o texto "comprar coisas por impulso", algumas compras evitadas e destino "Uma viagem".

Use os links na raiz do site, como acima. Abrindo um preset numa tela interna, o parâmetro fica na barra e recarregar a página aplica o preset de novo.

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
