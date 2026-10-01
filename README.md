# Valora Suisse

Site da Valora Suisse, pensado para um único domínio com duas partes:

| Caminho | Conteúdo |
|---|---|
| `/` | Placeholder "em construção" — até a loja (Shopify) estar pronta. |
| `/lancamento` | Loading page de pré-lançamento da nova coleção (zircônia e moissanite). Ver [`lancamento/README.md`](lancamento/README.md) e [`lancamento/PLANO.md`](lancamento/PLANO.md). |

Tudo é HTML/CSS/JS estático, sem build — qualquer hospedagem de arquivos estáticos
serve (Vercel, Netlify, GitHub Pages).

## Sobre a troca futura pela Shopify

Quando a loja entrar no ar, o plano é subir o tema dentro da Shopify. Um detalhe
técnico importante: a Shopify serve o domínio raiz por conta própria — ela não tem
como servir só uma parte do caminho (tipo `/lancamento`) enquanto outra ferramenta
serve o resto no **mesmo** host. Então, nesse momento, há duas opções:

1. **Subdomínio** (recomendado): a loja fica no domínio raiz
   (`valorasuisse.com`) via Shopify, e esta página de lançamento passa a viver num
   subdomínio à parte, por exemplo `lancamento.valorasuisse.com`, continuando
   nesta mesma hospedagem (Vercel). É só apontar um registro CNAME a mais — não
   depende da Shopify e não precisa de app nem de script.
2. **Shopify App Proxy**: recriar o caminho `/lancamento` *dentro* da Shopify via
   um app proxy, o que exige montar um app Shopify só para isso — mais trabalho
   para manter um caminho que, nessa altura, já deve ter cumprido seu papel.

Por ora, com a loja ainda não publicada, as duas páginas convivem sem problema no
mesmo domínio, como pedido.

## Rodar localmente

```bash
npx http-server . -p 4173 -c-1
# http://localhost:4173/            → em construção
# http://localhost:4173/lancamento/ → página de lançamento
```

## Publicar

Projeto na Vercel: **valora-suisse**. Deploy automático a cada push na branch
`main`. Para apontar o domínio da marca, adicione-o em
Vercel → Project → Settings → Domains e configure o DNS conforme as instruções
que a Vercel mostrar (CNAME para `cname.vercel-dns.com`, ou os nameservers da
Vercel, se preferir que ela cuide de tudo).
