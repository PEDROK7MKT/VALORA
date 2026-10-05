# Valora Suisse · Convite de lançamento

Página de pré-lançamento da nova coleção (zircônia e moissanite), feita para o
tráfego do Instagram: mobile primeiro, leve e sem dependências. Fica em
`valorasuisse.com/lancamento/`; a raiz do domínio é o site da marca (ver o
[README da raiz](../README.md)).

- **HTML + CSS + JS puro**, sem etapa de build. Módulos ES nativos. Sem bibliotecas externas.
- Primeira tela (envelope com o lacre, fontes, foto do hero, CSS e JS, com gzip): **~270 KB** em
  tela 2x e ~300 KB em 3x. A página inteira, com todas as fotos em AVIF: ~550 KB (o navegador
  adianta as fotos de baixo por conta própria em conexões rápidas). Quem entra por `#lista` não
  baixa o lacre.
- Fontes (Cormorant Garamond e Montserrat) hospedadas na própria página.
- Todos os caminhos são relativos à própria pasta, então ela funciona em qualquer endereço
  (subpasta ou, no futuro, um subdomínio) — desde que a URL termine em `/`. É por isso que o
  `vercel.json` da raiz tem `trailingSlash: true`.
- Roda sob a Content-Security-Policy do `vercel.json` da raiz. Os `<script>` embutidos no
  `index.html` e o `<style>`/`<script>` do `privacidade.html` estão liberados por hash: **se
  editar um desses blocos, rode `python3 tools/csp-hashes.py --write` na raiz** (senão o bloco
  para de rodar no ar). Textos, `css/style.css` e os `.js` podem mudar à vontade. Se trocar o
  backend da lista por outro domínio, inclua o novo endereço em `connect-src` no `vercel.json`.

## Rodar localmente

```bash
python3 -m http.server 4173      # na raiz do repositório
# abra http://localhost:4173/lancamento/
```

Parâmetros úteis na URL:

| Parâmetro | Efeito |
|---|---|
| `?intro=1` ou `#abertura` | força a abertura completa (mesmo para quem já viu) |
| `?intro=0` | pula a abertura |
| `#lista` | pula a abertura e vai direto ao formulário (use nos stories "entre na lista") |
| botão "voltar" | quem volta de outra página (ex.: política de privacidade) não vê a abertura de novo |
| `?slow=5` | deixa as animações 5× mais lentas, para conferir a coreografia |

A abertura completa aparece na 1ª visita; quem volta em até 7 dias vê uma versão curta automática.

## Antes de publicar: o que a marca precisa confirmar

Tudo que é editável está em **`js/config.js`** (itens marcados com `⚠ CONFIRMAR`):

1. **Data e hora da abertura** (`launchISO`, sempre com `-03:00`). Se mudar, atualize também
   o texto do `index.html` (`<title>`, `og:*`, `<time>`) e o arquivo `assets/lancamento.ics`.
2. **Qual pedra está em cada foto** (`stones.*.pieceConfirmed`). Enquanto for `false`, a legenda
   do seletor diz só "Imagem ilustrativa." (a página não afirma nada sobre a composição da peça).
3. **WhatsApp da marca** (`whatsappBrand`) — habilita o botão "Confirmar pelo WhatsApp".
4. **Backend da lista** (`waitlistEndpoint`) — já configurado (webhook n8n → Supabase); ver seção abaixo.
5. **Instagram** e **link da loja** para depois da abertura.
6. **Texto de consentimento** (`consent` no config) e **política de privacidade**
   (`privacidade.html`) — preencher razão social, CNPJ, contato, fornecedores e prazo de guarda
   (trechos destacados entre colchetes) e confirmar que "responder SAIR" / "link no fim do e-mail"
   existem de fato. Mudou o texto? Mude também `consentVersion`.
7. **Tradução da tagline**: no rodapé está "O que tem valor permanece." (sem a vírgula do brief,
   que separava sujeito e verbo). Se a marca preferir o texto original, troque em `index.html`.
8. **Logo oficial em SVG** — o lockup atual é tipográfico (Cormorant + Montserrat) e não reproduz
   a cauda do "R" do logo gravado nos estojos. Com o SVG, basta trocar os três `.brand` do HTML.

## Lista de espera · backend em produção

`js/main.js → submitLead()` envia um `POST` `application/x-www-form-urlencoded` (sem preflight
de CORS) com: `channel`, `contact` (E.164 ou e-mail), `name`, `stone`, `consent`, `consent_text`,
`consent_version`, `page`, `referrer`, `created_at` e `utm_*`. `CONFIG.waitlistEndpoint` aponta
para um workflow n8n, que valida o envio e grava cada linha na tabela `leads` do projeto Supabase
"valora-suisse" (RLS: a chave pública só pode inserir, nunca ler).

- **Ver as inscrições**: supabase.com/dashboard → projeto `valora-suisse` → Table Editor → `leads`.
- **Editar o fluxo** (ex.: notificar a marca por e-mail a cada novo cadastro, exportar para
  Google Sheets etc.): pk7mkt.app.n8n.cloud → workflow "Valora Suisse — Lista de espera
  (lançamento)".
- **Trocar de backend**: qualquer webhook que aceite esse POST serve — basta colar a nova URL em
  `waitlistEndpoint` **e liberar o domínio dela em `connect-src` no `vercel.json`** (a CSP bloqueia
  qualquer outro destino). Em n8n, lembre de manter *Options → Allowed Origins (CORS)* como `*`.

A confirmação só aparece com resposta 2xx. Se falhar, o cadastro fica guardado no aparelho e é
reenviado na próxima visita, e a pessoa vê a opção de entrar pelo WhatsApp.

**Sobre o envio por WhatsApp**: listas de transmissão do app WhatsApp Business só chegam a quem
salvou o número da marca. Para avisar a lista inteira no dia, use a API oficial (WhatsApp Business
Platform) com um modelo de mensagem aprovado, ou peça para as pessoas tocarem em "Confirmar pelo
WhatsApp" (isso abre a conversa e permite salvar o contato).

## Medição (opcional)

Eventos vão para `window.dataLayer` (Google Tag Manager) e, se `analyticsEndpoint` estiver
preenchido, por `sendBeacon`: `intro_view`, `intro_open {mode, ms}`, `stone_select {pedra, via}`,
`cta_click {origem}`, `lead_submit {canal, pedra}`, `lead_error`, `share`.

Links sugeridos (sempre com `/lancamento/` — a raiz do domínio é o site, não o convite):

- bio: `https://valorasuisse.com/lancamento/?utm_source=instagram&utm_medium=bio`
- stories: `https://valorasuisse.com/lancamento/?utm_source=instagram&utm_medium=story&utm_content=AAAAMMDD#lista`

## Estrutura

```
lancamento/
├── index.html            página
├── privacidade.html      política de privacidade (preencher)
├── css/style.css         estilos (tokens da marca no topo)
├── js/config.js          ⚠ tudo que a marca edita
├── js/main.js            abertura, contagem, seletor de pedra, lista
├── PLANO.md              plano original da página (não vai para o ar)
└── assets/
    ├── produto-1..3.jpg  fotos originais (não vão para o ar)
    ├── img/              fotos otimizadas (AVIF/WebP/JPG, fundo Marfim)
    ├── lacre*.webp       lacre renderizado (inteiro e as duas metades)
    ├── papel-*.webp      textura do envelope
    ├── fonts/            Cormorant Garamond + Montserrat (subset latin)
    ├── og-image.jpg      prévia de link 1200×630
    └── lancamento.ics    evento de agenda
```
