/* ════════════════════════════════════════════════════════════════
   INTEGRA PSICANÁLISE — Landing Page JavaScript
   landing.js — Scripts exclusivos da landing page de conversão

   Funções:
   1. initLpReveal()        — animação reveal ao rolar (IntersectionObserver)
   2. initLpFaqAccordion()  — perguntas frequentes colapsáveis
   3. initLpBackToTop()     — botão voltar ao topo
   4. initLpWhatsAppFloat() — animação de atenção no botão WhatsApp flutuante
   ════════════════════════════════════════════════════════════════ */

'use strict';


/* ════════════════════════════════════════════════════════════════
   1. REVEAL ON SCROLL
   Observa elementos-chave da landing e os revela com animação
   suave conforme o usuário rola a página.

   Estratégia: adiciona .reveal apenas a elementos abaixo da
   dobra inicial (bottom > 85% da viewport), evitando o flash
   de ocultação em elementos já visíveis ao carregar a página.
   ════════════════════════════════════════════════════════════════ */
function initLpReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  /* Elementos-alvo da landing page */
  const seletores = [
    '.lp-section-header',
    '.lp-mod-card',
    '.lp-dep-card',
    '.lp-faq-item',
    '.lp-sobre-foto',
    '.lp-sobre-texto',
    '.lp-voto-card',
    '.lp-unid-item',
    '.lp-cta-final-inner',
    '.lp-trust'
  ].join(', ');

  document.querySelectorAll(seletores).forEach(el => {
    const rect = el.getBoundingClientRect();

    /* Aplica reveal somente a elementos abaixo da dobra inicial */
    if (rect.top > window.innerHeight * 0.85) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });
}


/* ════════════════════════════════════════════════════════════════
   2. FAQ ACCORDION
   Torna cada .lp-faq-item colapsável: clique no h3 abre/fecha
   a resposta (p). Apenas 1 item fica aberto por vez.
   ════════════════════════════════════════════════════════════════ */
function initLpFaqAccordion() {
  const items = document.querySelectorAll('.lp-faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const h3 = item.querySelector('h3');
    const p  = item.querySelector('p');
    if (!h3 || !p) return;

    /* Acessibilidade */
    h3.setAttribute('role', 'button');
    h3.setAttribute('tabindex', '0');
    h3.setAttribute('aria-expanded', 'false');

    function toggle() {
      const isOpen = item.classList.contains('aberto');

      /* Fecha todos os itens */
      items.forEach(i => {
        i.classList.remove('aberto');
        const ih = i.querySelector('h3');
        if (ih) ih.setAttribute('aria-expanded', 'false');
      });

      /* Abre o clicado (se estava fechado) */
      if (!isOpen) {
        item.classList.add('aberto');
        h3.setAttribute('aria-expanded', 'true');
      }
    }

    h3.addEventListener('click', toggle);
    h3.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* Abre o primeiro item por padrão */
  const first = items[0];
  if (first) {
    first.classList.add('aberto');
    const h3 = first.querySelector('h3');
    if (h3) h3.setAttribute('aria-expanded', 'true');
  }
}


/* ════════════════════════════════════════════════════════════════
   3. BACK TO TOP
   Exibe o botão #lp-back-to-top após 400px de scroll.
   Clique faz scroll suave ao topo.
   ════════════════════════════════════════════════════════════════ */
function initLpBackToTop() {
  const btn = document.getElementById('lp-back-to-top');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ════════════════════════════════════════════════════════════════
   4. WHATSAPP FLOAT — ANIMAÇÃO DE ATENÇÃO
   Faz o botão flutuante "chacoalhar" suavemente para chamar
   atenção do visitante.
   — Primeira animação: 2,5s após o carregamento
   — Repetição: a cada 7s
   ════════════════════════════════════════════════════════════════ */
function initLpWhatsAppFloat() {
  const btn = document.querySelector('.whatsapp-float');
  if (!btn) return;

  /* Garante que a animação não seja repetida se já estiver ativa */
  function wiggle() {
    if (btn.classList.contains('lp-wa-atencao')) return;
    btn.classList.add('lp-wa-atencao');
    btn.addEventListener('animationend', () => {
      btn.classList.remove('lp-wa-atencao');
    }, { once: true });
  }

  /* Não anima se o usuário prefere movimento reduzido */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setTimeout(wiggle, 2500);
  setInterval(wiggle, 7000);
}


/* ════════════════════════════════════════════════════════════════
   5. FLASH DA LOGO NOS BOTÕES
   Ao clicar em qualquer botão (.lp-btn, .lp-btn-voto) injeta
   o símbolo animado da Integra sobre o botão — efeito idêntico
   ao do site principal (initButtonLogoAnimation em main.js).
   ════════════════════════════════════════════════════════════════ */

/* SVG do símbolo da Integra — mesmo visual do page-loader,
   escalado para caber dentro de um botão */
const LP_LOGO_SVG = `<svg class="lp-btn-flash-svg" viewBox="-10 -10 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g class="lp-spin-group">
    <path d="M 44 108 A 58 58 0 1 1 156 108" stroke="#F2E6DF" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M 100 50 Q 128 50 128 75 Q 128 98 100 100 Q 82 100 82 82 Q 82 66 96 64" stroke="#F2E6DF" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9"/>
    <circle cx="100" cy="52"  r="3.5" fill="#F2E6DF"/>
    <circle cx="100" cy="135" r="22"  stroke="#F2E6DF" stroke-width="3.5" fill="none"/>
    <circle cx="100" cy="135" r="11"  stroke="#F2E6DF" stroke-width="2.5" fill="none"/>
    <circle cx="100" cy="135" r="4.5" fill="#A8C640"/>
    <circle cx="100" cy="22"  r="3.5" fill="#F2E6DF" opacity="0.7"/>
    <circle cx="178" cy="105" r="3.5" fill="#F2E6DF" opacity="0.7"/>
    <circle cx="100" cy="190" r="4"   fill="#F2E6DF" opacity="0.7"/>
  </g>
  <circle class="lp-ring-pulse" cx="100" cy="100" r="90" stroke="#F2E6DF" stroke-width="1" fill="none" opacity="0.15"/>
</svg>`;

/**
 * Injeta o mini-logo animado dentro de um botão ao ser clicado.
 * Remove qualquer flash anterior antes de criar o novo.
 * @param {Element} btn — o botão alvo
 */
function triggerLpBtnFlash(btn) {
  if (!btn) return;

  /* Garante posicionamento relativo e clip para o overlay */
  const cs = window.getComputedStyle(btn);
  if (cs.position === 'static') btn.style.position = 'relative';
  if (cs.overflow === 'visible') btn.style.overflow = 'hidden';

  /* Remove flash anterior se ainda estiver visível */
  const old = btn.querySelector('.lp-btn-logo-flash');
  if (old) old.remove();

  /* Cria e injeta o elemento de flash */
  const flash = document.createElement('span');
  flash.className = 'lp-btn-logo-flash';
  flash.innerHTML = LP_LOGO_SVG;
  btn.appendChild(flash);

  /* Auto-remove ao fim da animação */
  flash.addEventListener('animationend', () => flash.remove(), { once: true });
}

function initLpButtonFlash() {
  /* Seleciona todos os botões e CTAs da landing page */
  const botoes = document.querySelectorAll('.lp-btn, .lp-btn-voto, .lp-header-cta');

  botoes.forEach(btn => {
    btn.addEventListener('click', function() {
      triggerLpBtnFlash(this);
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   INICIALIZAÇÃO — aguarda o DOM estar pronto
   ════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLpReveal();         // 1. animações de entrada ao rolar
  initLpFaqAccordion();   // 2. FAQ colapsável
  initLpBackToTop();      // 3. botão voltar ao topo
  initLpWhatsAppFloat();  // 4. animação de atenção no WhatsApp
  initLpButtonFlash();    // 5. flash da logo nos botões
});
