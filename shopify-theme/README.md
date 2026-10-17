# Tema Shopify — Valora Suisse

Porte fiel do site `valorasuisse.com` (raiz deste repositório) para a Shopify.

- `layout/valora.liquid` — cabeçalho, rodapé (cartões), menu do celular e carrinho, iguais ao site.
- `sections/valora-home.liquid` — página inicial: vídeo no hero, fita de cetim, A Maison, coleção,
  grades de produto (puxam as coleções `aneis`, `colares`, `brincos`, `pulseiras` da Shopify),
  sob medida, o estojo, certificado e contato.
- `snippets/valora-product-card.liquid` — card de produto (foto, nome, preço, botão).
- `assets/valora-site.css.liquid` / `assets/valora.js` — `site.css` / `site.js` do site, com o carrinho
  trocado pela Ajax API da Shopify (carrinho e checkout reais) e os vídeos vindos do Shopify Files.
- `templates/index.json` — usa o layout `valora` na página inicial.

Imagens, fontes e pôsteres foram enviados direto para o tema a partir de `assets/` deste repositório.
