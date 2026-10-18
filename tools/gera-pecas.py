#!/usr/bin/env python3
"""Gera uma página por peça em pecas/<ref>/index.html a partir de catalogo/pecas.json.

Cada página tem as tags og:* da peça (título, foto 1200 px), então o link mandado no
WhatsApp já chega com a foto. Os textos saem em francês e o assets/piece.js troca
para o idioma escolhido (mesma chave valora:lang do site).

Uso (na raiz do repositório):  python3 tools/gera-pecas.py
Sem script nem estilo embutido no HTML: a CSP do vercel.json continua valendo sem hash novo.
"""
import html
import json
import os
import shutil

SITE = 'https://valorasuisse.com'
WA = 'https://wa.me/41764407717'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GRUPOS = {
    # grupo: (chave do plural, texto FR do plural, chave do singular, texto FR do singular)
    'bagues': ('nav_bagues', 'Bagues', 'pcat_bague', 'Bague'),
    'colliers': ('nav_colliers', 'Colliers', 'pcat_collier', 'Collier'),
    'boucles': ('nav_boucles_full', "Boucles d'oreilles", 'pcat_boucles', "Boucles d'oreilles"),
    'bracelets': ('nav_bracelets', 'Bracelets', 'pcat_bracelet', 'Bracelet'),
}

e = html.escape


def picture(slug, h800, sizes, eager=False):
    base = f'/assets/products/{slug}'
    load = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (
        f'<picture><source type="image/webp" srcset="{base}-480.webp 480w, {base}-800.webp 800w" sizes="{sizes}">'
        f'<img src="{base}-800.jpg" srcset="{base}-480.jpg 480w, {base}-800.jpg 800w, {base}-1200.jpg 1200w" sizes="{sizes}" '
        f'width="800" height="{h800}" {load} decoding="async" alt=""></picture>'
    )


def picture_crop(slug, sizes):
    # colares: recorte no pingente, só em 480 e 800 (4:5)
    base = f'/assets/products/{slug}-c'
    return (
        f'<picture><source type="image/webp" srcset="{base}-480.webp 480w, {base}-800.webp 800w" sizes="{sizes}">'
        f'<img src="{base}-800.jpg" srcset="{base}-480.jpg 480w, {base}-800.jpg 800w" sizes="{sizes}" '
        f'width="800" height="1000" loading="lazy" decoding="async" alt=""></picture>'
    )


def mini_card(p):
    g = GRUPOS[p['grupo']]
    slug = p['ref'].lower()
    sizes = "(min-width: 1101px) 250px, (min-width: 561px) 38vw, 47vw"
    crop = os.path.exists(os.path.join(ROOT, f'assets/products/{slug}-c-480.jpg'))
    return (
        f'<article class="prod" data-g="{p["grupo"]}">'
        f'<div class="p-img"><a href="/pecas/{slug}/" tabindex="-1" aria-hidden="true">'
        f'{picture_crop(slug, sizes) if crop else picture(slug, p["h800"], sizes)}</a></div>'
        f'<h3 class="p-name"><a href="/pecas/{slug}/"><span class="p-cat" data-i18n="{g[2]}">{e(g[3])}</span> <span class="p-sku">{e(p["ref"])}</span></a></h3>'
        '<p class="p-ask" data-i18n="price_request">Prix sur demande</p>'
        '</article>'
    )


def page(p, todas, footer):
    g = GRUPOS[p['grupo']]
    slug = p['ref'].lower()
    url = f'{SITE}/pecas/{slug}/'
    nome_fr = f'{g[3]} {p["ref"]}'
    h1200 = round(p['h800'] * 1.5)

    mesmas = [x for x in todas if x['grupo'] == p['grupo'] and x['ref'] != p['ref']]
    if mesmas:
        i = todas.index(p)
        # as próximas da mesma categoria, dando a volta
        depois = [x for x in todas[i + 1:] + todas[:i] if x['grupo'] == p['grupo']]
        mais, mais_key, mais_fr = depois[:5], 'pd_more', 'Dans la même collection'
    else:
        mais, mais_key, mais_fr = [x for x in todas if x['ref'] != p['ref']][:5], 'pd_other', 'Autres créations'

    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(nome_fr)} — Valora Suisse</title>
<meta name="description" content="{e(nome_fr)} · Valora Suisse. Prix sur demande : commandez directement sur WhatsApp.">
<!-- Site provisório até a loja Shopify entrar no domínio: fora dos buscadores. -->
<meta name="robots" content="noindex">
<meta name="theme-color" content="#032D1F">
<meta name="color-scheme" content="only light">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="{url}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="Valora Suisse">
<meta property="og:title" content="{e(nome_fr)} — Valora Suisse">
<meta property="og:description" content="Prix sur demande · Commandez sur WhatsApp.">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/products/{slug}-1200.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="{h1200}">
<meta property="og:locale" content="fr_CH">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/assets/fonts/cormorant-garamond-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/montserrat-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=5">
</head>
<body class="pc-page">

<a class="skip" href="#main" data-i18n="skip">Aller au contenu</a>

<svg class="sprite" aria-hidden="true" focusable="false">
  <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" fill="currentColor"/></symbol>
  <symbol id="i-star-line" viewBox="0 0 24 24"><path d="M12 1.5C12.8 7.9 16.1 11.2 22.5 12C16.1 12.8 12.8 16.1 12 22.5C11.2 16.1 7.9 12.8 1.5 12C7.9 11.2 11.2 7.9 12 1.5Z" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></symbol>
  <symbol id="i-wa" viewBox="0 0 24 24"><path d="M12 3.3a8.7 8.7 0 0 0-7.5 13.1l-1.2 4.3 4.4-1.2A8.7 8.7 0 1 0 12 3.3z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M9.2 8c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2.1.4 0 .6l-.4.6c-.1.2-.1.3 0 .5.4.7 1 1.3 1.6 1.7.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.6.8c.2.1.3.3.3.5 0 .5-.2 1.1-.7 1.4-.5.4-1.3.5-2.3.1-1.6-.6-3.1-2-3.9-3.5-.5-1-.6-1.9-.2-2.6z" fill="currentColor"/></symbol>
</svg>

<header class="site-header">
  <div class="hd hd--pc">
    <a class="pc-back" href="/#{p['grupo']}"><span aria-hidden="true">←</span> <span class="pc-back-t" data-i18n="back_coll">Retour à la collection</span></a>
    <a href="/" class="brand" aria-label="Valora Suisse">
      <svg class="brand-star" aria-hidden="true" focusable="false"><use href="#i-star-line"/></svg>
      <span class="brand-name">Valora</span>
      <span class="brand-sub">Suisse</span>
    </a>
    <div class="hd-right">
      <div class="lang" role="group" aria-label="Langue · Idioma · Language">
        <button type="button" data-lang="fr" lang="fr" aria-pressed="true">FR<span class="sr-only"> — Français</span></button>
        <button type="button" data-lang="pt" lang="pt-BR" aria-pressed="false">PT<span class="sr-only"> — Português</span></button>
        <button type="button" data-lang="en" lang="en" aria-pressed="false">EN<span class="sr-only"> — English</span></button>
        <button type="button" data-lang="es" lang="es" aria-pressed="false">ES<span class="sr-only"> — Español</span></button>
      </div>
    </div>
  </div>
</header>

<main id="main" tabindex="-1">
  <section class="pc" aria-labelledby="pc-title">
    <div class="sec pc-sec">
      <div class="pc-grid">
        <figure class="pc-img" data-g="{p['grupo']}">{picture(slug, p['h800'], '(min-width: 821px) 50vw, 100vw', eager=True)}</figure>
        <div class="pc-info">
          <span class="eye" data-i18n="{g[0]}">{e(g[1])}</span>
          <h1 class="pc-title" id="pc-title"><span data-i18n="{g[2]}">{e(g[3])}</span> {e(p['ref'])}</h1>
          <p class="pc-price p-ask" data-i18n="price_request">Prix sur demande</p>
          <a class="btn btn-green pc-order" href="{WA}" data-wa="order" data-wa-name="{e(p['nome_pt'])}" data-wa-url="{url}" target="_blank" rel="noopener noreferrer"><span data-i18n="btn_order_wa">Commander sur WhatsApp</span><span class="sr-only" data-i18n="newtab">(nouvel onglet)</span></a>
          <p class="pc-note" data-i18n="wa_note">Prix, taille et disponibilité confirmés avec vous sur WhatsApp.</p>
          <ul class="pc-trust">
            <li><svg aria-hidden="true" focusable="false"><use href="#i-star"/></svg><span data-i18n="t1">Certificat d'authenticité</span></li>
            <li><svg aria-hidden="true" focusable="false"><use href="#i-star"/></svg><span data-i18n="t2">Création sur mesure</span></li>
            <li><svg aria-hidden="true" focusable="false"><use href="#i-star"/></svg><span data-i18n="t3">Livraison assurée</span></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="psec pc-more" aria-labelledby="pc-more-h">
    <div class="sec">
      <div class="psec-h"><h2 id="pc-more-h" data-i18n="{mais_key}">{mais_fr}</h2><a class="pc-all" href="/#collection" data-i18n="see_all">Voir toute la collection</a></div>
      <div class="grid5">{''.join(mini_card(x) for x in mais)}</div>
    </div>
  </section>
</main>

{footer}

<script src="/assets/piece.js?v=6"></script>
</body>
</html>
'''


def main():
    todas = json.load(open(os.path.join(ROOT, 'catalogo/pecas.json'), encoding='utf-8'))
    idx = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    footer = idx[idx.index('<footer'):idx.index('</footer>') + len('</footer>')]
    # os links do rodapé apontam para seções da página inicial
    footer = footer.replace('<a href="#top"', '<a href="/"').replace('<a href="#', '<a href="/#')
    destino = os.path.join(ROOT, 'pecas')
    if os.path.isdir(destino):
        shutil.rmtree(destino)
    for p in todas:
        d = os.path.join(destino, p['ref'].lower())
        os.makedirs(d)
        with open(os.path.join(d, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(page(p, todas, footer))
    print(f'{len(todas)} páginas em pecas/')


if __name__ == '__main__':
    main()
