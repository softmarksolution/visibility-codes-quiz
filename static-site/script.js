/* The Visibility Codes — scroll reveals + gauge animation */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nodes = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduce || !('IntersectionObserver' in window)) {
    nodes.forEach(function (n) { n.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  nodes.forEach(function (n) { io.observe(n); });

  /* fail-safe: never leave content invisible if the observer misses something
     (very tall viewports, print, restored scroll position, ...) */
  setTimeout(function () {
    nodes.forEach(function (n) { n.classList.add('in'); });
  }, 2500);

  /* sweep the gauge arcs + needle in when the card first appears */
  var gauge = document.querySelector('.gauge');
  if (!gauge) return;

  var arcs = gauge.querySelectorAll('.arc');
  var needle = gauge.querySelector('.gauge__needle');
  var LEN = 386.4;                       // π × r(123)
  var stops = [0, 50, 88, 100];          // segment edges

  arcs.forEach(function (a, i) {
    var start = stops[i] / 100 * LEN;
    a.style.strokeDasharray = '0 ' + LEN;
    a.style.strokeDashoffset = '-' + start;
  });
  if (needle) {
    needle.style.transition = 'transform 1.6s cubic-bezier(.3,.8,.35,1)';
    needle.style.transform = 'rotate(-158.4deg)';
  }

  var gio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      arcs.forEach(function (a, i) {
        var len = (stops[i + 1] - stops[i]) / 100 * LEN;
        a.style.strokeDasharray = len.toFixed(1) + ' ' + LEN;
      });
      if (needle) needle.style.transform = 'rotate(0deg)';
      gio.unobserve(e.target);
    });
  }, { threshold: 0.35 });

  gio.observe(gauge);
})();

/* ---------------------------------------------------------
   Lead capture modal — every quiz CTA opens it first
   --------------------------------------------------------- */
(function () {
  'use strict';

  var modal = document.getElementById('leadModal');
  var form = document.getElementById('leadForm');
  if (!modal || !form) return;

  var lastFocused = null;
  var FOCUSABLE = 'button, input, [href], textarea, select, [tabindex]:not([tabindex="-1"])';

  function open(e) {
    if (e) e.preventDefault();
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = form.querySelector('input');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    clearErrors();
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* every CTA that points at the quiz opens the modal instead */
  /* These point at quiz-cover.html so a middle-click, a new tab or a visitor
     with JavaScript off still lands somewhere real; with JS on we intercept
     and take the details first. */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="quiz-cover.html"]'), function (a) {
    a.addEventListener('click', open);
  });

  Array.prototype.forEach.call(modal.querySelectorAll('[data-close]'), function (el) {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    // keep focus inside the dialog
    var items = Array.prototype.filter.call(
      modal.querySelectorAll(FOCUSABLE),
      function (el) { return el.offsetParent !== null; }
    );
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---- validation ---- */
  function setError(input, message) {
    var box = form.querySelector('[data-err-for="' + input.id + '"]');
    if (box) box.textContent = message || '';
    if (message) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
  function clearErrors() {
    Array.prototype.forEach.call(form.querySelectorAll('input'), function (i) { setError(i, ''); });
  }

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate() {
    var name = form.elements.name, email = form.elements.email, phone = form.elements.phone;
    var ok = true, firstBad = null;

    if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; firstBad = firstBad || name; }
    else setError(name, '');

    if (!EMAIL.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.'); ok = false; firstBad = firstBad || email;
    } else setError(email, '');

    var digits = phone.value.replace(/\D/g, '');
    if (digits.length < 7) {
      setError(phone, 'Please enter a valid phone number.'); ok = false; firstBad = firstBad || phone;
    } else setError(phone, '');

    if (firstBad) firstBad.focus();
    return ok;
  }

  Array.prototype.forEach.call(form.querySelectorAll('input'), function (input) {
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid')) setError(input, '');
    });
  });

  /* -------------------------------------------------------------------
     Exit intent — the brief pairs this with the same opt-in pop-up
     ("HERO PAGE OPT IN POP UP / EXIT INTENT POP UP - EXAMPLE"), so it
     reuses the modal above rather than introducing a second one.

     Deliberately restrained: once per visitor, never for someone who has
     already given their details, and not for the first few seconds.
     ------------------------------------------------------------------- */
  var SEEN_KEY = 'vc_exit_shown';
  var armed = false;

  function alreadyCaptured() {
    return !!(window.VC && window.VC.read(window.VC.LEAD_KEY));
  }
  function seen() {
    try { return localStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
  }

  function maybeOpen() {
    if (!armed || seen() || alreadyCaptured() || !modal.hidden) return;
    markSeen();
    open();
  }

  if (!seen() && !alreadyCaptured()) {
    setTimeout(function () { armed = true; }, 5000);

    /* desktop: pointer leaves through the top of the window */
    document.addEventListener('mouseout', function (e) {
      if (e.clientY > 0) return;
      if (e.relatedTarget || e.toElement) return;   // moved to another element, not out
      maybeOpen();
    });

    /* laptops with a trackpad often trigger a fast flick to the top instead */
    var lastY = window.scrollY, lastT = Date.now();
    window.addEventListener('scroll', function () {
      var y = window.scrollY, t = Date.now(), dt = t - lastT;
      if (dt > 0 && lastY > 600 && y < 200 && (lastY - y) / dt > 2.5) maybeOpen();
      lastY = y; lastT = t;
    }, { passive: true });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    var lead = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      at: new Date().toISOString()
    };

    // Stored locally so the quiz and report can personalise. Wire your CRM here.
    if (window.VC) {
      window.VC.store(window.VC.LEAD_KEY, lead);
      window.VC.store(window.VC.ANS_KEY, {});
    }

    window.location.href = 'quiz-cover.html';
  });
})();
