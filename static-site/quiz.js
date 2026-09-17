/* The Visibility Codes — assessment runner (28 questions) */
(function () {
  'use strict';

  var V = window.VC;
  var Q = V.QUESTIONS;
  var TOTAL = Q.length;

  var card = document.getElementById('qcard');

  var lead = V.read(V.LEAD_KEY);
  var answers = V.read(V.ANS_KEY) || {};

  var index = 0;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function save() { V.store(V.ANS_KEY, answers); }

  /* same rule as validate.ts on the live site */
  function isAnswered(q) {
    var v = answers[q.id];
    if (q.type === 'single') {
      return typeof v === 'string' && q.options.some(function (o) { return o.id === v; });
    }
    if (q.type === 'multi') {
      return Array.isArray(v) && v.length > 0;
    }
    var t = typeof v === 'string' ? v.trim() : '';
    return t.length > 0 && t.length <= (q.maxLength || 500);
  }

  function syncNext(q) {
    var btn = document.getElementById('qnext');
    if (btn) btn.disabled = !isAnswered(q);
  }

  function render() {
    var q = Q[index];
    var n = index + 1;

    var html = '<div class="qstep">';
    html += '<p class="qcounter">Question ' + n + ' of ' + TOTAL + '</p>';
    html += '<div class="qtrack" role="progressbar" aria-label="Assessment progress" ' +
            'aria-valuemin="0" aria-valuemax="' + TOTAL + '" aria-valuenow="' + n + '">' +
            '<div class="qfill" style="transform:scaleX(' + (n / TOTAL).toFixed(4) + ')"></div></div>';
    html += '<h1 class="qquestion">' + esc(q.text) + '</h1>';
    if (q.helper) html += '<p class="qhelper">' + esc(q.helper) + '</p>';

    if (q.type === 'text') {
      var val = typeof answers[q.id] === 'string' ? answers[q.id] : '';
      html += '<div class="qtext">' +
        '<textarea id="qta" maxlength="' + (q.maxLength || 500) + '" ' +
        'placeholder="Type your answer here">' + esc(val) + '</textarea>' +
        '<p class="qtext__count"><span id="qcount">' + val.length + '</span> / ' +
        (q.maxLength || 500) + '</p></div>';
    } else {
      var multi = q.type === 'multi';
      var current = answers[q.id];
      var selected = multi ? (Array.isArray(current) ? current : []) : current;
      html += '<div class="opts" role="' + (multi ? 'group' : 'radiogroup') +
              '" aria-label="' + esc(q.text) + '">';
      q.options.forEach(function (o) {
        var on = multi ? selected.indexOf(o.id) > -1 : selected === o.id;
        html += '<button type="button" class="opt" data-id="' + o.id + '" ' +
          (multi
            ? 'aria-pressed="' + (on ? 'true' : 'false') + '"'
            : 'role="radio" aria-checked="' + (on ? 'true' : 'false') + '"') +
          '><span class="opt__mark opt__mark--' + (multi ? 'check' : 'radio') + '"><i></i></span>' +
          '<span>' + esc(o.label) + '</span></button>';
      });
      html += '</div>';
    }

    html += '<div class="qactions">';
    html += index === 0
      ? '<span></span>'
      : '<button type="button" class="qnav__back" id="qback">Back</button>';
    html += '<button type="button" class="qnav__next" id="qnext"' +
            (isAnswered(q) ? '' : ' disabled') + '>Next</button>';
    html += '</div></div>';

    card.innerHTML = html;
    interactLock = Date.now() + 300;
    wire(q);
  }

  function wire(q) {
    var back = document.getElementById('qback');
    if (back) back.addEventListener('click', function () { if (!locked()) go(-1); });

    if (q.type === 'text') {
      var ta = document.getElementById('qta');
      var count = document.getElementById('qcount');
      ta.addEventListener('input', function () {
        count.textContent = String(ta.value.length);
        answers[q.id] = ta.value;
        save();
        syncNext(q);
      });
      ta.focus();
    } else {
      var multi = q.type === 'multi';
      Array.prototype.forEach.call(card.querySelectorAll('.opt'), function (btn) {
        btn.addEventListener('click', function () {
          if (locked()) return;
          var id = btn.getAttribute('data-id');
          if (multi) {
            var list = Array.isArray(answers[q.id]) ? answers[q.id].slice() : [];
            var at = list.indexOf(id);
            if (at > -1) list.splice(at, 1); else list.push(id);
            answers[q.id] = list;
            btn.setAttribute('aria-pressed', at > -1 ? 'false' : 'true');
            save();
            syncNext(q);
          } else {
            answers[q.id] = id;
            Array.prototype.forEach.call(card.querySelectorAll('.opt'), function (b) {
              b.setAttribute('aria-checked', b === btn ? 'true' : 'false');
            });
            save();
            syncNext(q);
            scheduleAdvance();
          }
        });
      });
    }

    var next = document.getElementById('qnext');
    if (next) {
      next.addEventListener('click', function () {
        if (locked() || !isAnswered(q)) return;
        save();
        go(1);
      });
    }
  }

  /* Only ever one advance in flight. Clicking a second option just changes the
     answer and restarts the countdown; it must never queue a second hop, which
     is what used to skip a question and strand it unanswered. */
  var advanceTimer = null;

  /* The second half of a double-click lands on the control that has just been
     rendered in the same place, which used to advance a second time and skip a
     question. A double-click's second press lands within ~500ms of the first:
     under 260ms it just re-answers the current question and restarts the
     countdown, and this lock covers the rest of that window. */
  var interactLock = 0;
  function locked() { return Date.now() < interactLock; }

  function scheduleAdvance() {
    var from = index;
    clearAdvance();
    advanceTimer = window.setTimeout(function () {
      advanceTimer = null;
      if (index === from) go(1);
    }, 260);
  }

  function clearAdvance() {
    if (advanceTimer !== null) { window.clearTimeout(advanceTimer); advanceTimer = null; }
  }

  function go(delta) {
    clearAdvance();
    var target = index + delta;
    if (target < 0) return;
    if (target >= TOTAL) return finish();
    index = target;
    render();
    var top = document.querySelector('.quiz__main');
    if (top && window.scrollY > 40) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finish() {
    save();
    var results = V.computeResults(answers);
    if (!results) {
      /* Unreachable in normal use: you cannot pass a scored question without
         answering it. If storage was corrupted we still need that answer, so
         go back for it — but say so, rather than silently reopening the quiz. */
      for (var i = 0; i < V.SCORED.length; i++) {
        var q = V.SCORED[i];
        if (typeof answers[q.id] !== 'string') {
          index = Q.findIndex(function (x) { return x.id === q.id; });
          render();
          var note = document.createElement('p');
          note.className = 'qnotice';
          note.setAttribute('role', 'status');
          note.textContent = 'Almost there — this one still needs an answer before we can score your assessment.';
          card.querySelector('.qstep').insertBefore(note, card.querySelector('.qcounter'));
          return;
        }
      }
      return;
    }
    window.location.href = 'results.html#r=' + V.encodeReport(firstName(), answers);
  }

  function firstName() {
    return (lead && lead.name ? lead.name : '').split(' ')[0];
  }

  function isComplete(a) {
    for (var i = 0; i < TOTAL; i++) if (a[Q[i].id] === undefined) return false;
    return true;
  }

  /* no lead captured yet — send them back to the landing page to fill the form */
  if (!lead) {
    window.location.replace('index.html');
    return;
  }

  /* There are only two ways to arrive here:

     1. the assessment is already finished  -> show the report, never a question
     2. anything else                       -> a clean run from question 1

     Part-finished answers are deliberately discarded rather than resumed. Mixing
     a new run into an old answer set is what used to drop people into the middle
     of the quiz (question 6, say) and could also score a retake against stale
     answers from the previous run. */
  var restart = /[?&]restart=1/.test(window.location.search);

  if (!restart && isComplete(answers) && V.computeResults(answers)) {
    window.location.replace('results.html#r=' + V.encodeReport(firstName(), answers));
    return;
  }

  answers = {};
  index = 0;
  save();
  if (restart) {
    try { history.replaceState(null, '', 'quiz.html'); } catch (e) {}
  }

  render();
})();
