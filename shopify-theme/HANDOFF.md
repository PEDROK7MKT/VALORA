# Passagem — tema Shopify da Valora Suisse

Para o Claude Code continuar a partir daqui. Leia este arquivo inteiro antes de mexer em qualquer coisa.

## Objetivo

A loja Shopify da Valora Suisse tem que ficar **igual ao site `valorasuisse.com`** (raiz deste
repositório: `index.html` + `assets/site.css` + `assets/site.js`), só que funcionando de verdade:
produtos, carrinho e checkout da Shopify. A página inicial já está pronta. Falta o resto da loja ficar
no mesmo visual e a loja estar pronta para publicar.

Cliente: Valora Suisse (joias, Suíça). Dona: Pauliana Santos. Agência: PK7 (Pedro).
Contato da marca: +41 76 440 77 17 · info@valorasuisse.com · @valorasuisse.

## Loja

| Item | Valor |
|---|---|
| Loja | `ktih05-as.myshopify.com` (admin: `admin.shopify.com/store/ktih05-as`) |
| Moeda | CHF |
| Tema **novo** (este trabalho) | **"Valora Suisse — Original"** · ID `189794353533` · **não publicado** (rascunho) |
| Tema publicado hoje | "Horizon - Valora Suisse" · ID `189789634941` · Horizon 4.3.0 (o novo é uma cópia dele) |
| Senha da loja | ativa (página "Opening soon"). O preview do tema novo abre pelo editor → ⋯ → Pré-visualizar |

Coleções (handles usados no Liquid):

| Seção no site | id âncora | Coleção Shopify | Handle | Produtos |
|---|---|---|---|---|
| Bagues / Anéis | `#bagues` | Anéis | `aneis` | 20 (Produto 1–20) |
| Colliers / Colares | `#colliers` | Colares | `colares` | 6 (Produto 29–34) |
| Boucles / Brincos | `#boucles` | Brincos | `brincos` | 8 (Produto 21–28) |
| Bracelets / Pulseiras | `#bracelets` | Pulseiras | `pulseiras` | 1 (Produto 35) |

Os 35 produtos têm foto, nome provisório ("Produto N") e preço CHF 0.00, todos à venda (estoque não rastreado).
Nomes e preços reais ainda vão chegar da cliente. Não invente nomes nem preços.

Vídeos do hero (estão no Shopify Files; o tema lê pelos atributos `data-*` do `<video>`):

- desktop mp4: `https://cdn.shopify.com/s/files/1/0960/9566/6557/files/valora-hero-desktop.mp4?v=1792227709`
- desktop webm: `https://cdn.shopify.com/s/files/1/0960/9566/6557/files/valora-hero-desktop.webm?v=1792227709`
- mobile mp4: `https://cdn.shopify.com/s/files/1/0960/9566/6557/files/valora-hero-mobile.mp4?v=1792227709`

## O que já está pronto (no tema `189794353533`)

Arquivos deste branch (`shopify-theme/`), já enviados ao tema:

- `layout/valora.liquid` — `<head>`, cabeçalho, rodapé (os dois cartões + "Conçu par PK7"),
  menu do celular e carrinho (`<dialog>`), tudo copiado do `index.html`.
- `sections/valora-home.liquid` — o `<main>` do `index.html`: hero com vídeo, fita de cetim, selos,
  A Maison, índice da coleção, as 4 grades de produto (Liquid, puxando as coleções acima), sob medida,
  o estojo (mosaico), certificado, contato.
- `snippets/valora-product-card.liquid` — card de produto (foto, nome com link, SKU se houver,
  preço em `data-cents`, botão `.add` com `data-variant`).
- `assets/valora-site.css.liquid` — é o `assets/site.css` do site, com `url('fonts/...')` → `url('...')`
  (os assets do tema não têm subpastas) e um bloco no fim para o link dentro do card.
- `assets/valora.js` — é o `assets/site.js` do site com as mudanças abaixo.
- `templates/index.json` — `{"layout": "valora", ...}` com a seção `valora-home`.

Também já estão no tema (enviados direto dos `assets/` deste repo): as 3 fontes `.woff2`, `favicon.svg`,
`hero-poster.jpg`, `hero-mobile-poster.jpg` e as 10 `brand-*.jpg`.

Mudanças do `valora.js` em relação ao `site.js`:

- Saiu o catálogo fictício `P` e a montagem dos cards por JS: os cards agora vêm do Liquid.
- O carrinho usa a **Ajax API da Shopify** (`/cart.js`, `/cart/add.js`, `/cart/change.js`), com as
  linhas indexadas por `key`. "Finalizar compra" vai para `/checkout`, que é o checkout real.
- Saíram o `<dialog id="checkout">` de demonstração e todo o código dele.
- Os vídeos vêm de `video.dataset.desktopMp4/desktopWebm/mobileMp4`.
- Os preços com `[data-cents]` são formatados pelo mesmo `CHF()` do carrinho.
- Entraram as chaves i18n `cr1`/`crN` (criação/criações) nos 4 idiomas, para as contagens das coleções.
- O resto ficou igual ao `site.js`: idiomas FR/PT/EN/ES (por `?lang=`, `localStorage` `valora:lang`
  ou idioma do aparelho), fita SVG animada, pausa de movimento, menu e acessibilidade.

Conferido no preview: o visual da home bate com o `valorasuisse.com` seção por seção. Adicionar,
mudar a quantidade e remover do carrinho funcionam.

## Armadilhas que já custaram tempo

1. `stylesheet_tag` precisa de `asset_url` antes: `{{ 'valora-site.css' | asset_url | stylesheet_tag }}`.
   Sem ele, o link sai como `href="valora-site.css"` e a página fica sem estilo.
2. O CSS está como `.css.liquid` de propósito: assim a Shopify serve como `text/css`. O
   `assets/valora.css` antigo ainda existe no tema, **órfão** (a API não deixou apagar). Apague com a CLI.
3. **Cuidado com `shopify theme push`.** Esta pasta NÃO é um tema completo: só tem os arquivos Valora.
   O resto é o Horizon que está no tema remoto. Um `push` desta pasta sem `--nodelete` apagaria o
   Horizon inteiro do tema. Antes de qualquer coisa, faça o passo 1 abaixo.
4. O `valora.js` muda `document.title` e a meta description com as chaves `doc_title`/`doc_desc`
   quando aplica o idioma. Isso está certo na home, mas vai sobrescrever o título nas páginas de
   produto e coleção. Ajuste antes de fazer essas páginas: só mexer no título quando o template for `index`.
5. Na home, o cabeçalho e o menu usam âncoras (`#bagues`, `#maison`...). Em qualquer outra página
   essas âncoras não existem. Fora da home, os links precisam virar `{{ routes.root_url }}#bagues` etc.,
   e o logo (`href="#top"`) tem que voltar para `/`.

## Como trabalhar (Shopify CLI)

1. Baixe o tema completo para esta pasta, sem perder os arquivos daqui:
   `shopify theme pull --store ktih05-as --theme 189794353533 --path shopify-theme`
   Depois confira com `git diff`: os arquivos Valora devem continuar iguais. Faça commit do tema completo.
2. Preview ao vivo: `shopify theme dev --store ktih05-as --theme 189794353533 --path shopify-theme`
3. Enviar: `shopify theme push --store ktih05-as --theme 189794353533 --path shopify-theme`
   Com o tema completo na pasta não precisa de `--nodelete`. Na dúvida, use `--nodelete`.
4. **Nunca** faça push para o tema `189789634941` (o publicado). **Nunca** publique tema sem o Pedro mandar.
5. **Não mexa no branch `main`.** Ele é o site no ar na Vercel. Trabalhe só no branch `shopify-theme`.

## Andamento (17/10)

Feito e enviado ao tema `189794353533` (conferido por MD5: o que está no tema é igual a este branch):

- Layout fora da home: links e logo voltam para `/` + âncora; título, descrição e og:image por página;
  o `valora.js` só troca o título na home e não quebra mais fora dela; rodapé com as políticas da loja.
- Produto (`sections/valora-product.liquid`), coleção (`valora-collection`), página (`valora-page`),
  404 (`valora-404`), busca (`valora-search`) e carrinho (`valora-cart`), todos com `"layout": "valora"`.
  CSS dessas páginas em `assets/valora-pages.css.liquid` (o `valora-site.css` continua igual ao do site).
- Ordem manual das coleções pelo número do produto (Anéis e Brincos reordenados).

Como foi enviado: a rede do ambiente do Claude Code bloqueava `*.myshopify.com`, `accounts.shopify.com`
e `cdn.shopify.com`, então o CLI não rodou. Os arquivos foram enviados pela Admin API
(`themeFilesUpsert` com `body.type = URL` apontando para o raw do GitHub no commit exato).
`themeFilesDelete` é bloqueado nesse caminho: o `assets/valora.css` órfão continua no tema.
Na listagem da API, `assets/valora-site.css` e `assets/valora-pages.css` aparecem ao lado dos `.css.liquid`:
são a saída compilada deles, não arquivos órfãos.

Os templates do Horizon que foram substituídos (product, collection, page, 404, search, cart) continuam
no tema publicado `189789634941`, se for preciso voltar algum.

## O que falta (em ordem)

1. **Limpeza:** apagar `assets/valora.css` (órfão) do tema.
2. **Layout fora da home:** links do cabeçalho, do menu do celular e do logo apontando para
   `/` + âncora quando `template.name != 'index'`. Título e descrição por página (`page_title`,
   `page_description`), com o JS mudando o título só na home.
3. **Página de produto** (`templates/product.json` com `"layout": "valora"` + `sections/valora-product.liquid`),
   no visual do site:
   - galeria de imagens (todas as `product.media`);
   - nome em Cormorant;
   - preço;
   - seletor de variante, se houver mais de uma;
   - botão `.add` que usa o mesmo carrinho (o JS já trata qualquer `.add[data-variant]`);
   - descrição;
   - selos (certificado, entrega assegurada, pagamento seguro);
   - link "voltar para a coleção";
   - textos em i18n: crie as chaves no `valora.js` nos 4 idiomas.
4. **Página de coleção** (`templates/collection.json`, layout `valora`): cabeçalho `.psec-h` e a grade
   `.grid5` com o snippet `valora-product-card`, com paginação.
5. **Demais templates** no layout `valora`, com uma seção simples no estilo do site:
   - `page` (título + `page.content` com tipografia da marca);
   - `404`;
   - `search` (opcional);
   - `cart`: pode redirecionar para `/` e abrir o carrinho, ou ter uma seção que liste o carrinho.
   Políticas e conta de cliente podem ficar no Horizon.
6. **Ordem dos produtos:** hoje as grades saem Produto 1, 13, 2, 14… Deixe as coleções em ordem manual
   pelo número do produto: Admin → Coleções → Ordenar: Manual, ou a mutation `collectionReorderProducts`.
7. **Mobile:** conferir em 390 px e 768 px (vídeo vertical abaixo de 768 px, grades com rolagem
   horizontal, menu, carrinho). O CSS é o do site, então deve bater, mas confira as páginas novas.
8. **Conferência final** lado a lado com `valorasuisse.com`. Teste adicionar ao carrinho e chegar até
   a tela do checkout da Shopify, sem pagar nada.
9. Avisar o Pedro de que o tema está pronto para publicar. A publicação é ele quem faz (editor do tema → Publicar).

## Fora do escopo do código (fica com Pedro/Pauliana)

- Nomes e preços reais dos 35 produtos.
- PayPal: falta a Pauliana clicar em "Concluir configuração".
- Frete.
- Domínio: hoje `valorasuisse.com` aponta para a Vercel. Plano no README da raiz: a loja vai para o
  domínio raiz via Shopify e o convite `/lancamento` vai para um subdomínio na Vercel.
- Tirar a senha da loja no lançamento.
