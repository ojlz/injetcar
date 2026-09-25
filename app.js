/* ============ MotorFix — app.js ============ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WA_NUMBER = '5500090000004';
  var WA = 'https://wa.me/' + WA_NUMBER + '?text=';

  /* ---- Links de WhatsApp com mensagem pronta (data-wa) ---- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.addEventListener('click', function () {
      var msg = a.getAttribute('data-wa') || 'Olá! Vim pelo site da MotorFix.';
      a.href = WA + encodeURIComponent(msg);
    });
  });

  /* ---- Menu mobile ---- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('mainNav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* ---- Header, barra de progresso, voltar ao topo, parallax ---- */
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  var toTop = document.getElementById('toTop');
  var orbs = document.querySelectorAll('[data-parallax]');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 12);

    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

    toTop.classList.toggle('show', y > 700);

    if (!reduced) {
      orbs.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = 'translateY(' + y * f + 'px)';
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---- Reveal on scroll (com stagger via --d) ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---- Contadores animados ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduced || isNaN(target)) {
      el.textContent = String(el.getAttribute('data-count')).replace('.', ',') + suffix;
      return;
    }
    var dur = 1400, t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec).replace('.', ',') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---- Filtro de serviços ---- */
  var fbtns = document.querySelectorAll('#filters .fbtn');
  var cards = document.querySelectorAll('#svcGrid .svc');
  fbtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      fbtns.forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var f = btn.getAttribute('data-f');
      cards.forEach(function (c) {
        var show = (f === 'all' || c.getAttribute('data-cat') === f);
        c.classList.remove('pop');
        c.classList.toggle('hide', !show);
        if (show && !reduced) { void c.offsetWidth; c.classList.add('pop'); }
      });
    });
  });

  /* ---- FAQ sanfona (uma aberta por vez) ---- */
  document.querySelectorAll('#faq details').forEach(function (det) {
    var ans = det.querySelector('.ans');
    det.querySelector('summary').addEventListener('click', function (ev) {
      ev.preventDefault();
      var isOpen = det.classList.contains('open');
      document.querySelectorAll('#faq details.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.ans').style.maxHeight = '0px';
        o.removeAttribute('open');
      });
      if (!isOpen) {
        det.setAttribute('open', '');
        det.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---- Link ativo do menu por seção ---- */
  var links = document.querySelectorAll('.nav a.nl');
  var secs = ['oficina', 'servicos', 'visita', 'duvidas', 'contato']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && secs.length) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(function (s) { nio.observe(s); });
  }

  /* ---- Tilt sutil no hero (desktop com hover) ---- */
  var tilt = document.getElementById('tilt');
  if (tilt && !reduced && window.matchMedia('(hover:hover)').matches) {
    tilt.parentElement.addEventListener('mousemove', function (ev) {
      var r = tilt.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'rotateY(' + x * 7 + 'deg) rotateX(' + -y * 7 + 'deg)';
    });
    tilt.parentElement.addEventListener('mouseleave', function () {
      tilt.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

  /* ---- Selo "aberto agora": recalculado em tempo real ---- */
  var openEl = document.getElementById('openNow');
  function updateOpen() {
    if (!openEl) return;
    try {
      var now = new Date();
      var day = now.getDay(); // 0=dom .. 6=sab
      var mins = now.getHours() * 60 + now.getMinutes();
      var open = false;
      if (day >= 1 && day <= 5) open = mins >= 450 && mins < 1080; // seg-sex 07:30-18h
      else if (day === 6) open = mins >= 450 && mins < 720;        // sab 07:30-12h
      openEl.innerHTML = open
        ? '<i></i> Aberto agora — chame no WhatsApp'
        : '<i style="background:#666;animation:none"></i> Fechado agora — deixe sua mensagem';
    } catch (e) { /* mantém texto padrão */ }
  }
  updateOpen();
  setInterval(updateOpen, 30000);

  /* ---- Ano dinâmico ---- */
  document.getElementById('ano').textContent = new Date().getFullYear();
})();
