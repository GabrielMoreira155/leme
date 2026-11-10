# Créditos dos sons

## Som de ondas da respiração

| Onde | Origem | Licença |
|---|---|---|
| Navegador | Gerado ao vivo com Web Audio em `lib/ondas.web.ts`: ruído marrom passando por um filtro passa-baixa, com volume e brilho subindo na inspiração (4s), parados na pausa (4s) e descendo na expiração (6s). Não usa nenhum arquivo. | Criação própria do projeto Leme. Pode ser tratado como CC0. |
| Celular (`ondas.wav`) | Gerado por código em `scripts/gerar-sons.js`: ruído marrom filtrado com envelope de 14s no mesmo ritmo 4, 4, 6. Tocado por `lib/ondas.ts` com fade de entrada e saída. | Criação própria do projeto Leme. Pode ser tratado como CC0. |

## Outros

| Arquivo | Origem | Licença |
|---|---|---|
| `sininho.wav` | Gerado por código em `scripts/gerar-sons.js`: três parciais senoidais (Mi6, Si6, Mi7) com decaimento exponencial. | Criação própria do projeto Leme. Pode ser tratado como CC0. |

Nenhuma música ou gravação de terceiros é usada no protótipo.

Para a versão final, a ideia é trocar por gravações reais de ondas feitas pela equipe ou licenciadas, anotando aqui a fonte, o autor e a licença de cada arquivo.

Para regerar os arquivos: `node scripts/gerar-sons.js`
