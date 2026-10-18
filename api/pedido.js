// Vercel Function · contagem de pedidos
// Recebe o toque em "Encomendar" (navigator.sendBeacon, mesmo domínio: a CSP não muda) e grava uma
// linha em pedidos_whatsapp no Supabase (projeto valora-suisse). A chave é a pública "anon": a tabela
// só aceita INSERT por RLS, ninguém lê por ela. Resumo por peça: Table Editor → pedidos_por_peca.
// Testes mandam teste=1 (a linha fica marcada e pode ser apagada).
const SUPABASE = 'https://cnvbfulojjbxfkegryke.supabase.co/rest/v1/pedidos_whatsapp';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNudmJmdWxvampieGZrZWdyeWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4OTc1MjMsImV4cCI6MjEwNjQ3MzUyM30.m85ubytdmHbJFF1JKqG4trHuNssJdjbuMXDKPXD162g';
const IDIOMAS = ['fr', 'pt', 'en', 'es'];
const ORIGENS = ['vitrine', 'pagina-da-peca'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  let b = req.body || {};
  if (typeof b === 'string') b = Object.fromEntries(new URLSearchParams(b));
  const row = {
    referencia: String(b.referencia || '').trim().toUpperCase().slice(0, 10),
    peca: String(b.peca || '').trim().slice(0, 40),
    idioma: String(b.idioma || '').trim().toLowerCase().slice(0, 2),
    origem: String(b.origem || '').trim().slice(0, 20),
    teste: b.teste === '1',
  };
  if (!/^SH-\d{3}$/.test(row.referencia) || row.peca.length < 4 || !IDIOMAS.includes(row.idioma) || !ORIGENS.includes(row.origem)) {
    return res.status(400).end();
  }
  try {
    const r = await fetch(SUPABASE, {
      method: 'POST',
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row),
    });
    return res.status(r.ok ? 204 : 502).end();
  } catch (e) {
    return res.status(502).end();
  }
};
