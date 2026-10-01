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

- **GitHub**: [PEDROK7MKT/VALORA](https://github.com/PEDROK7MKT/VALORA) — branch `main`.
- **Vercel**: projeto `valora-suisse-site`, ligado ao repositório. Todo push em
  `main` builda e publica sozinho, sem passo manual.
- **Domínio**: `valorasuisse.com` (+ `www`, redirecionando para o domínio sem `www`)
  já estão cadastrados no projeto. Falta só o DNS apontar — escolha uma opção no
  registrador onde o domínio foi comprado:

  **Opção A — nameservers da Vercel** (mais simples; é o que os outros domínios
  desta conta já usam): troque os nameservers do domínio para
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```
  A Vercel passa a cuidar do DNS inteiro do domínio (inclusive de registros que
  já existam, como e-mail — migre-os para lá antes de trocar, se houver).

  **Opção B — só os registros do site** (mantém o DNS atual no registrador):
  ```
  A      @     76.76.21.21
  CNAME  www   cname.vercel-dns.com
  ```

  Depois de apontar, a propagação costuma levar de minutos a algumas horas.
  A Vercel emite o certificado HTTPS sozinha assim que o DNS responder certo —
  nenhum passo extra aqui.
