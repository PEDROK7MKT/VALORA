/* VALORA SUISSE · página de cada peça (pecas/<ref>/), gerada por tools/gera-pecas.py
   Troca os textos para o idioma escolhido (mesma chave valora:lang do site) e monta o link do
   WhatsApp com o nome da peça e o endereço desta página (a prévia do link mostra a foto).
   Textos copiados do assets/site.js: se mudar lá, mude aqui também. */
(function () {
  'use strict';

  const WA = 'https://wa.me/41764407717';
  const LANGS = ['fr', 'pt', 'en', 'es'];
  const HTML_LANG = { fr: 'fr', pt: 'pt-BR', en: 'en', es: 'es' };
  const I18N = {
    fr: {
      skip: "Aller au contenu",
      nav_bagues: "Bagues",
      nav_colliers: "Colliers",
      nav_boucles_full: "Boucles d'oreilles",
      nav_bracelets: "Bracelets",
      pcat_bague: "Bague",
      pcat_collier: "Collier",
      pcat_boucles: "Boucles d'oreilles",
      pcat_bracelet: "Bracelet",
      price_request: "Prix sur demande",
      wa_order: "Bonjour Valora Suisse ! J'aimerais commander cette pièce : {n}\n{u}",
      t1: "Certificat d'authenticité",
      t2: "Création sur mesure",
      t3: "Livraison assurée",
      newtab: "(nouvel onglet)",
      f_tag: "Ce qui a de la valeur demeure.",
      f_loc: "Suisse",
      f_rights: "© 2026 Valora Suisse — Tous droits réservés",
      f_by: "Conçu par",
      cat_h: "La collection",
      nav_maison: "La Maison",
      m_h: "L'univers Valora",
      sm_eye: "Sur mesure",
      e_eye: "L'écrin",
      c_eye: "Garantie",
      nav_contact: "Contact",
      wa_general: "Bonjour Valora Suisse, j'aimerais avoir des informations.",
      back_coll: "Retour à la collection",
      btn_order_wa: "Commander sur WhatsApp",
      wa_note: "Prix, taille et disponibilité confirmés avec vous sur WhatsApp.",
      pd_more: "Dans la même collection",
      pd_other: "Autres créations",
      see_all: "Voir toute la collection",
    },
    pt: {
      skip: "Ir para o conteúdo",
      nav_bagues: "Anéis",
      nav_colliers: "Colares",
      nav_boucles_full: "Brincos",
      nav_bracelets: "Pulseiras",
      pcat_bague: "Anel",
      pcat_collier: "Colar",
      pcat_boucles: "Brincos",
      pcat_bracelet: "Pulseira",
      price_request: "Preço sob consulta",
      wa_order: "Olá, Valora Suisse! Quero encomendar esta peça: {n}\n{u}",
      t1: "Certificado de autenticidade",
      t2: "Criação sob medida",
      t3: "Entrega segurada",
      newtab: "(abre em nova aba)",
      f_tag: "O que tem valor permanece.",
      f_loc: "Suíça",
      f_rights: "© 2026 Valora Suisse — Todos os direitos reservados",
      f_by: "Criado por",
      cat_h: "A coleção",
      nav_maison: "A Marca",
      m_h: "O universo Valora",
      sm_eye: "Sob medida",
      e_eye: "A embalagem",
      c_eye: "Garantia",
      nav_contact: "Contato",
      wa_general: "Olá, Valora Suisse! Gostaria de mais informações.",
      back_coll: "Voltar à coleção",
      btn_order_wa: "Encomendar pelo WhatsApp",
      wa_note: "Preço, tamanho e disponibilidade confirmados com você pelo WhatsApp.",
      pd_more: "Da mesma coleção",
      pd_other: "Outras criações",
      see_all: "Ver toda a coleção",
    },
    en: {
      skip: "Skip to content",
      nav_bagues: "Rings",
      nav_colliers: "Necklaces",
      nav_boucles_full: "Earrings",
      nav_bracelets: "Bracelets",
      pcat_bague: "Ring",
      pcat_collier: "Necklace",
      pcat_boucles: "Earrings",
      pcat_bracelet: "Bracelet",
      price_request: "Price on request",
      wa_order: "Hello Valora Suisse! I'd like to order this piece: {n}\n{u}",
      t1: "Certificate of authenticity",
      t2: "Bespoke creation",
      t3: "Insured delivery",
      newtab: "(opens in a new tab)",
      f_tag: "What has value endures.",
      f_loc: "Switzerland",
      f_rights: "© 2026 Valora Suisse — All rights reserved",
      f_by: "Designed by",
      cat_h: "The collection",
      nav_maison: "The House",
      m_h: "The Valora universe",
      sm_eye: "Bespoke",
      e_eye: "The packaging",
      c_eye: "Guarantee",
      nav_contact: "Contact",
      wa_general: "Hello Valora Suisse, I would like some information.",
      back_coll: "Back to the collection",
      btn_order_wa: "Order on WhatsApp",
      wa_note: "Price, size and availability confirmed with you on WhatsApp.",
      pd_more: "From the same collection",
      pd_other: "Other creations",
      see_all: "See the whole collection",
    },
    es: {
      skip: "Saltar al contenido",
      nav_bagues: "Anillos",
      nav_colliers: "Collares",
      nav_boucles_full: "Pendientes",
      nav_bracelets: "Pulseras",
      pcat_bague: "Anillo",
      pcat_collier: "Collar",
      pcat_boucles: "Pendientes",
      pcat_bracelet: "Pulsera",
      price_request: "Precio a consultar",
      wa_order: "¡Hola, Valora Suisse! Quiero encargar esta pieza: {n}\n{u}",
      t1: "Certificado de autenticidad",
      t2: "Creación a medida",
      t3: "Entrega asegurada",
      newtab: "(se abre en una pestaña nueva)",
      f_tag: "Lo que tiene valor permanece.",
      f_loc: "Suiza",
      f_rights: "© 2026 Valora Suisse — Todos los derechos reservados",
      f_by: "Creado por",
      cat_h: "La colección",
      nav_maison: "La Marca",
      m_h: "El universo Valora",
      sm_eye: "A medida",
      e_eye: "El embalaje",
      c_eye: "Garantía",
      nav_contact: "Contacto",
      wa_general: "Hola, Valora Suisse. Me gustaría recibir información.",
      back_coll: "Volver a la colección",
      btn_order_wa: "Encargar por WhatsApp",
      wa_note: "Precio, talla y disponibilidad se confirman contigo por WhatsApp.",
      pd_more: "De la misma colección",
      pd_other: "Otras creaciones",
      see_all: "Ver toda la colección",
    },
  };

  let LANG = 'fr';
  const t = (k) => (I18N[LANG][k] !== undefined ? I18N[LANG][k] : I18N.fr[k]);
  const fmt = (k, vars) => (t(k) || '').replace(/\{(\w+)\}/g, (m, v) => (vars[v] !== undefined ? vars[v] : m));
  const storage = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* modo privado */ } },
  };

  function setLang(l, persist) {
    if (!LANGS.includes(l)) l = 'fr';
    LANG = l;
    document.documentElement.lang = HTML_LANG[l];
    document.querySelectorAll('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (v !== undefined) el.textContent = v; });
    document.querySelectorAll('[data-wa]').forEach((a) => {
      a.href = `${WA}?text=${encodeURIComponent(fmt(`wa_${a.dataset.wa}`, { n: a.dataset.waName || '', u: a.dataset.waUrl || '' }).trim())}`;
    });
    const h1 = document.querySelector('main h1');
    if (h1) document.title = `${h1.textContent.replace(/\s+/g, ' ').trim()} — Valora Suisse`;
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    if (persist) storage.set('valora:lang', l);
  }
  function initialLang() {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q && LANGS.includes(q)) { storage.set('valora:lang', q); return q; }
    const saved = storage.get('valora:lang');
    if (saved && LANGS.includes(saved)) return saved;
    const prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    for (const p of prefs) {
      const c = String(p).slice(0, 2).toLowerCase();
      if (LANGS.includes(c)) return c;
    }
    return 'fr';
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.lang button');
    if (b) setLang(b.dataset.lang, true);
  });
  setLang(initialLang(), false);
})();
