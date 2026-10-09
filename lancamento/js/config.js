/* =====================================================================
   CONFIGURAÇÃO · tudo que a equipe Valora precisa editar fica aqui
   Itens marcados com  ⚠ CONFIRMAR  dependem de decisão da marca.
   ===================================================================== */

export const CONFIG = {
  // Dia da abertura (AAAA-MM-DD). Sem horário: a marca ainda não confirmou.
  // A contagem mostra só os dias; no dia, a página diz "É hoje" e, do dia
  // seguinte em diante, troca para "a coleção está aberta". A agenda salva
  // um evento de dia inteiro.
  // Se mudar a data, atualize também: index.html (<time>, <title> e og:*),
  // assets/lancamento.ics e a imagem assets/og-image.jpg.
  launchDate: '2026-10-18',

  // ⚠ CONFIRMAR · para onde "Conhecer as peças" leva depois da abertura
  shopURL: 'https://www.instagram.com/valorasuisse/',

  // ⚠ CONFIRMAR · Instagram do rodapé (sem @)
  instagram: 'valorasuisse',

  // ⚠ CONFIRMAR · WhatsApp da marca, só números com DDI (ex.: '5511999999999').
  // Com o número preenchido, a confirmação mostra "Confirmar pelo WhatsApp":
  // a pessoa manda a primeira mensagem, o que permite à marca salvar o contato.
  // Pelo app WhatsApp Business, listas de transmissão SÓ chegam a quem salvou
  // o número da marca; para disparar para toda a lista, use a API oficial
  // (WhatsApp Business Platform) com um modelo de mensagem aprovado.
  whatsappBrand: '',

  // ------------------------------------------------------------------
  // LISTA DE ESPERA · backend já configurado (webhook n8n → Supabase)
  // Cada cadastro é gravado na tabela "leads" do projeto Supabase
  // "valora-suisse". Para ver as inscrições: supabase.com/dashboard →
  // projeto valora-suisse → Table Editor → leads.
  // Para editar o fluxo (ex.: notificar a marca por e-mail a cada novo
  // cadastro): pk7mkt.app.n8n.cloud → workflow "Valora Suisse — Lista de
  // espera (lançamento)".
  // Trocar de backend? Cole aqui a URL de outro webhook que aceite POST
  // application/x-www-form-urlencoded (não dispara preflight de CORS).
  // Os campos enviados estão documentados em js/main.js → submitLead().
  // ------------------------------------------------------------------
  waitlistEndpoint: 'https://pk7mkt.app.n8n.cloud/webhook/valora-lead',

  // Eventos de medição (opcional). Se preenchido, cada evento vai por
  // navigator.sendBeacon como JSON. Também são empurrados em window.dataLayer
  // quando existir (Google Tag Manager).
  analyticsEndpoint: '',

  // ⚠ CONFIRMAR · texto de consentimento mostrado acima do botão, em cada idioma.
  // Precisa bater com a política de privacidade (privacidade.html) e com o que a
  // marca realmente faz: "responder STOP/SAIR/BAJA" e o "link no fim de cada e-mail"
  // só podem ficar se existir mesmo esse jeito de sair da lista.
  // O texto exato que a pessoa viu vai junto com cada cadastro (consent_text).
  // Mudou o texto? Mude também a versão.
  consentVersion: '2026-10-09',
  consent: {
    fr: {
      whatsapp: 'En rejoignant la liste, vous autorisez Valora Suisse à vous envoyer sur WhatsApp des messages concernant le lancement de cette collection. Nous ne vendons ni ne partageons votre numéro à des fins publicitaires. Pour vous désinscrire, il suffit de répondre STOP. ',
      email: 'En rejoignant la liste, vous autorisez Valora Suisse à vous envoyer par e-mail des messages concernant le lancement de cette collection. Nous ne vendons ni ne partageons votre e-mail à des fins publicitaires. Pour vous désinscrire, utilisez le lien en bas de chaque e-mail. ',
    },
    pt: {
      whatsapp: 'Ao entrar na lista, você autoriza a Valora Suisse a enviar pelo WhatsApp mensagens sobre o lançamento desta coleção. Não vendemos nem compartilhamos seu número para publicidade. Para sair, é só responder SAIR. ',
      email: 'Ao entrar na lista, você autoriza a Valora Suisse a enviar por e-mail mensagens sobre o lançamento desta coleção. Não vendemos nem compartilhamos seu e-mail para publicidade. Para sair, use o link no fim de cada e-mail. ',
    },
    en: {
      whatsapp: 'By joining the list, you allow Valora Suisse to send you WhatsApp messages about the launch of this collection. We never sell or share your number for advertising. To unsubscribe, just reply STOP. ',
      email: 'By joining the list, you allow Valora Suisse to email you about the launch of this collection. We never sell or share your email for advertising. To unsubscribe, use the link at the bottom of any email. ',
    },
    es: {
      whatsapp: 'Al unirte a la lista, autorizas a Valora Suisse a enviarte por WhatsApp mensajes sobre el lanzamiento de esta colección. No vendemos ni compartimos tu número con fines publicitarios. Para darte de baja, solo responde BAJA. ',
      email: 'Al unirte a la lista, autorizas a Valora Suisse a enviarte por e-mail mensajes sobre el lanzamiento de esta colección. No vendemos ni compartimos tu e-mail con fines publicitarios. Para darte de baja, usa el enlace al final de cada e-mail. ',
    },
  },

  // Pedras · ⚠ CONFIRMAR qual pedra está em cada foto. Enquanto `pieceConfirmed`
  // for false, a legenda mostra só "Imagem ilustrativa." (os nomes das pedras e
  // das peças, nos 4 idiomas, ficam em js/i18n.js).
  stones: {
    moissanite: { pieceConfirmed: false }, // na foto: anel solitário
    zirconia: { pieceConfirmed: false }, // na foto: pulseira riviera
  },
};
