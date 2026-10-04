# Valora Suisse

Um domínio, duas páginas:

| Endereço | Conteúdo |
|---|---|
| `valorasuisse.com` | Site da marca, versão de demonstração: vídeo no hero, coleção, A Maison, certificado e contato. Fica na raiz (`index.html` + `assets/`). |
| `valorasuisse.com/lancamento` | Convite de pré-lançamento da nova coleção (zircônia e moissanite), com contagem e lista de espera. Ver [`lancamento/README.md`](lancamento/README.md). |

Tudo é HTML/CSS/JS estático, sem build.

## Site (raiz)

Página única, em francês por padrão, com troca de idioma (FR · PT · EN · ES). Ainda é
demonstração:

- os 20 produtos são fictícios e estão sem foto (aguardando as fotos das peças);
- carrinho e checkout são só visuais: nada é cobrado, guardado ou enviado. O botão
  "Confirmer la commande" apenas mostra a tela de pedido confirmado.

O vídeo do hero troca sozinho para a versão vertical (`assets/hero-mobile.mp4`) em telas com
menos de 768 px.

## Rodar localmente

```bash
python3 -m http.server 4173
# http://localhost:4173/             → site
# http://localhost:4173/lancamento/  → convite
```

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
  Arquivos com extensão (imagens, vídeos, `.html`) não são afetados.

## Estrutura

```
├── index.html     site
├── assets/        vídeos do hero e imagens do manual de marca
├── lancamento/    convite de pré-lançamento (ver lancamento/README.md)
└── vercel.json    trailingSlash: true
```
