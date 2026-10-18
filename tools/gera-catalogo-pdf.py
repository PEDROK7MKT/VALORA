#!/usr/bin/env python3
"""Monta o HTML do catálogo de referências (guia + 35 peças) para virar PDF.

Uso:  python3 tools/gera-catalogo-pdf.py <pasta-de-saída>
Gera <pasta>/catalogo.html e, em seguida, o PDF com o Chromium:
    NODE_PATH=$(npm root -g) node tools/catalogo-pdf.js <pasta>/catalogo.html <arquivo.pdf>
Fotos e fontes são lidas do próprio repositório (assets/).
"""
import csv
import html
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'valorasuisse.com'
e = html.escape

CAT = {  # categoria na Shopify → rótulo do catálogo
    'Anéis': 'Anel',
    'Colares': 'Colar',
    'Brincos': 'Brincos',
    'Pulseiras': 'Pulseira',
}


def main(out):
    rows = list(csv.DictReader(open(os.path.join(ROOT, 'catalogo/referencias.csv'), encoding='utf-8')))
    rows.sort(key=lambda r: int(r['referencia'].split('-')[1]))
    total = {c: sum(1 for r in rows if r['categoria'] == c) for c in CAT}
    a = lambda p: 'file://' + os.path.join(ROOT, p)

    cards = []
    for r in rows:
        ref = r['referencia']
        slug = ref.lower()
        # colares: o mesmo recorte no pingente usado no site
        foto = f'assets/products/{slug}-c-480.jpg' if os.path.exists(os.path.join(ROOT, f'assets/products/{slug}-c-480.jpg')) else f'assets/products/{slug}-480.jpg'
        cards.append(f'''
      <article class="card">
        <a class="ph" href="https://{SITE}/pecas/{slug}/"><img src="{a(foto)}" alt=""></a>
        <div class="meta">
          <p class="cat">{e(CAT[r['categoria']])}</p>
          <p class="ref">{e(r['nome_na_loja'])}</p>
          <a class="url" href="https://{SITE}/pecas/{slug}/">{SITE}/pecas/{slug}</a>
          <p class="drive">Drive: {e(r['foto_no_drive'])}</p>
        </div>
      </article>''')

    pages = [cards[i:i + 12] for i in range(0, len(cards), 12)]
    catalog_pages = ''.join(f'''
  <section class="page catalog">
    <header class="ph-head"><span>Catálogo de referências</span><span>{i + 1}/{len(pages)} · em ordem de número</span></header>
    <div class="grid">{''.join(p)}</div>
  </section>''' for i, p in enumerate(pages))

    doc = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Valora Suisse — Catálogo de referências</title>
<style>
@font-face {{ font-family: 'Cormorant Garamond'; font-weight: 300 700; src: url('{a('assets/fonts/cormorant-garamond-latin.woff2')}') format('woff2'); }}
@font-face {{ font-family: 'Cormorant Garamond'; font-style: italic; font-weight: 300 700; src: url('{a('assets/fonts/cormorant-garamond-italic-latin.woff2')}') format('woff2'); }}
@font-face {{ font-family: 'Montserrat'; font-weight: 100 900; src: url('{a('assets/fonts/montserrat-latin.woff2')}') format('woff2'); }}
@page {{ size: A4; margin: 0; }}
:root {{ --verde: #032D1F; --musgo: #384937; --ouro: #CFA35C; --ouro-txt: #7A5C26; --marfim: #F6EEE1; --papel: #EDE4D3; --suave: #5F635C; --linha: rgba(56,73,55,.2); }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
body {{ font-family: 'Montserrat', sans-serif; font-size: 9.2pt; line-height: 1.55; color: #201F1D; background: var(--marfim); }}
a {{ color: inherit; text-decoration: none; }}
.page {{ width: 210mm; height: 297mm; padding: 16mm 15mm 14mm; page-break-after: always; break-after: page; position: relative; overflow: hidden; background: var(--marfim); }}
.page:last-child {{ page-break-after: auto; break-after: auto; }}
.serif {{ font-family: 'Cormorant Garamond', serif; }}
h1, h2, h3 {{ font-family: 'Cormorant Garamond', serif; font-weight: 500; color: var(--verde); line-height: 1.1; }}
.eye {{ font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--ouro-txt); font-size: 13pt; }}

/* capa / guia */
.cover {{ background: var(--verde); color: var(--marfim); padding: 15mm 16mm 13mm; }}
.brand {{ text-align: center; }}
.brand .n {{ font-family: 'Cormorant Garamond', serif; font-size: 30pt; letter-spacing: .32em; padding-left: .32em; color: var(--ouro); }}
.brand .s {{ font-size: 7pt; letter-spacing: .5em; padding-left: .5em; color: var(--marfim); opacity: .8; }}
.cover h1 {{ color: var(--marfim); font-size: 29pt; text-align: center; margin-top: 10mm; }}
.cover .lead {{ text-align: center; max-width: 140mm; margin: 4mm auto 0; color: rgba(246,238,225,.85); font-size: 10pt; }}
.box {{ background: var(--marfim); color: #201F1D; border-radius: 3px; padding: 7mm 8mm; margin-top: 9mm; }}
.box h2 {{ font-size: 17pt; margin-bottom: 3mm; }}
.msg {{ margin: 3mm 0 3.5mm; padding: 4mm 5mm; background: #DCF8C6; border-radius: 6px 6px 6px 1px; font-size: 9.5pt; color: #111; max-width: 125mm; box-shadow: 0 1px 1px rgba(0,0,0,.12); }}
.msg b {{ font-weight: 600; }}
.msg .lk {{ color: #0B6E99; }}
ol.steps {{ list-style: none; counter-reset: s; display: grid; gap: 2.4mm; margin-top: 2mm; }}
ol.steps li {{ counter-increment: s; display: grid; grid-template-columns: 7mm 1fr; align-items: start; }}
ol.steps li::before {{ content: counter(s); width: 5.5mm; height: 5.5mm; border-radius: 50%; background: var(--verde); color: var(--ouro); font-size: 7.5pt; font-weight: 600; display: grid; place-items: center; margin-top: .3mm; }}
.note {{ font-size: 8.4pt; color: var(--suave); margin-top: 2.5mm; }}
.hl {{ color: var(--verde); font-weight: 600; }}

/* página 2 */
.guide h2 {{ font-size: 19pt; margin-bottom: 1mm; }}
.guide .sub {{ color: var(--suave); margin-bottom: 4mm; }}
.reps {{ display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }}
.rep {{ background: #fff; border: 1px solid var(--linha); border-radius: 3px; padding: 4mm 4.5mm; }}
.rep .lg {{ font-size: 7pt; font-weight: 600; letter-spacing: .14em; color: var(--ouro-txt); text-transform: uppercase; margin-bottom: 1.5mm; }}
.rep p {{ font-size: 8.8pt; }}
.sec2 {{ margin-top: 8mm; }}
.links {{ display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-top: 3mm; }}
.lkbox {{ background: var(--papel); border-radius: 3px; padding: 4mm 4.5mm; }}
.lkbox .big {{ font-family: 'Cormorant Garamond', serif; font-size: 15pt; color: var(--verde); }}
.tips {{ margin-top: 4mm; display: grid; gap: 1.8mm; padding-left: 4mm; }}
.foot {{ position: absolute; left: 15mm; right: 15mm; bottom: 9mm; display: flex; justify-content: space-between; font-size: 7pt; color: var(--suave); border-top: 1px solid var(--linha); padding-top: 2.5mm; }}

/* catálogo */
.ph-head {{ display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--linha); padding-bottom: 2.5mm; margin-bottom: 5mm; font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase; color: var(--verde); }}
.ph-head span:first-child {{ font-family: 'Cormorant Garamond', serif; font-size: 14pt; letter-spacing: 0; text-transform: none; }}
.grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 5mm 4.5mm; }}
.card {{ break-inside: avoid; }}
.card .ph {{ display: block; aspect-ratio: 4 / 5; overflow: hidden; background: #EFE6D6; border-radius: 2px; }}
.card img {{ width: 100%; height: 100%; object-fit: cover; display: block; }}
.card .meta {{ padding-top: 2mm; }}
.card .ref {{ font-family: 'Cormorant Garamond', serif; font-size: 15.5pt; font-weight: 600; color: var(--verde); line-height: 1.05; margin-top: .6mm; }}
.card .cat {{ font-size: 6.6pt; letter-spacing: .14em; text-transform: uppercase; color: var(--ouro-txt); font-weight: 600; }}
.card .url {{ display: block; font-size: 6.6pt; color: #0B6E99; margin-top: .8mm; }}
.card .drive {{ font-size: 6pt; color: var(--suave); }}
</style>
</head>
<body>

  <section class="page cover">
    <div class="brand"><div class="n">VALORA</div><div class="s">SUISSE</div></div>
    <h1>Pedidos pelo WhatsApp</h1>
    <p class="lead">Guia rápido e catálogo de referências das 35 peças da coleção, para identificar cada pedido que chegar pelo site <b>{SITE}</b>.</p>

    <div class="box">
      <h2>Como chega um pedido</h2>
      <p>No site, cada peça tem o botão <span class="hl">Commander</span> (em português, <span class="hl">Encomendar</span>). O cliente toca nele e o WhatsApp abre com uma mensagem pronta, enviada para o <b>+41 76 440 77 17</b>. Ela chega assim:</p>
      <div class="msg">Bonjour Valora Suisse ! J'aimerais commander cette pièce : <b>Anel SH-387</b><br><span class="lk">https://{SITE}/pecas/sh-387/</span></div>
      <ol class="steps">
        <li><span>A frase vem no idioma do cliente (francês, português, inglês ou espanhol), mas <b>o nome da peça vem sempre igual ao da Shopify</b>: Anel, Colar, Brincos ou Pulseira + a referência <b>SH-___</b>.</span></li>
        <li><span>Em geral o WhatsApp mostra a <b>foto da peça</b> junto com o link. Se a foto não aparecer, toque no link (abre a página da peça) ou procure a referência neste catálogo: as peças estão em <b>ordem de número</b>, de SH-131 a SH-977.</span></li>
        <li><span>Responda confirmando <b>preço, tamanho</b> (nos anéis) e <b>disponibilidade</b>, e combine pagamento e entrega diretamente na conversa. Há respostas prontas na próxima página.</span></li>
      </ol>
      <p class="note">No site, cada peça aparece com o tipo traduzido para o idioma do cliente (ex.: “Bague” em francês) e a referência SH-___, com “Preço sob consulta”. A referência é a mesma em todos os idiomas e na loja Shopify. Logo acima das peças, o site explica aos clientes como comprar em 3 passos.</p>
    </div>

    <div class="box">
      <h2>As peças</h2>
      <p>{total['Anéis']} anéis · {total['Colares']} colares · {total['Brincos']} brincos · {total['Pulseiras']} pulseira. A lista completa, com foto, começa na página 3.</p>
      <p class="note">Quando a loja Shopify entrar no ar com preços e checkout, cada peça poderá ganhar um nome de verdade; a referência SH continua no painel para não se perder.</p>
    </div>
  </section>

  <section class="page guide">
    <h2>Respostas prontas</h2>
    <p class="sub">Copie, troque o que está entre colchetes e envie. Para anéis, pergunte o tamanho.</p>
    <div class="reps">
      <div class="rep"><p class="lg">Français</p><p>Bonjour et merci pour votre message ! La pièce <b>[SH-___]</b> est disponible, au prix de <b>CHF [___]</b>. [Quelle est votre taille de bague ?] Je vous envoie ensuite les détails pour le paiement et la livraison.</p></div>
      <div class="rep"><p class="lg">Português</p><p>Olá, obrigada pela mensagem! A peça <b>[SH-___]</b> está disponível, no valor de <b>CHF [___]</b>. [Qual é o tamanho do seu anel?] Em seguida te envio os dados para pagamento e entrega.</p></div>
      <div class="rep"><p class="lg">English</p><p>Hello, and thank you for your message! The piece <b>[SH-___]</b> is available for <b>CHF [___]</b>. [What is your ring size?] I will then send you the payment and delivery details.</p></div>
      <div class="rep"><p class="lg">Español</p><p>¡Hola y gracias por tu mensaje! La pieza <b>[SH-___]</b> está disponible, por <b>CHF [___]</b>. [¿Cuál es tu talla de anillo?] Después te envío los datos para el pago y el envío.</p></div>
      <div class="rep"><p class="lg">Peça indisponível · FR</p><p>Merci pour votre intérêt ! La pièce <b>[SH-___]</b> n'est plus disponible pour le moment, mais je peux vous proposer des pièces similaires. Puis-je vous envoyer quelques photos ?</p></div>
      <div class="rep"><p class="lg">Peça indisponível · PT</p><p>Obrigada pelo interesse! A peça <b>[SH-___]</b> não está disponível no momento, mas posso te mostrar peças parecidas. Posso te enviar algumas fotos?</p></div>
    </div>

    <div class="sec2">
      <h2>Como divulgar</h2>
      <div class="links">
        <div class="lkbox"><p class="eye">Toda a coleção</p><p class="big">{SITE}</p><p class="note">Para Instagram, status e lista de transmissão.</p></div>
        <div class="lkbox"><p class="eye">Uma peça só</p><p class="big">{SITE}/pecas/sh-387</p><p class="note">Troque pelo número da referência. No WhatsApp, o link mostra a foto da peça.</p></div>
      </div>
      <div class="reps" style="margin-top:4mm">
        <div class="rep"><p class="lg">Texto para divulgar · FR</p><p>La nouvelle collection Valora Suisse est en ligne ✦ Choisissez votre pièce sur <b>{SITE}</b> et commandez directement sur WhatsApp.</p></div>
        <div class="rep"><p class="lg">Texto para divulgar · PT</p><p>A nova coleção Valora Suisse está no ar ✦ Escolha a sua peça em <b>{SITE}</b> e encomende direto pelo WhatsApp.</p></div>
      </div>
      <ul class="tips">
        <li>O site abre no idioma do aparelho do cliente; dá para trocar em FR · PT · EN · ES no topo.</li>
        <li>Os clientes da lista de convidados já podem ser avisados com o link do site.</li>
      </ul>
    </div>
    <div class="foot"><span>Valora Suisse · Guia de pedidos pelo WhatsApp</span><span>Lançamento · 18/10/2026</span></div>
  </section>
{catalog_pages}
</body>
</html>
'''
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, 'catalogo.html'), 'w', encoding='utf-8') as f:
        f.write(doc)
    print(len(rows), 'peças,', len(pages), 'páginas de catálogo')


if __name__ == '__main__':
    main(sys.argv[1])
