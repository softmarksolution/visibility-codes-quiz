/* Thank-you page — three states, per 6. QUIZ / 7. THANK YOU PAGES.
   Reached as thank-you.html?paid=1&waitlist=1&edition=direction&r=<token> */
(function () {
  'use strict';
  var V = window.VC, root = document.getElementById('tyRoot');

  /* "You're on the waitlist" — the page the client designed as
     6. QUIZ / 5. VISIBILITY ACTION PLANS / BUTTON AT BOTTOM OF PDF ...png.
     It is also where the JOIN PRIORITY WAITLIST button inside the
     "NOT ON WAITLIST" Action Plan PDFs should point. */
  var WAITLIST_URL = 'waitlist.html';

  var q = {};
  (window.location.search || '').replace(/^\?/, '').split('&').forEach(function (kv) {
    if (!kv) return; var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
  });
  var paid = q.paid === '1';
  var waitlist = q.waitlist === '1';
  var edition = q.edition || '';
  var token = (window.location.hash || '').replace(/^#r=/, '') || q.r || '';

  /* Where the purchased Action Plan lives. The ten PDFs in
     8. SALES PAGE/ are 10-22MB each, so they are not bundled with this site —
     host them (or gate them behind the delivery email) and return the URL here. */
  function planUrl() {
    if (!edition) return '#';
    return 'plans/' + edition + (waitlist ? '-on-waitlist' : '-not-on-waitlist') + '.pdf';
  }

  var I = {
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2.4" y="4.8" width="19.2" height="14.4" rx="2.2"/><path d="m3.2 6.2 8.8 6.6 8.8-6.6"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M14 2.6H6.9A1.8 1.8 0 0 0 5.1 4.4v15.2a1.8 1.8 0 0 0 1.8 1.8h10.2a1.8 1.8 0 0 0 1.8-1.8V7.4Z"/><path d="M14 2.6v4.9h4.9"/><path d="M8.6 15.6v-3.4h1.3a1.2 1.2 0 0 1 0 2.4H8.6M13 12.2v3.4M13 12.2h1a1.7 1.7 0 0 1 0 3.4h-1" stroke-width="1.3"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="16" rx="2.4"/><path d="M3 9.6h18M8 3v3.6M16 3v3.6"/><path d="m12 12.4 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3Z" fill="currentColor" stroke="none"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8.4 6.6 12 12 4.6 17.4 12 21 8.4l-1.8 10.2H4.8Z"/></svg>',
    screen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2.4" y="4" width="19.2" height="13" rx="2.2"/><path d="M8.4 21h7.2M12 17v4"/><path d="m12 7.6 1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3Z" fill="currentColor" stroke="none"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3.2 12a8.8 8.8 0 1 0 2.6-6.2"/><path d="M3 4.6v4h4"/><path d="M12 7.6V12l3 1.8"/></svg>'
  };
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var SPARK = '<div class="ty__orn"><span></span><i class="spark spark--gold"></i><span></span></div>';

  function card(o) {
    var h = '<section class="tycard"><span class="tycard__ico">' + o.icon + '</span><div class="tycard__body">';
    if (o.eyebrow) h += '<p class="tycard__eyebrow">' + esc(o.eyebrow) + '</p>';
    h += '<h2 class="tycard__h' + (o.small ? ' tycard__h--sm' : '') + '">' + esc(o.title) + '</h2>';
    (o.paras || []).forEach(function (p) { h += '<p>' + p + '</p>'; });
    if (o.cta) h += '<a class="btn btn--gold tycard__cta" href="' + o.cta.href + '">' + esc(o.cta.label) + '</a>';
    if (o.note) h += '<p class="tycard__note">' + esc(o.note) + '</p>';
    if (o.strip) {
      h += '<div class="tystrip"><span class="tystrip__ico">' + I.crown + '</span><div>' +
           '<p class="tystrip__head">' + esc(o.strip.head) + '</p>' +
           '<p class="tystrip__text">' + esc(o.strip.text) + '</p></div></div>';
    }
    return h + '</div></section>';
  }

  var SPAM = 'If you do not see the email within the next few minutes, check your spam or promotions folder and move the email into your primary inbox.';
  var MASTER_TITLE = 'The Visibility Codes Masterclass';
  var v;

  if (paid && waitlist) {
    v = {
      h1: 'Your personalised<br>Visibility Action Plan is ready.',
      lead: 'Purchase confirmed. You&rsquo;re officially in.',
      body: ['You&rsquo;ve taken the next step from simply knowing your visibility gap to doing something about it.',
             'Your personalised Visibility Action Plan is designed to help you turn your results into clear, focused action.'],
      cards: [
        card({ icon: I.mail, title: 'Check your email', small: true,
          paras: ['Your purchase confirmation, a copy of your Visibility Action Plan and your Masterclass waitlist confirmation are on their way to your inbox.',
                  SPAM, '<b>Keep this email. It contains your access details and important next steps.</b>'] }),
        card({ icon: I.doc, eyebrow: 'Access now', title: 'Access Your Visibility Action Plan',
          paras: ['Your Action Plan has been created around the visibility area your assessment identified as your biggest gap.',
                  'Inside, you will use guided strategy, AI prompts and practical exercises to help you clarify what needs to change and decide exactly what to do next.'],
          cta: { label: 'Access my action plan', href: planUrl() },
          note: 'Save your Action Plan somewhere easy to find so you can return to it as you work through each section.' }),
        card({ icon: I.cal, eyebrow: 'You’re on the waitlist', title: MASTER_TITLE,
          paras: ['You&rsquo;re officially on the <b>Priority Waitlist</b>. You&rsquo;ll be the first to know when doors open, plus receive early updates, priority bonuses and special launch pricing &mdash; available only to Priority Waitlist members.'],
          strip: { head: 'Watch your inbox', text: 'We’ll be in touch with all the details.' } })
      ],
      closeA: 'You have your result. Now turn it into action.',
      closeB: 'Start with your Visibility Action Plan and get ready for the next level.'
    };
  } else if (paid) {
    v = {
      h1: 'Your personalised<br>Visibility Action Plan is ready.',
      lead: 'Purchase confirmed. You&rsquo;re officially in.',
      body: ['You&rsquo;ve taken the next step from simply knowing your visibility gap to doing something about it.',
             'Your personalised Visibility Action Plan is ready to help you turn your results into clear, focused action.'],
      cards: [
        card({ icon: I.mail, title: 'Check your email', small: true,
          paras: ['Your purchase confirmation and a copy of your Visibility Action Plan are on their way to your inbox.',
                  SPAM, '<b>Keep this email. It contains your access details and Action Plan link.</b>'] }),
        card({ icon: I.doc, eyebrow: 'Start here', title: 'Access Your Visibility Action Plan',
          paras: ['Your Action Plan has been created around the visibility area your assessment identified as your biggest gap.',
                  'Inside, you will use guided strategy, AI prompts and practical exercises to help you clarify what needs to change and decide exactly what to do next.'],
          cta: { label: 'Access my action plan', href: planUrl() },
          note: 'Save your Action Plan somewhere easy to find so you can return to it as you work through each section.' }),
        card({ icon: I.screen, eyebrow: 'Want to go deeper?', title: MASTER_TITLE,
          paras: ['Go behind the scenes and learn the exact strategies, mindset and positioning that get you chosen for red carpets, major stages and standout opportunities.',
                  'The Visibility Codes Masterclass shows you how to strengthen all five areas of visibility so you can position yourself more powerfully, become more recognised and create bigger opportunities for what&rsquo;s next.'],
          cta: { label: 'Join the priority waitlist free', href: WAITLIST_URL } })
      ],
      closeA: 'You have your result. Now turn it into action.',
      closeB: 'Start with your Visibility Action Plan and take your first step today.'
    };
  } else {
    v = {
      h1: 'Your visibility results are ready.<br><em>You now know where you stand.</em>',
      body: ['Your assessment has identified your Visibility Score, your strongest visibility area and the gap that may be holding you back most.',
             'A link to your full results has been emailed to you, so you can return to them anytime.'],
      cards: [
        card({ icon: I.mail, title: 'Check your email', small: true,
          paras: ['Your visibility results have been sent to your inbox.', SPAM,
                  'Keep this email. It contains your full results and a link to return to them anytime.'],
          cta: { label: 'Return to my results', href: 'results.html' + (token ? '#r=' + token : '') } }),
        card({ icon: I.screen, eyebrow: 'Want to go deeper?', title: MASTER_TITLE,
          paras: ['Discover the exact strategies, mindset shifts and proven steps behind being chosen for red carpets, major stages and standout opportunities.',
                  'Go beyond your results and learn how to strengthen all five areas of visibility so you can position yourself more powerfully, become more recognised and create the opportunities you want.'],
          cta: { label: 'Join the priority waitlist free', href: WAITLIST_URL } }),
        card({ icon: I.clock, title: 'Your results are still yours', small: true,
          paras: ['You can return to your full results anytime using the link in the email we&rsquo;ve sent you. It will always be there when you need a reminder of your Visibility Score, your strongest area and the gap to focus on.'] })
      ],
      closeA: 'You know where you stand. Now decide what happens next.',
      closeTag: true
    };
  }

  var html = '<h1 class="ty__title">' + v.h1 + '</h1>' + SPARK;
  if (v.lead) html += '<p class="ty__lead">' + v.lead + '</p>';
  html += '<div class="ty__body">' + v.body.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>';
  html += '<p class="ty__tag">Stand out. Be seen. Be chosen.</p>';
  html += '<div class="ty__cards">' + v.cards.join('') + '</div>';
  html += SPARK + '<p class="ty__close">' + esc(v.closeA) + '</p>';
  if (v.closeB) html += '<p class="ty__closeb">' + esc(v.closeB) + '</p>';
  if (v.closeTag) html += '<p class="ty__tag ty__tag--end">Stand out. Be seen. Be chosen.</p>';
  html += '<p class="ty__follow"><a href="https://www.instagram.com/katrinakavvalos/" target="_blank" rel="noopener">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none"/></svg>' +
    'Follow @KatrinaKavvalos</a></p>';

  root.innerHTML = html;
  document.title = (paid ? 'Your Action Plan is ready' : 'Your results are ready') + ' | The Visibility Codes';
})();
