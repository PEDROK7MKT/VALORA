/* VALORA SUISSE · site (versão de demonstração)
   Sem innerHTML com dados: tudo é montado com createElement/textContent. */
(function () {
  'use strict';

  const SVGNS = 'http://www.w3.org/2000/svg';
  const WA = 'https://wa.me/41764407717';
  const LANGS = ['fr', 'pt', 'en', 'es'];
  const HTML_LANG = { fr: 'fr', pt: 'pt-BR', en: 'en', es: 'es' };
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ===================================================== textos */
  const I18N = {
    fr: {
      doc_title: "Valora Suisse — Bijoux d'exception",
      doc_desc: 'Bijoux qui traversent le temps. Créations en argent, or et moissanite, et pièces sur mesure — signées Valora Suisse.',
      skip: 'Aller au contenu', nav_label: 'Navigation principale', menu_open: 'Ouvrir le menu', menu_title: 'Menu', menu_lang: 'Langue', close: 'Fermer',
      nav_bagues: 'Bagues', nav_colliers: 'Colliers', nav_boucles: 'Boucles', nav_boucles_full: "Boucles d'oreilles", nav_bracelets: 'Bracelets', nav_maison: 'La Maison', nav_contact: 'Contact',
      cart_btn: 'Panier', cart_items_sr: 'articles',
      motion_pause: "Mettre en pause la vidéo et l'animation", motion_play: "Relancer la vidéo et l'animation",
      hero_eye: 'Maison de joaillerie · Suisse', hero_title: 'Ce qui a de la valeur demeure.',
      hero_p: 'Des bijoux en argent, or et moissanite, pensés pour traverser le temps et accompagner vos plus beaux moments.',
      hero_cta1: 'Découvrir la collection', hero_cta2: 'Créer sur mesure',
      t1: "Certificat d'authenticité", t2: 'Création sur mesure', t3: 'Livraison assurée', t4: 'Paiement sécurisé',
      m_eye: 'La Maison', m_h: "L'univers Valora",
      m_p1: "Le nom VALORA vient de l'idée de valeur — non seulement la valeur matérielle d'un bijou, mais la valeur affective, familiale et éternelle qu'il représente.",
      m_p2: "Le vert profond symbolise la permanence, l'exclusivité et la confiance. L'or incarne l'excellence, la tradition de la haute joaillerie et la préciosité de chaque création.",
      m_p3: "Des formes élégantes, des espaces généreux et une typographie raffinée reflètent une maison discrète mais mémorable — où le vrai luxe réside dans la qualité, l'authenticité et la permanence.",
      cover_alt: 'Le nom Valora gravé en relief sur un velours vert',
      cat_h: 'La collection', c5: '5 créations', ref: 'Réf.', btn_add: 'Ajouter', btn_added: 'Ajouté',
      pcat_bague: 'Bague', pcat_collier: 'Collier', pcat_boucles: "Boucles d'oreilles", pcat_bracelet: 'Bracelet',
      mat_argent: 'Argent 925', mat_or: 'Or 18k', badge_new: 'Nouveau', badge_sig: 'Signature',
      spec_m05: 'Moissanites 0,5 ct', spec_m08: 'Moissanite 0,8 ct', spec_m10: 'Moissanite 1,0 ct', spec_m10s: 'Moissanites 1,0 ct', spec_m15: 'Moissanite 1,5 ct', spec_m20: 'Moissanite 2,0 ct',
      spec_moissanites: 'Moissanites', spec_zirc: 'Zircones', spec_pendant: 'Pendentif moissanite', spec_medal: 'Médaille gravée',
      spec_polish: 'Finition polie', spec_pearl: 'Perles et moissanite', spec_double: 'Maille double', spec_jonc: 'Jonc ouvert, finition polie',
      alt_solitaire: 'Bague solitaire à six griffes, pierre ronde, posée sur un papier clair',
      alt_riviere: 'Bracelet rivière posé sur un écrin en velours vert Valora Suisse',
      alt_jonc: 'Bracelet jonc ouvert à la finition polie, devant un écrin en velours vert Valora Suisse',
      sm_eye: 'Sur mesure', sm_h: 'Une pièce unique, comme son histoire',
      sm_p: "Chaque création personnalisée commence par une conversation. Du premier croquis au bijou fini, chaque étape est menée avec le soin d'un savoir-faire qui traverse les générations.",
      sm_cta: 'Commencer un projet',
      e_eye: "L'écrin", e_h: 'Chaque détail compte', e1: 'Le sac Valora', e2: 'Écrin & pochette', e3: 'Sceau de cire', e4: 'Papier de soie signé', e5: 'Enveloppe & cachet', e6: 'Carte « Merci »', e7: 'Ruban satin', e8: 'Médaille gravée',
      v1: 'Design', v1p: 'Des créations pensées avec sensibilité et un regard authentique sur chaque détail.',
      v2: 'Exclusivité', v2p: 'Un accompagnement individuel, pour des pièces qui ont une véritable identité.',
      v3: 'Qualité', v3p: "Matériaux, finition et savoir-faire — l'excellence à chaque étape.",
      v4: 'Permanence', v4p: 'Des bijoux conçus pour traverser le temps et accompagner plusieurs générations.',
      c_eye: 'Garantie', c_h: "Certificat d'authenticité",
      c_p1: "Chaque bijou Valora est accompagné d'un certificat qui atteste de son origine, de ses matériaux et du savoir-faire mis dans sa création.",
      c_q: "« Valora Suisse certifie que ce bijou a été conçu avec le plus grand soin et réalisé selon les plus hauts standards de qualité, d'élégance et de savoir-faire suisse. »",
      c_p2: "Ce bijou est garanti contre tout défaut de fabrication dans des conditions normales d'utilisation.",
      cert_alt: "Certificat d'authenticité Valora Suisse avec son sceau",
      ct_h: 'Une pièce vous attend',
      ct_p: 'Pour toute demande, information ou création sur mesure, notre équipe vous accompagne avec la même attention que celle portée à chaque bijou.',
      ct_cta: 'Écrire sur WhatsApp', newtab: '(nouvel onglet)',
      wa_general: "Bonjour Valora Suisse, j'aimerais avoir des informations.",
      wa_bespoke: "Bonjour Valora Suisse, j'aimerais créer une pièce sur mesure.",
      f_tag: 'Ce qui a de la valeur demeure.', f_loc: 'Suisse', f_rights: '© 2026 Valora Suisse — Tous droits réservés', f_by: 'Conçu par',
      cart_title: 'Votre panier', cart_sub: 'Sous-total', cart_go: 'Passer à la caisse', cart_note: "Livraison et taxes calculées à l'étape suivante",
      cart_empty: 'Votre panier est vide.', cart_rm: 'Retirer', qty_label: 'Quantité', qty_minus: 'Diminuer', qty_plus: 'Augmenter',
      s_added: '{n} ajouté au panier', s_removed: '{n} retiré du panier', s_qty: '{n} : quantité {q}',
      co_title: 'Finaliser la commande', st1: 'Panier', st2: 'Livraison', st3: 'Paiement',
      demo_note: "Démonstration — aucune commande n'est transmise et aucun paiement n'est demandé.",
      fo_contact: 'Coordonnées', fo_first: 'Prénom', fo_last: 'Nom', fo_email: 'E-mail', fo_phone: 'Téléphone',
      fo_ship: 'Adresse de livraison', fo_addr: 'Adresse', fo_city: 'Ville', fo_zip: 'Code postal', fo_country: 'Pays',
      c_ch: 'Suisse', c_fr: 'France', c_pt: 'Portugal', c_br: 'Brésil', c_es: 'Espagne',
      fo_pay: 'Paiement', pay_card: 'Carte',
      pay_note: "Le paiement s'effectue sur la page sécurisée de notre prestataire. Aucune donnée bancaire n'est saisie sur ce site.",
      su_h: 'Récapitulatif', su_sub: 'Sous-total', su_ship: 'Livraison assurée', su_free: 'Offerte',
      su_confirm: 'Continuer vers le paiement sécurisé', su_secure: "Paiement sécurisé chez notre prestataire · Certificat d'authenticité inclus",
      d_h: 'Votre sélection est prête', d_p: "Merci d'avoir choisi Valora Suisse. Que ce bijou accompagne vos plus beaux moments.",
      d_s: "Démonstration : aucune commande n'a été enregistrée et aucun e-mail n'a été envoyé. Dans la boutique, vous continueriez ici vers la page de paiement sécurisée de notre prestataire.",
      d_back: 'Retour à la boutique',
    },
    pt: {
      doc_title: 'Valora Suisse — Joias de exceção',
      doc_desc: 'Joias que atravessam o tempo. Criações em prata, ouro e moissanite, e peças sob medida — assinadas Valora Suisse.',
      skip: 'Ir para o conteúdo', nav_label: 'Navegação principal', menu_open: 'Abrir o menu', menu_title: 'Menu', menu_lang: 'Idioma', close: 'Fechar',
      nav_bagues: 'Anéis', nav_colliers: 'Colares', nav_boucles: 'Brincos', nav_boucles_full: 'Brincos', nav_bracelets: 'Pulseiras', nav_maison: 'A Marca', nav_contact: 'Contato',
      cart_btn: 'Carrinho', cart_items_sr: 'itens',
      motion_pause: 'Pausar o vídeo e a animação', motion_play: 'Retomar o vídeo e a animação',
      hero_eye: 'Joalheria · Suíça', hero_title: 'O que tem valor permanece.',
      hero_p: 'Joias em prata, ouro e moissanite, pensadas para atravessar o tempo e acompanhar os seus momentos mais especiais.',
      hero_cta1: 'Ver a coleção', hero_cta2: 'Criar sob medida',
      t1: 'Certificado de autenticidade', t2: 'Criação sob medida', t3: 'Entrega segurada', t4: 'Pagamento seguro',
      m_eye: 'A Marca', m_h: 'O universo Valora',
      m_p1: 'O nome VALORA deriva da ideia de valor — não apenas o valor material de uma joia, mas o valor afetivo, familiar e eterno que ela representa.',
      m_p2: 'O verde profundo simboliza permanência, exclusividade e confiança. O dourado representa a excelência, a tradição da alta joalheria e a preciosidade de cada criação.',
      m_p3: 'Formas elegantes, espaços generosos e tipografia refinada refletem uma marca discreta, porém memorável — onde o verdadeiro luxo está na qualidade, na autenticidade e na permanência.',
      cover_alt: 'O nome Valora gravado em relevo sobre veludo verde',
      cat_h: 'A coleção', c5: '5 criações', ref: 'Ref.', btn_add: 'Adicionar', btn_added: 'Adicionado',
      pcat_bague: 'Anel', pcat_collier: 'Colar', pcat_boucles: 'Brincos', pcat_bracelet: 'Pulseira',
      mat_argent: 'Prata 925', mat_or: 'Ouro 18k', badge_new: 'Novo', badge_sig: 'Assinatura',
      spec_m05: 'Moissanites 0,5 ct', spec_m08: 'Moissanite 0,8 ct', spec_m10: 'Moissanite 1,0 ct', spec_m10s: 'Moissanites 1,0 ct', spec_m15: 'Moissanite 1,5 ct', spec_m20: 'Moissanite 2,0 ct',
      spec_moissanites: 'Moissanites', spec_zirc: 'Zircônias', spec_pendant: 'Pingente de moissanite', spec_medal: 'Medalha gravada',
      spec_polish: 'Acabamento polido', spec_pearl: 'Pérolas e moissanite', spec_double: 'Malha dupla', spec_jonc: 'Bracelete aberto, acabamento polido',
      alt_solitaire: 'Anel solitário de seis garras com pedra redonda, sobre papel claro',
      alt_riviere: 'Pulseira riviera sobre um estojo de veludo verde Valora Suisse',
      alt_jonc: 'Bracelete aberto de acabamento polido, diante de um estojo de veludo verde Valora Suisse',
      sm_eye: 'Sob medida', sm_h: 'Uma peça única, como a sua história',
      sm_p: 'Cada criação personalizada começa com uma conversa. Do primeiro esboço à joia finalizada, cada etapa é conduzida com o cuidado de um savoir-faire que atravessa gerações.',
      sm_cta: 'Iniciar um projeto',
      e_eye: 'A embalagem', e_h: 'Cada detalhe importa', e1: 'A sacola Valora', e2: 'Caixa & pochete', e3: 'Selo de lacre', e4: 'Papel de seda assinado', e5: 'Envelope & lacre', e6: 'Cartão « Merci »', e7: 'Fita de cetim', e8: 'Medalha gravada',
      v1: 'Design', v1p: 'Criações pensadas com sensibilidade e um olhar autêntico em cada detalhe.',
      v2: 'Exclusividade', v2p: 'Um atendimento individual, para peças com uma identidade verdadeira.',
      v3: 'Qualidade', v3p: 'Materiais, acabamento e savoir-faire — a excelência em cada etapa.',
      v4: 'Permanência', v4p: 'Joias criadas para atravessar o tempo e acompanhar várias gerações.',
      c_eye: 'Garantia', c_h: 'Certificado de autenticidade',
      c_p1: 'Cada joia Valora é acompanhada de um certificado que atesta sua origem, seus materiais e o savoir-faire investido em sua criação.',
      c_q: '« A Valora Suisse certifica que esta joia foi concebida com o maior cuidado e realizada segundo os mais altos padrões de qualidade, elegância e savoir-faire suíço. »',
      c_p2: 'Esta joia é garantida contra qualquer defeito de fabricação em condições normais de uso.',
      cert_alt: 'Certificado de autenticidade Valora Suisse com o selo',
      ct_h: 'Uma peça espera por você',
      ct_p: 'Para qualquer pedido, informação ou criação sob medida, nossa equipe acompanha você com o mesmo cuidado dedicado a cada joia.',
      ct_cta: 'Falar no WhatsApp', newtab: '(abre em nova aba)',
      wa_general: 'Olá, Valora Suisse! Gostaria de mais informações.',
      wa_bespoke: 'Olá, Valora Suisse! Gostaria de criar uma peça sob medida.',
      f_tag: 'O que tem valor permanece.', f_loc: 'Suíça', f_rights: '© 2026 Valora Suisse — Todos os direitos reservados', f_by: 'Criado por',
      cart_title: 'Seu carrinho', cart_sub: 'Subtotal', cart_go: 'Finalizar compra', cart_note: 'Entrega e taxas calculadas na próxima etapa',
      cart_empty: 'Seu carrinho está vazio.', cart_rm: 'Remover', qty_label: 'Quantidade', qty_minus: 'Diminuir', qty_plus: 'Aumentar',
      s_added: '{n} adicionado ao carrinho', s_removed: '{n} removido do carrinho', s_qty: '{n}: quantidade {q}',
      co_title: 'Finalizar o pedido', st1: 'Carrinho', st2: 'Entrega', st3: 'Pagamento',
      demo_note: 'Demonstração — nenhum pedido é enviado e nenhum pagamento é solicitado.',
      fo_contact: 'Dados de contato', fo_first: 'Nome', fo_last: 'Sobrenome', fo_email: 'E-mail', fo_phone: 'Telefone',
      fo_ship: 'Endereço de entrega', fo_addr: 'Endereço', fo_city: 'Cidade', fo_zip: 'Código postal', fo_country: 'País',
      c_ch: 'Suíça', c_fr: 'França', c_pt: 'Portugal', c_br: 'Brasil', c_es: 'Espanha',
      fo_pay: 'Pagamento', pay_card: 'Cartão',
      pay_note: 'O pagamento é feito na página segura do nosso parceiro de pagamento. Nenhum dado bancário é digitado neste site.',
      su_h: 'Resumo', su_sub: 'Subtotal', su_ship: 'Entrega segurada', su_free: 'Grátis',
      su_confirm: 'Continuar para o pagamento seguro', su_secure: 'Pagamento seguro com o nosso parceiro · Certificado de autenticidade incluído',
      d_h: 'Sua seleção está pronta', d_p: 'Obrigado por escolher a Valora Suisse. Que esta joia acompanhe os seus momentos mais especiais.',
      d_s: 'Demonstração: nenhum pedido foi registrado e nenhum e-mail foi enviado. Na loja, você seguiria daqui para a página de pagamento segura do nosso parceiro.',
      d_back: 'Voltar à loja',
    },
    en: {
      doc_title: 'Valora Suisse — Exceptional jewellery',
      doc_desc: 'Jewellery that endures. Creations in silver, gold and moissanite, and bespoke pieces — signed Valora Suisse.',
      skip: 'Skip to content', nav_label: 'Main navigation', menu_open: 'Open menu', menu_title: 'Menu', menu_lang: 'Language', close: 'Close',
      nav_bagues: 'Rings', nav_colliers: 'Necklaces', nav_boucles: 'Earrings', nav_boucles_full: 'Earrings', nav_bracelets: 'Bracelets', nav_maison: 'The House', nav_contact: 'Contact',
      cart_btn: 'Cart', cart_items_sr: 'items',
      motion_pause: 'Pause the video and animation', motion_play: 'Play the video and animation',
      hero_eye: 'Fine jewellery · Switzerland', hero_title: 'What has value endures.',
      hero_p: 'Jewellery in silver, gold and moissanite, made to last through time and accompany your most precious moments.',
      hero_cta1: 'Discover the collection', hero_cta2: 'Create bespoke',
      t1: 'Certificate of authenticity', t2: 'Bespoke creation', t3: 'Insured delivery', t4: 'Secure payment',
      m_eye: 'The House', m_h: 'The Valora universe',
      m_p1: 'The name VALORA comes from the idea of value — not only the material value of a jewel, but the emotional, family and eternal value it represents.',
      m_p2: 'Deep green symbolises permanence, exclusivity and trust. Gold embodies excellence, the tradition of fine jewellery and the preciousness of every creation.',
      m_p3: 'Elegant shapes, generous space and refined typography reflect a discreet yet memorable house — where true luxury lies in quality, authenticity and permanence.',
      cover_alt: 'The Valora name embossed on green velvet',
      cat_h: 'The collection', c5: '5 creations', ref: 'Ref.', btn_add: 'Add', btn_added: 'Added',
      pcat_bague: 'Ring', pcat_collier: 'Necklace', pcat_boucles: 'Earrings', pcat_bracelet: 'Bracelet',
      mat_argent: 'Sterling silver 925', mat_or: '18k gold', badge_new: 'New', badge_sig: 'Signature',
      spec_m05: 'Moissanites 0.5 ct', spec_m08: 'Moissanite 0.8 ct', spec_m10: 'Moissanite 1.0 ct', spec_m10s: 'Moissanites 1.0 ct', spec_m15: 'Moissanite 1.5 ct', spec_m20: 'Moissanite 2.0 ct',
      spec_moissanites: 'Moissanites', spec_zirc: 'Cubic zirconia', spec_pendant: 'Moissanite pendant', spec_medal: 'Engraved medal',
      spec_polish: 'Polished finish', spec_pearl: 'Pearls and moissanite', spec_double: 'Double chain', spec_jonc: 'Open cuff, polished finish',
      alt_solitaire: 'Six-prong solitaire ring with a round stone, on light paper',
      alt_riviere: 'Rivière bracelet on a green velvet Valora Suisse box',
      alt_jonc: 'Polished open cuff in front of a green velvet Valora Suisse box',
      sm_eye: 'Bespoke', sm_h: 'A unique piece, like its story',
      sm_p: 'Every bespoke creation begins with a conversation. From the first sketch to the finished jewel, every step is carried out with the care of a savoir-faire passed down through generations.',
      sm_cta: 'Start a project',
      e_eye: 'The packaging', e_h: 'Every detail matters', e1: 'The Valora bag', e2: 'Box & pouch', e3: 'Wax seal', e4: 'Signed tissue paper', e5: 'Envelope & seal', e6: '« Merci » card', e7: 'Satin ribbon', e8: 'Engraved medal',
      v1: 'Design', v1p: 'Creations shaped with sensitivity and an authentic eye for every detail.',
      v2: 'Exclusivity', v2p: 'Individual guidance, for pieces with a true identity.',
      v3: 'Quality', v3p: 'Materials, finish and savoir-faire — excellence at every step.',
      v4: 'Permanence', v4p: 'Jewellery made to endure through time and accompany many generations.',
      c_eye: 'Guarantee', c_h: 'Certificate of authenticity',
      c_p1: 'Every Valora jewel comes with a certificate attesting to its origin, its materials and the savoir-faire invested in its creation.',
      c_q: '« Valora Suisse certifies that this jewel was designed with the greatest care and made to the highest standards of quality, elegance and Swiss savoir-faire. »',
      c_p2: 'This jewel is guaranteed against any manufacturing defect under normal conditions of use.',
      cert_alt: 'Valora Suisse certificate of authenticity with its seal',
      ct_h: 'A piece awaits you',
      ct_p: 'For any request, information or bespoke creation, our team accompanies you with the same attention given to every jewel.',
      ct_cta: 'Write on WhatsApp', newtab: '(opens in a new tab)',
      wa_general: 'Hello Valora Suisse, I would like some information.',
      wa_bespoke: 'Hello Valora Suisse, I would like to create a bespoke piece.',
      f_tag: 'What has value endures.', f_loc: 'Switzerland', f_rights: '© 2026 Valora Suisse — All rights reserved', f_by: 'Designed by',
      cart_title: 'Your cart', cart_sub: 'Subtotal', cart_go: 'Checkout', cart_note: 'Shipping and taxes calculated at the next step',
      cart_empty: 'Your cart is empty.', cart_rm: 'Remove', qty_label: 'Quantity', qty_minus: 'Decrease', qty_plus: 'Increase',
      s_added: '{n} added to your cart', s_removed: '{n} removed from your cart', s_qty: '{n}: quantity {q}',
      co_title: 'Checkout', st1: 'Cart', st2: 'Shipping', st3: 'Payment',
      demo_note: 'Demo — no order is sent and no payment is requested.',
      fo_contact: 'Contact details', fo_first: 'First name', fo_last: 'Last name', fo_email: 'Email', fo_phone: 'Phone',
      fo_ship: 'Shipping address', fo_addr: 'Address', fo_city: 'City', fo_zip: 'Postal code', fo_country: 'Country',
      c_ch: 'Switzerland', c_fr: 'France', c_pt: 'Portugal', c_br: 'Brazil', c_es: 'Spain',
      fo_pay: 'Payment', pay_card: 'Card',
      pay_note: "Payment takes place on our payment provider's secure page. No card details are entered on this site.",
      su_h: 'Summary', su_sub: 'Subtotal', su_ship: 'Insured delivery', su_free: 'Free',
      su_confirm: 'Continue to secure payment', su_secure: 'Secure payment with our provider · Certificate of authenticity included',
      d_h: 'Your selection is ready', d_p: 'Thank you for choosing Valora Suisse. May this jewel accompany your most precious moments.',
      d_s: "Demo: no order was recorded and no email was sent. In the shop, you would continue from here to our payment provider's secure page.",
      d_back: 'Back to the shop',
    },
    es: {
      doc_title: 'Valora Suisse — Joyas excepcionales',
      doc_desc: 'Joyas que atraviesan el tiempo. Creaciones en plata, oro y moissanita, y piezas a medida — firmadas por Valora Suisse.',
      skip: 'Saltar al contenido', nav_label: 'Navegación principal', menu_open: 'Abrir el menú', menu_title: 'Menú', menu_lang: 'Idioma', close: 'Cerrar',
      nav_bagues: 'Anillos', nav_colliers: 'Collares', nav_boucles: 'Pendientes', nav_boucles_full: 'Pendientes', nav_bracelets: 'Pulseras', nav_maison: 'La Marca', nav_contact: 'Contacto',
      cart_btn: 'Cesta', cart_items_sr: 'artículos',
      motion_pause: 'Pausar el vídeo y la animación', motion_play: 'Reanudar el vídeo y la animación',
      hero_eye: 'Joyería · Suiza', hero_title: 'Lo que tiene valor permanece.',
      hero_p: 'Joyas en plata, oro y moissanita, pensadas para atravesar el tiempo y acompañar tus momentos más preciados.',
      hero_cta1: 'Descubrir la colección', hero_cta2: 'Crear a medida',
      t1: 'Certificado de autenticidad', t2: 'Creación a medida', t3: 'Entrega asegurada', t4: 'Pago seguro',
      m_eye: 'La Marca', m_h: 'El universo Valora',
      m_p1: 'El nombre VALORA deriva de la idea de valor — no solo el valor material de una joya, sino el valor afectivo, familiar y eterno que representa.',
      m_p2: 'El verde profundo simboliza permanencia, exclusividad y confianza. El dorado representa la excelencia, la tradición de la alta joyería y la preciosidad de cada creación.',
      m_p3: 'Formas elegantes, espacios generosos y tipografía refinada reflejan una marca discreta pero memorable — donde el verdadero lujo está en la calidad, la autenticidad y la permanencia.',
      cover_alt: 'El nombre Valora grabado en relieve sobre terciopelo verde',
      cat_h: 'La colección', c5: '5 creaciones', ref: 'Ref.', btn_add: 'Añadir', btn_added: 'Añadido',
      pcat_bague: 'Anillo', pcat_collier: 'Collar', pcat_boucles: 'Pendientes', pcat_bracelet: 'Pulsera',
      mat_argent: 'Plata 925', mat_or: 'Oro 18k', badge_new: 'Nuevo', badge_sig: 'Firma',
      spec_m05: 'Moissanitas 0,5 ct', spec_m08: 'Moissanita 0,8 ct', spec_m10: 'Moissanita 1,0 ct', spec_m10s: 'Moissanitas 1,0 ct', spec_m15: 'Moissanita 1,5 ct', spec_m20: 'Moissanita 2,0 ct',
      spec_moissanites: 'Moissanitas', spec_zirc: 'Circonitas', spec_pendant: 'Colgante de moissanita', spec_medal: 'Medalla grabada',
      spec_polish: 'Acabado pulido', spec_pearl: 'Perlas y moissanita', spec_double: 'Cadena doble', spec_jonc: 'Brazalete abierto, acabado pulido',
      alt_solitaire: 'Anillo solitario de seis garras con piedra redonda, sobre papel claro',
      alt_riviere: 'Pulsera riviera sobre un estuche de terciopelo verde Valora Suisse',
      alt_jonc: 'Brazalete abierto pulido delante de un estuche de terciopelo verde Valora Suisse',
      sm_eye: 'A medida', sm_h: 'Una pieza única, como su historia',
      sm_p: 'Cada creación personalizada comienza con una conversación. Del primer boceto a la joya terminada, cada etapa se realiza con el cuidado de un savoir-faire que atraviesa generaciones.',
      sm_cta: 'Iniciar un proyecto',
      e_eye: 'El embalaje', e_h: 'Cada detalle cuenta', e1: 'La bolsa Valora', e2: 'Estuche & bolsita', e3: 'Sello de lacre', e4: 'Papel de seda firmado', e5: 'Sobre & sello', e6: 'Tarjeta « Merci »', e7: 'Cinta de satén', e8: 'Medalla grabada',
      v1: 'Diseño', v1p: 'Creaciones pensadas con sensibilidad y una mirada auténtica en cada detalle.',
      v2: 'Exclusividad', v2p: 'Un acompañamiento individual, para piezas con una identidad verdadera.',
      v3: 'Calidad', v3p: 'Materiales, acabado y savoir-faire — la excelencia en cada etapa.',
      v4: 'Permanencia', v4p: 'Joyas creadas para atravesar el tiempo y acompañar varias generaciones.',
      c_eye: 'Garantía', c_h: 'Certificado de autenticidad',
      c_p1: 'Cada joya Valora se acompaña de un certificado que acredita su origen, sus materiales y el savoir-faire invertido en su creación.',
      c_q: '« Valora Suisse certifica que esta joya fue concebida con el mayor cuidado y realizada según los más altos estándares de calidad, elegancia y savoir-faire suizo. »',
      c_p2: 'Esta joya está garantizada contra cualquier defecto de fabricación en condiciones normales de uso.',
      cert_alt: 'Certificado de autenticidad Valora Suisse con su sello',
      ct_h: 'Una pieza te espera',
      ct_p: 'Para cualquier consulta, información o creación a medida, nuestro equipo te acompaña con la misma atención dedicada a cada joya.',
      ct_cta: 'Escribir por WhatsApp', newtab: '(se abre en una pestaña nueva)',
      wa_general: 'Hola, Valora Suisse. Me gustaría recibir información.',
      wa_bespoke: 'Hola, Valora Suisse. Me gustaría crear una pieza a medida.',
      f_tag: 'Lo que tiene valor permanece.', f_loc: 'Suiza', f_rights: '© 2026 Valora Suisse — Todos los derechos reservados', f_by: 'Creado por',
      cart_title: 'Tu cesta', cart_sub: 'Subtotal', cart_go: 'Finalizar compra', cart_note: 'Envío e impuestos calculados en el siguiente paso',
      cart_empty: 'Tu cesta está vacía.', cart_rm: 'Quitar', qty_label: 'Cantidad', qty_minus: 'Reducir', qty_plus: 'Aumentar',
      s_added: '{n} añadido a la cesta', s_removed: '{n} eliminado de la cesta', s_qty: '{n}: cantidad {q}',
      co_title: 'Finalizar el pedido', st1: 'Cesta', st2: 'Envío', st3: 'Pago',
      demo_note: 'Demostración — no se envía ningún pedido ni se solicita ningún pago.',
      fo_contact: 'Datos de contacto', fo_first: 'Nombre', fo_last: 'Apellido', fo_email: 'Correo electrónico', fo_phone: 'Teléfono',
      fo_ship: 'Dirección de envío', fo_addr: 'Dirección', fo_city: 'Ciudad', fo_zip: 'Código postal', fo_country: 'País',
      c_ch: 'Suiza', c_fr: 'Francia', c_pt: 'Portugal', c_br: 'Brasil', c_es: 'España',
      fo_pay: 'Pago', pay_card: 'Tarjeta',
      pay_note: 'El pago se realiza en la página segura de nuestro proveedor de pagos. En este sitio no se introduce ningún dato bancario.',
      su_h: 'Resumen', su_sub: 'Subtotal', su_ship: 'Entrega asegurada', su_free: 'Gratis',
      su_confirm: 'Continuar al pago seguro', su_secure: 'Pago seguro con nuestro proveedor · Certificado de autenticidad incluido',
      d_h: 'Tu selección está lista', d_p: 'Gracias por elegir Valora Suisse. Que esta joya acompañe tus momentos más preciados.',
      d_s: 'Demostración: no se ha registrado ningún pedido ni se ha enviado ningún correo. En la tienda, desde aquí pasarías a la página de pago seguro de nuestro proveedor.',
      d_back: 'Volver a la tienda',
    },
  };

  /* ===================================================== produtos (fictícios, fotos chegando) */
  const P = {
    bagues: { cat: 'pcat_bague', items: [
      { name: 'Solitaire', ref: 'SS201', mat: 'mat_argent', spec: 'spec_m15', price: 1190, badge: 'badge_sig', img: 'solitaire', h: 1000, alt: 'alt_solitaire' },
      { name: 'Iris', ref: 'SS122', mat: 'mat_argent', spec: 'spec_m10', price: 890, badge: 'badge_new' },
      { name: 'Éternité', ref: 'SS305', mat: 'mat_or', spec: 'spec_zirc', price: 1450 },
      { name: 'Aurore', ref: 'SS118', mat: 'mat_argent', spec: 'spec_zirc', price: 620 },
      { name: 'Céleste', ref: 'SS410', mat: 'mat_or', spec: 'spec_m20', price: 2380 },
    ] },
    colliers: { cat: 'pcat_collier', items: [
      { name: 'Riviera', ref: 'SC101', mat: 'mat_argent', spec: 'spec_moissanites', price: 1650, badge: 'badge_sig' },
      { name: 'Muse', ref: 'SC220', mat: 'mat_argent', spec: 'spec_pendant', price: 740 },
      { name: 'Lumière', ref: 'SC315', mat: 'mat_or', spec: 'spec_m10', price: 1980 },
      { name: 'Étoile', ref: 'SC402', mat: 'mat_argent', spec: 'spec_zirc', price: 540, badge: 'badge_new' },
      { name: 'Héritage', ref: 'SC509', mat: 'mat_or', spec: 'spec_medal', price: 1280 },
    ] },
    boucles: { cat: 'pcat_boucles', items: [
      { name: 'Rosée', ref: 'SB110', mat: 'mat_argent', spec: 'spec_m05', price: 690 },
      { name: 'Goutte', ref: 'SB205', mat: 'mat_or', spec: 'spec_polish', price: 1120, badge: 'badge_new' },
      { name: 'Infinie', ref: 'SB318', mat: 'mat_argent', spec: 'spec_zirc', price: 480 },
      { name: 'Perle', ref: 'SB412', mat: 'mat_argent', spec: 'spec_pearl', price: 830 },
      { name: 'Signature', ref: 'SB520', mat: 'mat_or', spec: 'spec_m10s', price: 1760, badge: 'badge_sig' },
    ] },
    bracelets: { cat: 'pcat_bracelet', items: [
      { name: 'Ligne', ref: 'SP215', mat: 'mat_argent', spec: 'spec_zirc', price: 560, badge: 'badge_sig', img: 'riviere', h: 1000, alt: 'alt_riviere' },
      { name: 'Maison', ref: 'SP505', mat: 'mat_argent', spec: 'spec_jonc', price: 780, img: 'jonc', h: 800, alt: 'alt_jonc', pos: 'pos-left' },
      { name: 'Tennis', ref: 'SP101', mat: 'mat_argent', spec: 'spec_moissanites', price: 1490 },
      { name: 'Éclat', ref: 'SP309', mat: 'mat_or', spec: 'spec_m08', price: 1340, badge: 'badge_new' },
      { name: 'Duo', ref: 'SP418', mat: 'mat_argent', spec: 'spec_double', price: 720 },
    ] },
  };

  /* ===================================================== utilidades */
  let LANG = 'fr';
  const t = (k) => (I18N[LANG][k] !== undefined ? I18N[LANG][k] : (I18N.fr[k] !== undefined ? I18N.fr[k] : k));
  const fmt = (k, vars) => t(k).replace(/\{(\w+)\}/g, (m, v) => (vars[v] !== undefined ? vars[v] : m));
  // Milhar com espaço inquebrável comum: o fino (U+202F) quase some em corpo pequeno.
  const CHF = (n) => `CHF\u00a0${n.toLocaleString('fr-CH').replace(/[\u202f\u2009]/g, '\u00a0')}`;

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else el.setAttribute(k, v === true ? '' : String(v));
      });
    }
    kids.flat().forEach((c) => { if (c !== null && c !== undefined && c !== false) el.append(c); });
    return el;
  }
  function icon(id, cls) {
    const s = document.createElementNS(SVGNS, 'svg');
    if (cls) s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    const u = document.createElementNS(SVGNS, 'use');
    u.setAttribute('href', `#${id}`);
    s.append(u);
    return s;
  }
  function announce(region, msg) {
    region.textContent = '';
    window.setTimeout(() => { region.textContent = msg; }, 120);
  }
  const storage = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* modo privado */ } },
  };

  /* ===================================================== imagens que falham (substitui onerror inline) */
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const hide = () => {
      if (img.dataset.fallback === 'cover') img.parentNode.classList.add('no-img');
      img.hidden = true;
    };
    if (img.complete && img.naturalWidth === 0) hide();
    else img.addEventListener('error', hide, { once: true });
  });

  /* ===================================================== produtos */
  function card(gid, p, i) {
    const nameId = `pn-${gid}-${i}`;
    const sizes = '(min-width: 1101px) 250px, (min-width: 561px) 38vw, 72vw';
    let media;
    if (p.img) {
      const base = `assets/products/${p.img}`;
      media = h('picture', null,
        h('source', { type: 'image/webp', srcset: `${base}-480.webp 480w, ${base}-800.webp 800w`, sizes }),
        h('img', {
          src: `${base}-800.jpg`, srcset: `${base}-480.jpg 480w, ${base}-800.jpg 800w`, sizes,
          width: 800, height: p.h, loading: 'lazy', decoding: 'async', alt: '', 'data-i18n-alt': p.alt, class: p.pos || null,
        }));
    } else {
      media = icon('i-star', 'p-ph');
    }
    return h('article', { class: 'prod' },
      h('div', { class: 'p-img' }, media, p.badge ? h('span', { class: 'badge', 'data-i18n': p.badge }) : null),
      h('h3', { class: 'p-name', id: nameId }, p.name),
      h('p', { class: 'p-desc' }, h('span', { 'data-i18n': p.mat }), ' · ', h('span', { 'data-i18n': p.spec })),
      h('p', { class: 'p-ref' }, h('span', { 'data-i18n': 'ref' }), ` ${p.ref}`),
      h('div', { class: 'p-foot' },
        h('span', { class: 'price' }, CHF(p.price)),
        h('button', { class: 'add', type: 'button', 'data-gid': gid, 'data-i': i, 'aria-describedby': nameId },
          h('span', { 'data-i18n': 'btn_add' }))));
  }
  Object.entries(P).forEach(([gid, group]) => {
    const grid = $(`g-${gid}`);
    if (grid) grid.replaceChildren(...group.items.map((p, i) => card(gid, p, i)));
  });

  /* ===================================================== fita de cetim */
  const RIB = (id) => `<svg viewBox="-600 0 3600 132" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="sat${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E4A34"/><stop offset=".16" stop-color="#1C5E45"/><stop offset=".42" stop-color="#0B3B2A"/><stop offset=".72" stop-color="#072D20"/><stop offset="1" stop-color="#0D3F2D"/></linearGradient>
<linearGradient id="sheen${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".12" stop-color="#fff" stop-opacity=".14"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".48" stop-color="#fff" stop-opacity=".1"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/><stop offset=".86" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="gold${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B8905A"/><stop offset=".5" stop-color="#E6CB8B"/><stop offset="1" stop-color="#BF975E"/></linearGradient>
<path id="rp${id}" d="M-720,66 C-320,30 -120,102 200,66 S720,30 1040,66 S1560,102 1880,66 S2400,30 2720,66 S3240,102 3720,66"/>
</defs>
<use href="#rp${id}" stroke="url(#sat${id})" stroke-width="60" fill="none"/>
<use href="#rp${id}" stroke="url(#sheen${id})" stroke-width="60" fill="none"/>
<use href="#rp${id}" stroke="#D3AC66" stroke-opacity=".6" stroke-width="1.3" stroke-dasharray="1.6 3.2" fill="none" transform="translate(0,-27)"/>
<use href="#rp${id}" stroke="#D3AC66" stroke-opacity=".6" stroke-width="1.3" stroke-dasharray="1.6 3.2" fill="none" transform="translate(0,27)"/>
<text font-family="Cormorant Garamond,serif" font-size="22" font-weight="500" letter-spacing="7" fill="url(#gold${id})" dominant-baseline="middle"><textPath href="#rp${id}" startOffset="0" textLength="9600" lengthAdjust="spacing">${'VALORA<tspan font-family="Montserrat,sans-serif" font-size="8.5" letter-spacing="4.5" dy="6"> SUISSE</tspan><tspan dy="-6">   ✦   </tspan>'.repeat(32)}<animate attributeName="startOffset" values="0;-300" dur="18s" repeatCount="indefinite"/></textPath></text>
</svg>`;
  // Marcação constante (sem dados), por isso o innerHTML aqui é seguro.
  const ribbons = [...document.querySelectorAll('.ribbon')].map((r, i) => { r.innerHTML = RIB(i); return r.firstElementChild; });

  /* ===================================================== vídeo do hero e pausa */
  const hero = document.querySelector('.hero');
  const video = $('heroVideo');
  const motionBtn = $('motionToggle');
  const mqMobile = window.matchMedia('(max-width: 767px)');
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  let paused = reduceMotion.matches || saveData;
  let heroVisible = true;
  video.muted = true;

  function loadVideo() {
    const want = mqMobile.matches ? 'mobile' : 'desktop';
    if (video.dataset.src === want) return;
    video.dataset.src = want;
    video.replaceChildren(...(want === 'mobile'
      ? [h('source', { src: 'assets/hero-mobile.mp4', type: 'video/mp4' })]
      : [h('source', { src: 'assets/hero-desktop.webm', type: 'video/webm' }), h('source', { src: 'assets/hero-desktop.mp4', type: 'video/mp4' })]));
    video.load();
  }
  function playVideo() {
    if (paused || !heroVisible) return;
    loadVideo();
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }
  function updateMotionLabel() {
    motionBtn.dataset.state = paused ? 'paused' : 'playing';
    motionBtn.setAttribute('aria-label', t(paused ? 'motion_play' : 'motion_pause'));
  }
  function setPaused(p) {
    paused = p;
    ribbons.forEach((s) => { try { if (p) s.pauseAnimations(); else s.unpauseAnimations(); } catch (e) { /* sem SMIL */ } });
    if (p) video.pause(); else playVideo();
    updateMotionLabel();
  }
  motionBtn.addEventListener('click', () => setPaused(!paused));
  mqMobile.addEventListener('change', () => { if (video.dataset.src) { loadVideo(); playVideo(); } });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) playVideo(); else video.pause();
    }).observe(hero);
  } else {
    playVideo();
  }
  if (paused) ribbons.forEach((s) => { try { s.pauseAnimations(); } catch (e) { /* sem SMIL */ } });

  /* ===================================================== diálogos (menu, carrinho, checkout) */
  const dialogs = { menu: $('menu'), drawer: $('drawer'), checkout: $('checkout') };
  function openDialog(d, opener) {
    d.opener = opener === undefined ? document.activeElement : opener;
    if (!d.open) d.showModal();
    const ctl = document.querySelector(`[aria-controls="${d.id}"]`);
    if (ctl) ctl.setAttribute('aria-expanded', 'true');
  }
  Object.values(dialogs).forEach((d) => {
    d.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) { d.close(); return; }
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
    });
    d.addEventListener('close', () => {
      const ctl = document.querySelector(`[aria-controls="${d.id}"]`);
      if (ctl) ctl.setAttribute('aria-expanded', 'false');
      const o = d.opener;
      d.opener = null;
      if (o && document.contains(o) && o.offsetParent !== null) o.focus();
    });
  });

  // Menu do celular: fecha e leva o foco até a seção escolhida.
  $('openMenu').addEventListener('click', (e) => openDialog(dialogs.menu, e.currentTarget));
  dialogs.menu.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    dialogs.menu.opener = null;
    dialogs.menu.close();
    if (!target) return;
    history.replaceState(null, '', a.getAttribute('href'));
    target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ===================================================== carrinho */
  let cart = []; // { key, gid, i, qty }
  const cartStatus = $('cartStatus');
  const item = (c) => P[c.gid].items[c.i];
  const label = (c) => `${t(P[c.gid].cat)} ${item(c).name}`;
  const total = () => cart.reduce((s, c) => s + item(c).price * c.qty, 0);

  function renderCart(focusSel) {
    const n = cart.reduce((s, c) => s + c.qty, 0);
    $('cartCount').textContent = String(n);
    $('cartTotal').textContent = CHF(total());
    $('goCheckout').disabled = !cart.length;
    const body = $('cartBody');
    if (!cart.length) {
      body.replaceChildren(h('p', { class: 'empty' }, t('cart_empty')));
    } else {
      body.replaceChildren(...cart.map((c) => {
        const p = item(c);
        const thumb = p.img
          ? h('img', { src: `assets/products/${p.img}-480.jpg`, alt: '', width: 64, height: 80, loading: 'lazy', decoding: 'async' })
          : icon('i-star');
        return h('div', { class: 'it' },
          h('div', { class: 'it-img', 'aria-hidden': 'true' }, thumb),
          h('div', null,
            h('p', { class: 'it-name' }, label(c)),
            h('span', { class: 'it-unit' }, CHF(p.price)),
            h('div', { class: 'qty', role: 'group', 'aria-label': `${t('qty_label')} — ${label(c)}` },
              h('button', { type: 'button', 'data-k': c.key, 'data-q': '-1', 'aria-label': `${t('qty_minus')} — ${label(c)}` }, '−'),
              h('span', null, String(c.qty)),
              h('button', { type: 'button', 'data-k': c.key, 'data-q': '1', 'aria-label': `${t('qty_plus')} — ${label(c)}` }, '+'))),
          h('div', { class: 'it-end' },
            h('span', { class: 'price' }, CHF(p.price * c.qty)),
            h('button', { type: 'button', class: 'rm', 'data-rm': c.key }, t('cart_rm'), h('span', { class: 'sr-only' }, ` — ${label(c)}`))));
      }));
    }
    $('sumItems').replaceChildren(...cart.map((c) => h('div', { class: 's-it' },
      h('span', null, `${label(c)} × ${c.qty}`), h('span', { class: 'price' }, CHF(item(c).price * c.qty)))));
    $('sumSub').textContent = CHF(total());
    $('sumTot').textContent = CHF(total());
    if (focusSel) {
      const el = body.querySelector(focusSel);
      (el || $('cartTitle')).focus();
    }
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.add');
    if (!b) return;
    const gid = b.dataset.gid;
    const i = Number(b.dataset.i);
    const key = `${gid}-${i}`;
    const found = cart.find((c) => c.key === key);
    if (found) found.qty += 1; else cart.push({ key, gid, i, qty: 1 });
    renderCart();
    const txt = b.querySelector('span');
    b.classList.add('is-added');
    txt.textContent = t('btn_added');
    window.setTimeout(() => { b.classList.remove('is-added'); txt.textContent = t('btn_add'); }, 1200);
    openDialog(dialogs.drawer, b);
    $('cartTitle').focus();
    announce(cartStatus, fmt('s_added', { n: P[gid].items[i].name }));
  });

  $('openCart').addEventListener('click', (e) => {
    openDialog(dialogs.drawer, e.currentTarget);
    $('cartTitle').focus();
  });

  $('cartBody').addEventListener('click', (e) => {
    const q = e.target.closest('[data-q]');
    const r = e.target.closest('[data-rm]');
    if (q) {
      const c = cart.find((x) => x.key === q.dataset.k);
      if (!c) return;
      c.qty += Number(q.dataset.q);
      if (c.qty <= 0) {
        cart = cart.filter((x) => x !== c);
        renderCart('#cartTitle');
        announce(cartStatus, fmt('s_removed', { n: item(c).name }));
      } else {
        renderCart(`[data-k="${c.key}"][data-q="${q.dataset.q}"]`);
        announce(cartStatus, fmt('s_qty', { n: item(c).name, q: c.qty }));
      }
    } else if (r) {
      const c = cart.find((x) => x.key === r.dataset.rm);
      if (!c) return;
      cart = cart.filter((x) => x !== c);
      renderCart('#cartTitle');
      announce(cartStatus, fmt('s_removed', { n: item(c).name }));
    }
  });

  /* ===================================================== checkout (demonstração) */
  const steps = dialogs.checkout.querySelector('.steps');
  $('goCheckout').addEventListener('click', () => {
    if (!cart.length) return;
    dialogs.drawer.opener = null;
    dialogs.drawer.close();
    $('checkoutView').hidden = false;
    $('doneView').hidden = true;
    steps.hidden = false;
    openDialog(dialogs.checkout, $('openCart'));
    $('coFirst').focus();
  });
  $('coForm').addEventListener('submit', (e) => {
    e.preventDefault();
    $('checkoutView').hidden = true;
    $('doneView').hidden = false;
    steps.hidden = true; // a demonstração termina antes do pagamento
    dialogs.checkout.scrollTop = 0;
    cart = [];
    renderCart();
    $('doneTitle').focus();
  });
  $('backHome').addEventListener('click', () => {
    dialogs.checkout.opener = null;
    dialogs.checkout.close();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    $('main').focus({ preventScroll: true });
  });

  /* ===================================================== idioma */
  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => { el.alt = t(el.dataset.i18nAlt); });
    document.querySelectorAll('[data-wa]').forEach((a) => { a.href = `${WA}?text=${encodeURIComponent(t(`wa_${a.dataset.wa}`))}`; });
  }
  function setLang(l, persist) {
    if (!LANGS.includes(l)) l = 'fr';
    LANG = l;
    document.documentElement.lang = HTML_LANG[l];
    document.title = t('doc_title');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t('doc_desc'));
    applyI18n();
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    updateMotionLabel();
    renderCart();
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
