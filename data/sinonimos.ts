import type { IdTema } from './temas';

// Dicionário usado por lib/interpretarOutro.ts para reconhecer o texto do "Outro".
// Escreva tudo já normalizado: minúsculas, sem acento e sem pontuação.
// Um termo terminado em * vale como começo de palavra ("apost*" pega aposta, apostar, apostando).
// Um termo começando com ~ é genérico e pesa menos: "beber energetico" fica com café/energético,
// "comprar roupa" fica com compras pela palavra "roupa", e assim por diante.
// Quando mais de um tema aparece, ganha o que somar mais peso (termos longos e específicos pesam mais).

export const SINONIMOS: Partial<Record<IdTema, string[]>> = {
  apostas: [
    'bet', 'bets', 'tigrinho', 'fortune tiger', 'apost*', 'cassino*', 'jogo do bicho',
    'roleta', 'blaze', 'cassino online', 'raspadinha*', 'aviator', 'aviaozinho', 'slot*', 'loteria',
    'mega sena', 'bet365', 'betano', 'esporte da sorte', 'bingo', 'caca niquel', 'poker', 'truco valendo',
  ],
  alcool: [
    '~beber', '~bebo', '~bebendo', '~bebida*', 'cerveja*', 'breja', 'cachaca', 'pinga', 'vinho*', 'porre*',
    'alcool', 'alcoolica', 'drink*', 'vodka', 'whisky', 'uisque', 'gin', 'chopp', 'chope', 'ressaca*',
    'encher a cara', 'beber demais', 'birita',
  ],
  cigarro: [
    'fumar', 'fumo', 'fumando', 'vape', 'vapear', 'pod', 'pods', 'narguile', 'cigarro*',
    'tabaco', 'nicotina', 'palheiro', 'paiero', 'cigarro eletronico', 'juul', 'ignite',
  ],
  celular: [
    'tiktok', 'tik tok', 'instagram', 'insta', 'reels', 'celular', 'rede social', 'redes sociais',
    'youtube', 'shorts', 'scroll*', 'rolar a tela', 'rolar o feed', '~feed', 'twitter', 'kwai',
    '~whatsapp', '~zap', '~telefone', '~tela', 'smartphone', 'notificaca*',
  ],
  pornografia: ['porno', 'pornografia', 'conteudo adulto', 'conteudo 18', 'onlyfans', 'privacy', 'site adulto', 'video adulto', 'putaria'],
  doce: [
    'doce*', 'acucar', 'chocolate*', 'delivery', 'ifood', 'besteira*', 'comer de madrugada', 'beliscar',
    'fast food', 'lanche*', 'refrigerante*', 'salgadinho*', 'comer por ansiedade', '~comer demais',
  ],
  procrastinacao: [
    'procrastin*', 'adiar', 'adiando', 'enrolar', 'enrolando', 'deixar pra depois', 'deixar para depois',
    'empurrar com a barriga', 'nao fazer as coisas', 'nao consigo comecar', '~preguica',
  ],
  sono: ['dormir tarde', 'insonia', 'acordar tarde', '~sono', 'nao durmo', 'dormir mal', 'virar a noite', 'madrugada acordado'],
  ansiedade: ['ansiedade', 'ansioso', 'ansiosa', 'crise de ansiedade', '~nervoso', '~nervosa', 'preocupacao demais', 'panico'],

  // Temas novos, fora da lista principal
  jogos: [
    'videogame', 'video game', '~jogar', '~jogando', '~game*', 'joguinho*', '~console', 'playstation', 'ps5',
    'xbox', 'nintendo', 'free fire', 'fortnite', 'minecraft', 'roblox', 'valorant', 'steam',
  ],
  compras: [
    '~compr*', '~gastar', '~gastando', '~gasto', '~gastos', 'shopee', 'shein', 'mercado livre', 'aliexpress',
    'amazon', 'roupa*', 'cartao de credito', 'parcelar', '~promocao', '~promocoes', 'consumismo', '~shopping',
  ],
  unha: ['roer unha', 'roer as unhas', 'roo unha', 'unha*', 'cuticula*', 'mexer na pele', 'cutucar', 'espinha*', 'arrancar cabelo', '~pele'],
  cafe: ['cafe', 'cafezinho', 'cafeina', 'energetico*', 'red bull', 'monster', 'pre treino', 'expresso'],
  series: ['serie*', 'maratona*', 'maratonar', 'netflix', 'streaming', 'episodio*', 'anime*', 'novela*', 'dorama*', '~filme*', '~tv'],
  substancias: [
    'maconha', 'baseado', 'beck', 'cocaina', 'cheirar', 'crack', 'droga', 'drogas', 'lsd',
    'ecstasy', 'mdma', 'lanca perfume', 'lolo', 'ketamina', 'metanfetamina', 'haxixe', 'skunk',
    'heroina', 'remedio controlado', 'rivotril',
  ],
  alimentacao: [
    'vomitar', 'vomito', 'provocar vomito', 'ficar sem comer', 'nao comer', 'parar de comer', 'jejum demais',
    'compulsao', 'compulsao alimentar', 'comer compulsivo*', 'bulimia', 'anorexia', 'purgar', 'laxante*',
  ],
};
