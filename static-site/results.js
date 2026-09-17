/* The Visibility Codes — personalised results report */
(function () {
  'use strict';

  var V = window.VC;
  var root = document.getElementById('rsRoot');

  /* ---------------- icons ---------------- */
  var I = {
    direction: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10.2"/><path d="M12 3.3 13.5 10.5 20.7 12 13.5 13.5 12 20.7 10.5 13.5 3.3 12 10.5 10.5Z" fill="currentColor" stroke="none"/><path d="M16.7 7.3 14 10M16.7 16.7 14 14M7.3 16.7 10 14M7.3 7.3 10 10" stroke-width="1"/></svg>',
    recognition: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="8.6" r="6.3"/><path d="m12 5.1 1.12 2.27 2.5.36-1.81 1.76.43 2.49L12 10.81l-2.24 1.17.43-2.49L8.38 7.73l2.5-.36Z" fill="currentColor" stroke="none"/><path d="M8.5 14.3 6.4 21.3l3.4-1.5 2.2 1.5 2.2-1.5 3.4 1.5-2.1-7"/></svg>',
    consistency: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.8 12a8.2 8.2 0 0 1 13.9-5.9"/><path d="M20.2 12a8.2 8.2 0 0 1-13.9 5.9"/><path d="M18.1 2.6v3.8h-3.8M5.9 21.4v-3.8h3.8"/></svg>',
    connection: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="8.2" r="5"/><circle cx="7.7" cy="15.4" r="5"/><circle cx="16.3" cy="15.4" r="5"/></svg>',
    opportunity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"><circle cx="8.9" cy="6.6" r="3.2"/><circle cx="15.1" cy="6.6" r="3.2"/><path d="M12 9.5V21M12 14.9h3.6M12 17.9h2.9"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7a6.4 6.4 0 0 0-3.8 11.5c.5.4.8 1 .8 1.6v.5h6v-.5c0-.6.3-1.2.8-1.6A6.4 6.4 0 0 0 12 2.7Z"/><path d="M9.9 19.1h4.2M10.7 21.5h2.6"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2.6" y="13.2" width="4.4" height="8.2" rx="1.1"/><rect x="9.8" y="8.2" width="4.4" height="13.2" rx="1.1"/><rect x="17" y="3.4" width="4.4" height="18" rx="1.1"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4 22 20.6H2Z"/><path d="M12 9.8v4.4M12 17.4h.01"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10.2"/><path d="M12 3.6 13.4 10.6 20.4 12 13.4 13.4 12 20.4 10.6 13.4 3.6 12 10.6 10.6Z" fill="currentColor" stroke="none"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M14.2 2.6H6.8A1.7 1.7 0 0 0 5.1 4.3v15.4a1.7 1.7 0 0 0 1.7 1.7h10.4a1.7 1.7 0 0 0 1.7-1.7V7.4Z"/><path d="M14.2 2.6v4.8H19"/><path d="M8.5 12.4h7M8.5 15.9h7"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="m7.7 12.4 3 3 5.6-6.3"/></svg>',
    compass: '<svg viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="43" stroke="currentColor" stroke-width="1.8" opacity=".5"/><circle cx="60" cy="60" r="52" stroke="currentColor" stroke-width="1" opacity=".22"/><path d="M60 10 65.5 54.5 110 60 65.5 65.5 60 110 54.5 65.5 10 60 54.5 54.5Z" fill="currentColor"/><path d="M87 33 65.6 54.4M87 87 65.6 65.6M33 87 54.4 65.6M33 33 54.4 54.4" stroke="currentColor" stroke-width="2.2" opacity=".45"/></svg>'
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- load the report ---------------- */
  var name = '', answers = null;

  var hash = window.location.hash || '';
  var m = hash.match(/[#&]r=([A-Za-z0-9_\-]+)/);
  if (m) {
    var decoded = V.decodeReport(m[1]);
    if (decoded) { name = decoded.name; answers = decoded.answers; }
  }
  if (!answers) {
    answers = V.read(V.ANS_KEY);
    var lead = V.read(V.LEAD_KEY);
    if (lead && lead.name) name = lead.name.split(' ')[0];
  }

  var res = answers ? V.computeResults(answers) : null;

  if (!res) {
    root.innerHTML =
      '<div class="rs__invalid">' +
        '<h1>This report link isn&rsquo;t valid</h1>' +
        '<p>The link may have been cut short when it was copied. You can take the assessment again to get your score.</p>' +
        '<a class="btn btn--gold" href="index.html">Take the assessment</a>' +
      '</div>';
    return;
  }

  /* ---------------- build ---------------- */
  var C = V.COPY, PC = V.PILLAR_COPY, N = V.PILLAR_NAMES;
  var gapName = N[res.primaryGap];
  var strongName = N[res.strongest];

  var means = C.whatThisMeans[res.level].replace('{gap}', '<em>' + esc(gapName) + ' Gap</em>');

  function metric(icon, label, value) {
    return '<div class="metric">' +
      '<span class="metric__ico">' + icon + '</span>' +
      '<span class="metric__name">' + esc(label) + '</span>' +
      '<span class="metric__dots"></span>' +
      '<span class="metric__val">' + esc(value) + '</span></div>';
  }

  var html = '';

  html += '<p class="rs__eyebrow">' + esc(C.eyebrow) + '</p>';
  html += '<h1 class="rs__title">' +
    (name ? esc(name) + ', here are your results.' : 'Here are your results.') + '</h1>';
  html += '<p class="rs__intro">Your assessment has identified how effectively you are currently ' +
    'positioned to be seen, recognised, remembered and <em>chosen</em> for opportunities.</p>';

  /* summary card */
  html += '<section class="rcard summary">' +
    '<div class="summary__grid">' +
      '<div class="summary__left">' +
        '<p class="summary__label">' + esc(C.scoreTitle) + '</p>' +
        '<p class="summary__score" id="scoreNum">0<span>/100</span></p>' +
        '<p class="summary__level">' + esc(res.level) + '</p>' +
      '</div>' +
      '<div class="metrics">' +
        metric(I.star, 'Visibility Gap', res.gap + '%') +
        /* "Visibility Gap Rating" belongs here, but the client has not defined
           its bands — see the note in quiz-data.js. Restore this line once they do:
           metric(I.chart, 'Visibility Gap Rating', res.gapRating) + */
        metric(I.warn, 'Primary Visibility Blocker', gapName + ' Gap') +
        metric(I.star, 'Strongest Visibility Area', strongName) +
      '</div>' +
    '</div>' +
    '<div class="means">' +
      '<span class="means__ico">' + I.bulb + '</span>' +
      '<div><h3>' + esc(C.whatThisMeansTitle) + '</h3><p>' + means + '</p></div>' +
    '</div>' +
  '</section>';

  /* next step */
  html += '<section class="next">' +
    '<span class="next__ico">' + I.compass + '</span>' +
    '<div>' +
      '<h2>You have your results. &nbsp;Now take the next step.</h2>' +
      '<p class="next__sub">Your score shows you where to focus. Your Personalised Action Plan shows you exactly how to close the gap.</p>' +
      '<p class="next__lead">Inside your plan, you&rsquo;ll get:</p>' +
      '<ul class="next__list">' +
        '<li>' + I.check + '<span>Clear next steps based on your results</span></li>' +
        '<li>' + I.check + '<span>Personalised prompts to help you take action</span></li>' +
        '<li>' + I.check + '<span>A focused path to help you stand out, be seen and be chosen</span></li>' +
      '</ul>' +
      '<div class="next__cta"><span></span>' +
        '<a class="btn btn--gold" id="unlockCta" href="checkout.html">Unlock my personalised action plan</a>' +
      '<span></span></div>' +
    '</div>' +
  '</section>';

  /* breakdown */
  html += '<h2 class="bd__title">' + esc(C.breakdownTitle) + '</h2>';
  html += '<p class="bd__sub">' + esc(C.breakdownSubtitle) + '</p>';
  html += '<div class="bd__grid">';
  V.DISPLAY_ORDER.forEach(function (id) {
    var p = res.pillars[id];
    var badge = V.badgeFor(res, id);
    html += '<article class="pill-card">' +
      '<span class="pill-card__ico">' + I[id] + '</span>' +
      '<h3 class="pill-card__name">' + esc(N[id]) + '</h3>' +
      '<p class="pill-card__pct" data-count="' + p.display + '">0<span>%</span></p>' +
      '<span class="badge badge--' + V.BADGE_TONE[badge] + '">' + esc(badge) + '</span>' +
      '<p class="pill-card__text">' + esc(PC[id].description) + '</p>' +
      '</article>';
  });
  html += '</div>';

  /* strongest / gap */
  html += '<div class="panels">' +
    '<section class="panel">' +
      '<p class="panel__eyebrow">' + esc(C.strongestPanelTitle) + '</p>' +
      '<span class="panel__ico">' + I[res.strongest] + '</span>' +
      '<h3 class="panel__name">' + esc(strongName) + '</h3>' +
      '<p class="panel__pct">' + res.pillars[res.strongest].display + '<span>%</span></p>' +
      '<p class="panel__text">' + esc(PC[res.strongest].strongest) + '</p>' +
    '</section>' +
    '<section class="panel">' +
      '<p class="panel__eyebrow">' + esc(C.gapPanelTitle) + '</p>' +
      '<span class="panel__ico">' + I[res.primaryGap] + '</span>' +
      '<h3 class="panel__name">' + esc(gapName) + '</h3>' +
      '<p class="panel__pct">' + res.pillars[res.primaryGap].display + '<span>%</span></p>' +
      '<p class="panel__text">' + esc(PC[res.primaryGap].gap) + '</p>' +
    '</section>' +
  '</div>';

  /* share */
  html += '<section class="rcard share">' +
    '<span class="share__ico">' + I.doc + '</span>' +
    '<div class="share__body">' +
      '<p>' + esc(C.reportLinkText) + '</p>' +
      '<button type="button" class="share__btn" id="copyBtn">' + esc(C.reportLinkButton) + '</button>' +
    '</div>' +
  '</section>';

  html += '<p class="retake"><a href="quiz.html?restart=1">' + esc(C.retake) + '</a></p>';

  root.innerHTML = html;

  /* ---------------- make sure the URL carries the report ---------------- */
  var token = m ? m[1] : V.encodeReport(name, answers);
  if (!m) {
    try { history.replaceState(null, '', 'results.html#r=' + token); } catch (e) {}
  }

  /* the checkout needs the same report so it can pick the right edition */
  var unlock = document.getElementById('unlockCta');
  if (unlock) unlock.setAttribute('href', 'checkout.html#r=' + token);

  /* ---------------- copy link ---------------- */
  var copyBtn = document.getElementById('copyBtn');
  copyBtn.addEventListener('click', function () {
    var url = location.origin + location.pathname + '#r=' + token;
    var done = function () {
      copyBtn.textContent = 'Link copied';
      setTimeout(function () { copyBtn.textContent = C.reportLinkButton; }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else fallback();

    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = url; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:absolute;left:-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { copyBtn.textContent = 'Press ⌘C to copy'; }
      ta.remove();
    }
  });

  /* ---------------- count-up ---------------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countTo(el, target, suffix) {
    if (reduce) { el.innerHTML = target + suffix; return; }
    var start = performance.now(), dur = 1100;
    (function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.innerHTML = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  countTo(document.getElementById('scoreNum'), res.score, '<span>/100</span>');
  Array.prototype.forEach.call(document.querySelectorAll('.pill-card__pct'), function (el) {
    countTo(el, parseInt(el.getAttribute('data-count'), 10), '<span>%</span>');
  });
})();
