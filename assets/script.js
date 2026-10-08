/* KHT DIGITAL — Site oficial, JavaScript sem bibliotecas externas */
(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');
  const header = document.getElementById('header');
  const progress = document.getElementById('scrollProgress');
  const topButton = document.getElementById('backToTop');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    mobileMenu.hidden = true;
  }
  menuToggle.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.hidden = !opening;
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 850) closeMenu(); }, {passive:true});

  let ticking = false;
  function updateScroll() {
    const scrollTop = window.scrollY || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, scrollTop / max * 100)) : 0;
    progress.style.width = `${percent}%`;
    header.classList.toggle('scrolled', scrollTop > 16);
    topButton.classList.toggle('show', scrollTop > 650);
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, {passive:true});
  updateScroll();

  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
      });
    }, {threshold: .07, rootMargin: '0px 0px -25px 0px'});
    reveals.forEach(el => observer.observe(el));
  } else { reveals.forEach(el => el.classList.add('in-view')); }

  const filters = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.project-card');
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(btn => { const selected = btn === button; btn.classList.toggle('active', selected); btn.setAttribute('aria-pressed', String(selected)); });
    cards.forEach(card => {
      const visible = category === 'all' || card.dataset.category === category;
      card.classList.toggle('filtered-out', !visible);
      card.setAttribute('aria-hidden', String(!visible));
      if ('inert' in card) card.inert = !visible;
      card.querySelectorAll('a').forEach(a => { a.tabIndex = visible ? 0 : -1; });
    });
  }));
})();



/* KHT Digital | precificação transparente e orçamento sem backend */
(() => {
  'use strict';
  // ALTERE APENAS ESTES VALORES quando atualizar a tabela de lançamento.
  // Não são preços definitivos de contrato: proposta final é confirmada no direct.
  const CONFIG = Object.freeze({
    instagram: 'https://www.instagram.com/khtdigital/',
    precos: Object.freeze({
      classico: 39,
      interativo: 79,
      premium: 179,
      presente: 149,
      landing: 349
    })
  });
  const currency = amount => amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:0,maximumFractionDigits:0});
  document.querySelectorAll('[data-price]').forEach(el => {
    const n = CONFIG.precos[el.dataset.price];
    if (Number.isFinite(n)) el.textContent = currency(n);
  });
  const form = document.getElementById('quoteForm');
  const service = document.getElementById('service');
  const idea = document.getElementById('projectIdea');
  const hint = document.getElementById('serviceHint');
  const price = document.getElementById('quotePrice');
  const msg = document.getElementById('formMessage');
  const result = document.getElementById('quoteResult');
  const output = document.getElementById('quoteOutput');
  const copyBtn = document.getElementById('copyQuote');
  const priceMap = {
    'Convite Clássico': 'classico',
    'Convite Clássico Interativo': 'interativo',
    'Convite Premium': 'premium',
    'Site-surpresa personalizado': 'presente',
    'Landing page': 'landing'
  };
  const explanations = {
    'Convite Clássico': '1 arte vertical em PNG e PDF simples, até 2 rodadas de ajustes. Prazo estimado: 2–3 dias úteis. Sem botões clicáveis.',
    'Convite Clássico Interativo': '1 página estilo panfleto com WhatsApp e Maps, até 2 rodadas de ajustes. Prazo estimado: 3–5 dias úteis.',
    'Convite Premium': 'Até 5 seções, abertura, contagem regressiva, WhatsApp e Maps; 2 rodadas de ajustes. Prazo estimado: 5–8 dias úteis.',
    'Site-surpresa personalizado': 'Até 5 seções, carta, 2 interações e até 5 imagens autorizadas; 2 rodadas de ajustes. Prazo estimado: 4–7 dias úteis.',
    'Landing page': 'Até 6 seções, contato, chamada para ação e SEO básico; 2 rodadas de ajustes. Prazo estimado: 7–12 dias úteis.',
    'Site institucional': 'Apresentação do negócio com estrutura definida sob orçamento.',
    'Portfólio profissional': 'Página ou site para apresentar seus trabalhos.',
    'Outro projeto digital': 'Conte sua ideia e vamos estudar a melhor solução.'
  };
  function onServiceChange() {
    const value = service.value;
    hint.textContent = explanations[value] || 'Escolha uma opção para ver os detalhes.';
    const key = priceMap[value];
    price.innerHTML = key ? 'Valor de referência: <b>a partir de '+currency(CONFIG.precos[key])+'</b>. O preço final depende dos detalhes e será confirmado na conversa.' : (value ? 'Para este serviço, preparamos um <b>orçamento individual</b> conforme o escopo.' : 'Selecione um serviço para ver o valor de referência.');
    price.classList.toggle('has-price',!!key);
    if (result) result.hidden = true;
  }
  if (service) service.addEventListener('change',onServiceChange);
  document.querySelectorAll('.plan-action[data-service]').forEach(button => button.addEventListener('click', () => {
    service.value = button.dataset.service;
    onServiceChange();
    document.getElementById('orcamento').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    setTimeout(() => service.focus({preventScroll:true}),250);
  }));
  const safe = value => String(value||'').replace(/[\r\n\t]+/g,' ').trim();
  function createSummary() {
    const name = safe(document.getElementById('clientName').value);
    const date = safe(document.getElementById('projectDate').value);
    let dateText = 'A combinar';
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year,month,day] = date.split('-');
      dateText = `${day}/${month}/${year}`;
    }
    const style = safe(document.getElementById('styleChoice').value);
    const budget = safe(document.getElementById('investment').value);
    const key = priceMap[service.value];
    const ref = key ? `Referência no site: a partir de ${currency(CONFIG.precos[key])}` : 'Valor: a definir em orçamento';
    return `Olá, KHT Digital! Gostaria de solicitar um orçamento.\n\n`+
           `• Serviço: ${safe(service.value)}\n`+
           `• Nome: ${name || 'Prefiro informar no direct'}\n`+
           `• Data importante: ${dateText}\n`+
           `• Estilo: ${style}\n`+
           `• Investimento: ${budget}\n`+
           `• ${ref}\n\n`+
           `Minha ideia:\n${idea.value.trim()}\n\n`+
           `Podemos conversar sobre as opções, o prazo e os detalhes?`;
  }
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    msg.classList.remove('error');
    if (!service.value) { msg.textContent='Escolha o tipo de projeto para continuar.'; msg.classList.add('error'); service.focus(); result.hidden=true; return; }
    if (!idea.value.trim() || idea.value.trim().length < 12) { msg.textContent='Conte um pouquinho mais sobre sua ideia (pelo menos 12 caracteres).'; msg.classList.add('error'); idea.focus(); result.hidden=true; return; }
    output.value = createSummary();
    result.hidden = false;
    msg.textContent='Resumo preparado! Agora copie e envie pelo direct.';
    result.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  });
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const text = output.value;
    let copied=false;
    try { if(navigator.clipboard && window.isSecureContext){ await navigator.clipboard.writeText(text);copied=true; } } catch (_) {}
    if(!copied){ output.focus();output.select();try{copied=document.execCommand('copy');}catch(_){} }
    copyBtn.firstChild.textContent=copied?'Copiado! ':'Selecione e copie o texto '; // safe fallback
    msg.textContent = copied ? 'Copiado! Abra o Instagram e cole no direct.' : 'Selecione o texto acima e copie manualmente.';
  });
})();
