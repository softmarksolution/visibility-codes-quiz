/* Checkout — personalises the Action Plan to the buyer's primary visibility gap. */
(function () {
  'use strict';
  var V = window.VC;

  /* ---- who is this, and what is their gap? ---- */
  var name = '', answers = null;
  var m = (window.location.hash || '').match(/[#&]r=([A-Za-z0-9_\-]+)/);
  if (m) {
    var d = V.decodeReport(m[1]);
    if (d) { name = d.name; answers = d.answers; }
  }
  if (!answers) {
    answers = V.read(V.ANS_KEY);
    var lead = V.read(V.LEAD_KEY);
    if (lead && lead.name) name = lead.name.split(' ')[0];
  }
  var res = answers ? V.computeResults(answers) : null;

  var back = document.getElementById('coBack');
  back.setAttribute('href', 'results.html' + (m ? '#r=' + m[1] : ''));

  if (res) {
    var gap = res.primaryGap;                    // direction | recognition | ...
    var gapName = V.PILLAR_NAMES[gap];
    document.getElementById('coArt').src = 'assets/plan-' + gap + '.jpg';
    document.getElementById('coArt').alt = 'Visibility Action Plan — ' + gapName + ' Edition';
    document.getElementById('coArtCap').textContent = gapName + ' Edition';
    document.getElementById('coSub').innerHTML =
      'Built around your biggest visibility gap: <em>' + gapName + '</em>' +
      ' &mdash; ' + res.pillars[gap].display + '%.';
    if (name) {
      document.getElementById('coEyebrow').textContent = name + ', your personalised next step';
    }
    document.title = 'Visibility Action Plan — ' + gapName + ' Edition | The Visibility Codes';
  } else {
    /* No result means there is no gap to build a plan around, so don't offer a
       purchase — and don't leave the default Direction cover on screen implying
       an edition we cannot actually personalise. */
    document.body.classList.add('co--noresult');
    document.getElementById('coArtCap').textContent = 'Personalised to your result';
    document.getElementById('coArt').alt = 'Visibility Action Plan';
    document.getElementById('coSub').innerHTML =
      'Your Action Plan is built around the visibility gap your assessment finds, ' +
      'so we need your results first &mdash; it takes about 3 minutes.';
    var pay = document.getElementById('coPay');
    pay.textContent = 'Take the 3-minute assessment';
    pay.addEventListener('click', function () { window.location.href = 'index.html'; });
    document.querySelector('.co__fine').innerHTML =
      'Already taken it? Open the results link we emailed you and press ' +
      '&ldquo;Unlock my personalised action plan&rdquo;.';
  }

  /* ---- the free add-on never changes the price, but keep the total honest ---- */
  var waitlist = document.getElementById('waitlist');
  var total = document.getElementById('coTotal');
  function sync() {
    total.textContent = waitlist.checked ? '$35 USD' : '$35 USD';
  }
  waitlist.addEventListener('change', sync);
  sync();

  /* =====================================================================
     PAYMENT
     ---------------------------------------------------------------------
     There are two modes and you never switch them by hand:

       STRIPE_KEY empty  ->  DEMO PAYMENT. A card box with four fixed test
                             numbers, so the whole funnel can be walked end to
                             end. Nothing is stored, sent, or charged.
       STRIPE_KEY set    ->  LIVE PAYMENT. Stripe mounts its own iframe, card
                             data never touches this page, and the demo card
                             is gone. Nothing else to change.

     TO GO LIVE
       1. put your publishable key (pk_live_… / pk_test_…) in STRIPE_KEY
       2. create a server endpoint that makes a $35 USD PaymentIntent and
          returns its client_secret, and put its URL in INTENT_URL
     That is the whole switch-over. Using GoHighLevel's order form instead?
     Point `openPay` at the order-form URL and ignore all of this.

     ALLOW_DEMO = false turns the demo off even while STRIPE_KEY is empty —
     the checkout then says payments are not connected yet.
     ===================================================================== */
  var STRIPE_KEY = '';                      // e.g. 'pk_live_...'
  var INTENT_URL = '/api/create-payment-intent';
  var AMOUNT_CENTS = 3500, CURRENCY = 'USD';
  var ALLOW_DEMO = true;

  /* Demo stands in only while no real key exists, so a live site can never
     serve it by accident: the moment STRIPE_KEY is filled in, this is false. */
  var demoMode = ALLOW_DEMO && !STRIPE_KEY;

  var modal   = document.getElementById('payModal');
  var form    = document.getElementById('payForm');
  var submit  = document.getElementById('paySubmit');
  var cardBox = document.getElementById('payCard');
  var notice  = document.getElementById('payUnconfigured');
  var lastFocused = null, stripe = null, cardEl = null;

  function money(c) { return '$' + (c / 100).toFixed(2); }

  function order() {
    var lead = V.read(V.LEAD_KEY) || {};
    return {
      product: 'visibility-action-plan',
      edition: res ? res.primaryGap : null,
      amount: AMOUNT_CENTS, currency: CURRENCY,
      masterclassWaitlist: waitlist.checked,
      customer: {
        name: document.getElementById('payName').value.trim() || lead.name || name,
        email: document.getElementById('payEmail').value.trim() || lead.email || '',
        phone: lead.phone || ''
      },
      report: m ? m[1] : null,
      score: res ? res.score : null
    };
  }

  /* ---- open / close ---- */
  function openPay() {
    lastFocused = document.activeElement;
    var lead = V.read(V.LEAD_KEY) || {};
    document.getElementById('payName').value  = lead.name || name || '';
    document.getElementById('payEmail').value = lead.email || '';
    document.getElementById('paySku').textContent =
      res ? 'Visibility Action Plan \u2014 ' + V.PILLAR_NAMES[res.primaryGap] + ' Edition'
          : 'Visibility Action Plan';
    document.getElementById('payWaitRow').hidden = !waitlist.checked;
    submit.textContent = 'Pay ' + money(AMOUNT_CENTS) + ' ' + CURRENCY;
    document.getElementById('payTestBanner').hidden = !demoMode;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    mountCard();
    setTimeout(function () { document.getElementById('payName').focus(); }, 60);
  }
  function closePay() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  if (res) document.getElementById('coPay').addEventListener('click', openPay);
  Array.prototype.forEach.call(modal.querySelectorAll('[data-pay-close]'), function (el) {
    el.addEventListener('click', closePay);
  });
  document.addEventListener('keydown', function (e) {
    if (!modal.hidden && e.key === 'Escape') closePay();
  });

  /* ---- mount the processor's card field ---- */
  function finish() {
    var o = order();
    window.location.href = 'thank-you.html?paid=1' +
      '&edition=' + encodeURIComponent(o.edition || '') +
      '&waitlist=' + (o.masterclassWaitlist ? '1' : '0') +
      (o.report ? '&r=' + encodeURIComponent(o.report) : '');
  }

  /* ---- demo card -------------------------------------------------------
     In live mode the processor mounts its own iframe here and no card data
     ever touches this page. These inputs stand in ONLY while STRIPE_KEY is
     empty, so the funnel can be walked end to end before Stripe is connected.

     They accept nothing but the fixed demo numbers below. Nothing is stored,
     nothing is transmitted, and autocomplete is off so the browser never
     offers a real saved card. Do not type a real card number here.
     `ALLOW_DEMO = false`, or any real STRIPE_KEY, removes all of this.      */
  var DEMO_CARDS = {
    '4242424242424242': { ok: true },
    '4000000000000002': { ok: false, msg: 'Your card was declined. (demo)' },
    '4000000000009995': { ok: false, msg: 'Insufficient funds. (demo)' },
    '4000000000000069': { ok: false, msg: 'Your card has expired. (demo)' }
  };
  function demoDigits() {
    var el = document.getElementById('dcNum');
    return el ? el.value.replace(/\D/g, '') : '';
  }
  function buildDemoCard() {
    cardBox.classList.add('is-demo');
    cardBox.innerHTML =
      '<div class="dcard">' +
        '<input id="dcNum" class="dcard__num" type="text" inputmode="numeric" autocomplete="off" ' +
               'spellcheck="false" maxlength="19" placeholder="4242 4242 4242 4242" aria-label="Demo card number">' +
        '<input id="dcExp" class="dcard__sm" type="text" inputmode="numeric" autocomplete="off" ' +
               'maxlength="7" placeholder="12 / 34" aria-label="Demo expiry">' +
        '<input id="dcCvc" class="dcard__sm" type="text" inputmode="numeric" autocomplete="off" ' +
               'maxlength="4" placeholder="123" aria-label="Demo CVC">' +
      '</div>' +
      '<div class="dcard__pick">' +
        '<button type="button" data-card="4242424242424242">Approve</button>' +
        '<button type="button" data-card="4000000000000002">Decline</button>' +
        '<button type="button" data-card="4000000000009995">No funds</button>' +
        '<button type="button" data-card="4000000000000069">Expired</button>' +
      '</div>' +
      '<p class="dcard__note">Demo only &mdash; these buttons fill a test number. ' +
      'Never enter a real card.</p>';

    var num = document.getElementById('dcNum');
    num.addEventListener('input', function () {
      var d = num.value.replace(/\D/g, '').slice(0, 16);
      num.value = d.replace(/(.{4})/g, '$1 ').trim();
      setError('payCard', '');
    });
    Array.prototype.forEach.call(cardBox.querySelectorAll('.dcard__pick button'), function (b) {
      b.addEventListener('click', function () {
        num.value = b.getAttribute('data-card').replace(/(.{4})/g, '$1 ').trim();
        document.getElementById('dcExp').value = '12 / 34';
        document.getElementById('dcCvc').value = '123';
        setError('payCard', '');
      });
    });
  }

  function mountCard() {
    if (demoMode) {
      if (!cardBox.querySelector('.dcard')) buildDemoCard();
      notice.hidden = true;
      submit.disabled = false;
      /* the live reassurance line is untrue in demo mode — there is no
         processor behind these fields — so say what is actually happening */
      var sec = modal.querySelector('.pay__secure');
      if (sec && !sec.dataset.demo) {
        sec.dataset.demo = '1';
        sec.lastChild.textContent =
          ' Demo mode \u2014 no payment provider is connected. Nothing you type here ' +
          'is stored or sent anywhere, and no money can move.';
      }
      return;
    }
    if (cardEl || !STRIPE_KEY) {
      if (!STRIPE_KEY) submit.disabled = true;
      return;
    }
    notice.hidden = true;
    var sc = document.createElement('script');
    sc.src = 'https://js.stripe.com/v3/';
    sc.onload = function () {
      stripe = window.Stripe(STRIPE_KEY);
      cardEl = stripe.elements().create('card', {
        style: { base: { fontFamily: 'Montserrat, sans-serif', fontSize: '15px', color: '#14161A' } }
      });
      cardEl.mount('#payCard');
      cardBox.classList.add('is-ready');
      submit.disabled = false;
    };
    sc.onerror = function () { setError('payCard', 'Could not load the payment form. Please try again.'); };
    document.head.appendChild(sc);
  }

  /* ---- validation ---- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(id, msg) {
    var box = form.querySelector('[data-err-for="' + id + '"]');
    if (box) box.textContent = msg || '';
    var input = document.getElementById(id);
    if (input && input.tagName === 'INPUT') {
      if (msg) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }
  Array.prototype.forEach.call(form.querySelectorAll('input'), function (i) {
    i.addEventListener('input', function () { if (i.getAttribute('aria-invalid')) setError(i.id, ''); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nm = document.getElementById('payName'), em = document.getElementById('payEmail');
    var ok = true, first = null;
    if (!nm.value.trim()) { setError('payName', 'Please enter your name.'); ok = false; first = nm; }
    else setError('payName', '');
    if (!EMAIL.test(em.value.trim())) { setError('payEmail', 'Please enter a valid email address.'); ok = false; first = first || em; }
    else setError('payEmail', '');
    if (!ok) { first.focus(); return; }

    if (demoMode) {
      var digits = demoDigits();
      if (!digits) { setError('payCard', 'Enter a demo card, or press one of the buttons.'); return; }
      var card = DEMO_CARDS[digits];
      if (!card) {
        setError('payCard', 'Demo mode only accepts the four test cards above.');
        return;
      }
      setError('payCard', '');
      submit.disabled = true; submit.classList.add('is-busy');
      submit.textContent = 'Processing\u2026';
      setTimeout(function () {
        if (card.ok) {
          console.log('[checkout] DEMO \u2014 approved, nothing charged:', order());
          finish();
          return;
        }
        setError('payCard', card.msg);
        submit.disabled = false; submit.classList.remove('is-busy');
        submit.textContent = 'Pay ' + money(AMOUNT_CENTS) + ' ' + CURRENCY;
      }, 900);
      return;
    }
    if (!STRIPE_KEY) {
      setError('payCard', 'Payments are not connected yet — see checkout.js.');
      console.log('[checkout] order ready for the payment processor:', order());
      return;
    }

    submit.disabled = true; submit.classList.add('is-busy');
    submit.textContent = 'Processing\u2026';

    fetch(INTENT_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order())
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.clientSecret) throw new Error('no client secret');
        return stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardEl,
            billing_details: { name: nm.value.trim(), email: em.value.trim() }
          }
        });
      })
      .then(function (result) {
        if (result.error) throw result.error;
        finish();
      })
      .catch(function (err) {
        setError('payCard', (err && err.message) || 'Payment could not be completed. Please try again.');
        submit.disabled = false; submit.classList.remove('is-busy');
        submit.textContent = 'Pay ' + money(AMOUNT_CENTS) + ' ' + CURRENCY;
      });
  });
})();
