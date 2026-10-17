# Valora Suisse

Um domínio, duas páginas:

| Endereço | Conteúdo |
|---|---|
| `valorasuisse.com` | Site da marca com as 35 peças da coleção (pedido pelo WhatsApp, sem preço por enquanto): vídeo no hero, coleção, A Maison, certificado e contato. Fica na raiz (`index.html` + `assets/`). |
| `valorasuisse.com/pecas/sh-xxx/` | Uma página por peça, com a foto nas tags `og:*` (o link mandado no WhatsApp chega com a foto). Geradas por `tools/gera-pecas.py`. |
| `valorasuisse.com/lancamento` | Convite de pré-lançamento da nova coleção (moissanite e zircônia), em FR · PT · EN · ES, com contagem e lista de espera. Ver [`lancamento/README.md`](lancamento/README.md). |

Tudo é HTML/CSS/JS estático, sem build.

## Site (raiz)

Página única, em francês por padrão, com troca de idioma (FR · PT · EN · ES — a escolha fica
guardada no aparelho; `?lang=pt` força um idioma). **Site provisório até a loja Shopify entrar
no domínio** (com preço e checkout):

- as 35 peças são as mesmas da loja Shopify, com a referência provisória (SH-xxx) de
  `catalogo/referencias.csv`. O nome na tela é a categoria no idioma escolhido + a referência
  ("Bague SH-387", "Anel SH-387"…);
- sem preço: cada peça mostra "Prix sur demande" e o botão **Commander**, que abre o WhatsApp da
  marca (+41 76 440 77 17) com a mensagem pronta (nome da peça como a marca usa + link da página
  dela em `pecas/sh-xxx/`, cuja prévia traz a foto);
- o carrinho/checkout de demonstração continua no código, mas o botão do cabeçalho está oculto
  (`hidden` no `#openCart`) e nenhuma peça vai para o carrinho;
- a página leva `noindex` (meta + cabeçalho `X-Robots-Tag`), e as páginas das peças também: o site
  é provisório. Quando a loja for de verdade, tire o `<meta name="robots">` e a regra
  `"source": "/"` do `vercel.json`.

Trocar ou acrescentar peças: fotos em `assets/products/sh-xxx-{480,800}.{jpg,webp}` e
`sh-xxx-1200.jpg` (prévia do WhatsApp), item em `P` no `assets/site.js` e em
`catalogo/pecas.json`, depois `python3 tools/gera-pecas.py` para refazer as páginas `pecas/`.

Arquivos:

- `index.html` — só a estrutura. Nenhum estilo, script ou `onclick` embutido (a CSP bloqueia).
- `assets/site.css` — estilos; tokens da marca (cores, fontes, espaçamentos) no topo.
- `assets/site.js` — textos dos 4 idiomas (`I18N`), catálogo (`P`), menu, vídeo e o carrinho de
  demonstração (desligado).
- `assets/piece.js` — idioma e link do WhatsApp das páginas `pecas/` (textos copiados do site.js).
- `catalogo/` — `referencias.csv` (peça antes "Produto N" → referência, foto do Drive) e
  `pecas.json` (fonte das páginas `pecas/`).
- `assets/fonts/` — Cormorant Garamond e Montserrat hospedadas no próprio site (sem Google Fonts).

Acessibilidade: navegação por teclado com "pular para o conteúdo", menu/carrinho/checkout em
`<dialog>` (Esc fecha, o foco volta para quem abriu), contraste AA, botão para pausar o vídeo e a
fita animada, e nada se mexe para quem pede movimento reduzido no sistema. O vídeo do hero troca
sozinho para a versão vertical (`assets/hero-mobile.mp4`) abaixo de 768 px, pausa fora da tela e
não carrega com economia de dados ligada.

## Segurança

Os cabeçalhos ficam no `vercel.json` e valem para o domínio todo:

| Cabeçalho | Para quê |
|---|---|
| `Content-Security-Policy` | Só roda script, estilo, fonte e mídia do próprio domínio. A única saída permitida é o webhook da lista (`pk7mkt.app.n8n.cloud`). Os `<script>`/`<style>` escritos dentro do HTML do convite entram por hash `sha256`. |
| `X-Frame-Options: DENY` + `frame-ancestors 'none'` | Ninguém consegue embutir o site num iframe (clickjacking). |
| `X-Content-Type-Options: nosniff` | O navegador não "adivinha" tipo de arquivo. |
| `Referrer-Policy: strict-origin-when-cross-origin` | Links para fora não levam o caminho completo. |
| `Permissions-Policy` | Câmera, microfone, localização, pagamento etc. desligados. (`web-share` fica liberado: o convite usa o botão de compartilhar.) |
| `Cross-Origin-Opener-Policy: same-origin` | Isola a aba de janelas abertas por outros sites. |

**Editou um `<script>` ou `<style>` embutido no HTML** (hoje só existem em `lancamento/`)? O
hash muda e o navegador bloqueia o bloco. Rode `python3 tools/csp-hashes.py` para conferir e
`python3 tools/csp-hashes.py --write` para atualizar o `vercel.json`. Textos fora desses blocos
podem ser editados à vontade.

Ficou de fora de propósito: HSTS com `includeSubDomains`/`preload`, porque o e-mail da marca
roda em subdomínios da Infomaniak e não deve ser forçado para HTTPS por tabela. A Vercel já envia
HSTS só para o domínio principal.

## Rodar localmente

```bash
python3 -m http.server 4173
# http://localhost:4173/             → site
# http://localhost:4173/lancamento/  → convite
```

O servidor local não aplica os cabeçalhos do `vercel.json`; a CSP só vale no ar (ou num
`vercel dev`).

## Sobre a troca futura pela Shopify

Quando a loja entrar no ar, o plano é subir o tema dentro da Shopify, no lugar deste site de
demonstração. Um detalhe técnico importante: a Shopify serve o domínio raiz por conta própria —
ela não tem como servir só uma parte do caminho (tipo `/lancamento`) enquanto outra ferramenta
serve o resto no **mesmo** host. Então, nesse momento, há duas opções:

1. **Subdomínio** (recomendado): a loja fica no domínio raiz (`valorasuisse.com`) via Shopify, e o
   convite (pasta `lancamento/`) passa a viver num subdomínio à parte, por exemplo
   `lancamento.valorasuisse.com`, continuando nesta mesma hospedagem (Vercel). É só apontar um
   registro CNAME a mais — não depende da Shopify e não precisa de app nem de script.
2. **Shopify App Proxy**: recriar o caminho `/lancamento` *dentro* da Shopify via um app proxy, o
   que exige montar um app Shopify só para isso — mais trabalho para manter um caminho que, nessa
   altura, já deve ter cumprido seu papel.

## Publicar

- **GitHub**: [PEDROK7MKT/VALORA](https://github.com/PEDROK7MKT/VALORA) — branch `main`.
- **Vercel**: projeto `valora-suisse-site`, ligado ao repositório. Todo push em `main` builda e
  publica sozinho, sem passo manual.
- **Domínio**: `valorasuisse.com` (+ `www`, redirecionando para o domínio sem `www`).
- **`vercel.json`**: `trailingSlash: true` — quem abre `/lancamento` vai para `/lancamento/`. O
  convite usa caminhos relativos à própria pasta, que só resolvem certo com a barra no fim.
  Arquivos com extensão (imagens, vídeos, `.html`) não são afetados. Também traz os cabeçalhos
  de segurança (ver acima).
- **`.vercelignore`**: READMEs, o plano do convite, as fotos originais e `tools/` não vão para o ar.

## Estrutura

```
├── index.html       site (só HTML)
├── assets/
│   ├── site.css     estilos do site
│   ├── site.js      idiomas, catálogo, carrinho, checkout, menu, vídeo
│   ├── fonts/       Cormorant Garamond + Montserrat (subset latin)
│   ├── products/    fotos dos produtos (WebP + JPG, 480 e 800 px)
│   ├── hero-*       vídeos e pôsteres do hero
│   └── brand-*.jpg  imagens do manual de marca
├── lancamento/      convite de pré-lançamento (ver lancamento/README.md)
├── tools/           csp-hashes.py (confere os hashes da CSP)
├── vercel.json      trailingSlash + cabeçalhos de segurança
└── .vercelignore    o que não vai para o ar
```
