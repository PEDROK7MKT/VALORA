/* Política de privacidade · mostra a versão no idioma da pessoa (FR padrão).
   Mesmo critério do convite: ?lang= → escolha guardada → idioma do aparelho. */
import { LANGS, HTML_LANG, STORAGE_KEY, detectLang } from './i18n.js';

const store = {
  get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* segue sem salvar */ } },
};
const TITLE = {
  fr: 'Politique de confidentialité · Valora Suisse',
  pt: 'Política de privacidade · Valora Suisse',
  en: 'Privacy policy · Valora Suisse',
  es: 'Política de privacidad · Valora Suisse',
};
const BRAND = {
  fr: 'Valora Suisse, retour à la page du lancement',
  pt: 'Valora Suisse, voltar à página do lançamento',
  en: 'Valora Suisse, back to the launch page',
  es: 'Valora Suisse, volver a la página del lanzamiento',
};

function setLang(next, persist) {
  const lang = LANGS.includes(next) ? next : 'fr';
  if (persist) store.set(STORAGE_KEY, lang);
  document.documentElement.lang = HTML_LANG[lang];
  document.title = TITLE[lang];
  document.querySelectorAll('.policy').forEach((a) => { a.hidden = a.dataset.lang !== lang; });
  document.querySelectorAll('.lang-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  const brand = document.querySelector('.doc .brand');
  if (brand) brand.setAttribute('aria-label', BRAND[lang]);
}

setLang(detectLang(store), false);
document.addEventListener('click', (e) => {
  const b = e.target.closest('.lang-switch button');
  if (b) setLang(b.dataset.lang, true);
});
