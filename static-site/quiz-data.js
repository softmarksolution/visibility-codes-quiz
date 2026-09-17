/* The Visibility Codes — questions, scoring and results copy.
   Questions and scoring transcribed from the client's source material
   ("FINAL QUESTIONS TABLE PILLARS TAGS SCORES" / "HOW TO WORK OUT % SCORES"). */
(function (global) {
  'use strict';

  var L = function (i) { return String.fromCharCode(65 + i); };
  // [label, score] -> scored option
  var sc = function (pairs) { return pairs.map(function (p, i) { return { id: L(i), label: p[0], score: p[1] }; }); };
  // [label] -> plain option
  var pl = function (labels) { return labels.map(function (l, i) { return { id: L(i), label: l }; }); };

  var QUESTIONS = [
    { id: 1, category: 'Role', type: 'single',
      text: 'Which best describes what you do?',
      options: pl(['Entrepreneur or business owner', 'Coach', 'Speaker', 'Author',
        'Content creator or personal brand', 'Other']) },

    { id: 2, category: 'Visibility Goal', type: 'single',
      text: 'What would you most like greater visibility to help you achieve in the next 12 months?',
      helper: 'Choose the ONE thing you want most.',
      options: pl(['Attract more clients and increase my income',
        'Get more speaking opportunities',
        'Get more media, TV, magazine or press opportunities',
        'Get invited onto more podcasts or interview shows',
        'Get a book deal, attract publisher interest or increase the reach of my book',
        'Get more brand partnerships or collaborations',
        'Become more recognised in my industry and get considered for bigger opportunities',
        'Other']) },

    { id: 3, category: 'Visibility Problem', type: 'single',
      text: 'What is your biggest visibility problem right now?',
      options: pl(['I do not know where to focus',
        'I do not stand out enough from others in my industry',
        'Not enough people know who I am',
        'I do not know enough of the right people',
        'I am posting, but I am not getting enough reach or audience growth',
        'I have visibility or followers, but it is not leading to enough opportunities',
        'I hold myself back or do not put myself forward enough',
        'I struggle to stay consistent',
        'I am not sure what the problem is',
        'Other']) },

    { id: 4, category: 'Primary Platform', type: 'single',
      text: 'Which social media platform do you use most for your business or personal brand?',
      options: pl(['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Facebook', 'Threads', 'X', 'Other']) },

    { id: 5, category: 'Visibility Score', pillar: 'direction', type: 'single',
      text: 'How clear are you about what you want greater visibility to help you achieve?',
      options: sc([['I am not really sure yet', 0],
        ['I want more visibility, but I have several different goals', 1],
        ['I know my main goal, but I could be more focused', 2],
        ['I know exactly what I want my visibility to lead to', 3]]) },

    { id: 6, category: 'Visibility Score', pillar: 'direction', type: 'single',
      text: 'Do you know who can help you get the opportunities you want?',
      options: sc([['No, I am not really sure who they are', 0],
        ['I know the types of people I need to know', 1],
        ['I know some of the right people', 2],
        ['Yes, I know exactly who I need to connect with', 3]]) },

    { id: 7, category: 'Visibility Score', pillar: 'direction', type: 'single',
      text: 'Do you know where to show up to get in front of the right people?',
      helper: 'For example, certain platforms, events, stages, media or industry groups.',
      options: sc([['No, I am not really sure', 0], ['I have a general idea', 1],
        ['I know most of the places that matter', 2], ['Yes, I know exactly where I need to be', 3]]) },

    { id: 8, category: 'Visibility Score', pillar: 'direction', type: 'single',
      text: 'How focused are you with your visibility right now?',
      options: sc([['I am not really doing anything consistently', 0],
        ['I am trying lots of different things without a clear focus', 1],
        ['I am mostly focused on the things that matter', 2],
        ['I have a clear focus and know where to put my time and energy', 3]]) },

    { id: 9, category: 'Visibility Score', pillar: 'direction', type: 'single',
      text: 'Are the things you are doing to become more visible helping you move towards the opportunities you want?',
      options: sc([['Not really', 0], ['Sometimes, but a lot of what I do feels random', 1],
        ['Most of the time', 2], ['Yes, what I do is connected to what I want to achieve', 3]]) },

    { id: 10, category: 'Visibility Score', pillar: 'recognition', type: 'single',
      text: 'Do you know what makes you different from other people in your industry?',
      options: sc([['No, I am not really sure', 0], ['I have some ideas, but nothing very clear', 1],
        ['Yes, I know what makes me different', 2], ['Yes, I have a very clear point of difference', 3]]) },

    { id: 11, category: 'Visibility Score', pillar: 'recognition', type: 'single',
      text: 'When people look at your business or personal brand, do they understand what you do?',
      options: sc([['Not really, I often have to explain it', 0],
        ['Somewhat, but it is not always clear', 1], ['Yes, most people understand what I do', 2],
        ['Yes, people quickly understand what I do and what I am good at', 3]]) },

    { id: 12, category: 'Visibility Score', pillar: 'recognition', type: 'single',
      text: 'Is there proof online that shows you are good at what you do?',
      helper: 'For example, results, testimonials, case studies, examples of your work, media features, speaking appearances, books, awards, qualifications, brand partnerships or endorsements.',
      options: sc([['Very little or none yet', 0], ['Yes, but I do not show much of it online', 1],
        ['Yes, I have good proof online that people can easily find', 2],
        ['Yes, I have a lot of strong proof online that builds my credibility', 3]]) },

    { id: 13, category: 'Visibility Score', pillar: 'recognition', type: 'single',
      text: 'How big is your audience on your biggest social media platform?',
      helper: 'Choose your biggest platform. Do not add your platforms together.',
      options: sc([['Under 1,000', 0], ['1,000 to 5,000', 1], ['5,000 to 20,000', 1],
        ['20,000 to 100,000', 2], ['100,000 to 250,000', 2], ['250,000 to 500,000', 3],
        ['More than 500,000', 3]]) },

    { id: 14, category: 'Visibility Score', pillar: 'recognition', type: 'single',
      text: 'Do people in your industry come to you for your advice or expertise?',
      options: sc([['Never', 0], ['Rarely', 1], ['Sometimes', 2], ['Regularly', 3]]) },

    { id: 15, category: 'Visibility Score', pillar: 'connection', type: 'single',
      text: 'Think about the key people in your industry who could open doors for you. How many of them know who you are?',
      options: sc([['Almost none', 0], ['A few', 1], ['Quite a few', 2],
        ['Most of the key people I want to know me', 3]]) },

    { id: 16, category: 'Visibility Score', pillar: 'connection', type: 'single',
      text: 'How often are you in the right rooms, events, groups or conversations where valuable industry connections can happen?',
      options: sc([['Rarely or never', 0], ['Occasionally', 1], ['Fairly regularly', 2],
        ['Very regularly and intentionally', 3]]) },

    { id: 17, category: 'Visibility Score', pillar: 'connection', type: 'single',
      text: 'When you meet someone who could become a valuable connection, do you follow up afterwards?',
      options: sc([['Rarely', 0], ['Sometimes, but usually only once', 1], ['Usually', 2],
        ['Yes, and I make an effort to stay connected over time', 3]]) },

    { id: 18, category: 'Visibility Score', pillar: 'connection', type: 'single',
      text: 'How often do you connect with people in your industry simply to build a genuine relationship, without wanting or expecting anything from them?',
      options: sc([['Almost never', 0], ['Occasionally', 1], ['Fairly regularly', 2],
        ['Regularly, building genuine relationships is an important part of what I do', 3]]) },

    { id: 19, category: 'Inner Visibility Blocker', type: 'single',
      text: 'What do you think has held you back the most from becoming more visible?',
      helper: 'Choose the ONE that feels most true for you.',
      options: pl(['I am afraid of being judged, criticised or rejected',
        'I have a fear of being seen and feel uncomfortable putting myself out there',
        'I struggle with confidence or imposter syndrome and question whether I am credible or good enough',
        'I am afraid of failing or putting myself out there and getting no result',
        'I overthink things, second guess myself or wait until everything feels perfect',
        'Promoting myself feels awkward or too self promotional',
        'I do not know where to start or what I should be doing',
        'I do not know what to say or what content to create',
        'I start, but I struggle to stay consistent',
        'I have tried things before and became discouraged when they did not work',
        'Nothing internal is really holding me back, I mainly need a better strategy',
        'Other']) },

    { id: 20, category: 'Visibility Score', pillar: 'consistency', type: 'single',
      text: 'How often do you currently post on social media?',
      options: sc([['Rarely or never', 0], ['A few times a month', 1], ['1 to 3 times a week', 2],
        ['Daily or almost daily', 3], ['Multiple times a day', 3]]) },

    { id: 21, category: 'Visibility Score', pillar: 'consistency', type: 'single',
      text: 'How often do you look at what is growing your visibility and then do more of what works?',
      options: sc([['I do not really track it', 0], ['Occasionally', 1], ['Fairly regularly', 2],
        ['Regularly, I pay attention to what works and repeat it', 3]]) },

    { id: 22, category: 'Visibility Score', pillar: 'opportunity', type: 'single',
      text: 'When did someone last approach you with an opportunity you did not ask for?',
      helper: 'For example, speaking, media, podcasts, clients, partnerships, collaborations or referrals.',
      options: sc([['Never', 0], ['More than a year ago', 1], ['In the last few months', 2],
        ['In the last month', 3]]) },

    { id: 23, category: 'Visibility Score', pillar: 'opportunity', type: 'single',
      text: 'Think about your last few good opportunities. Did you find them, or did they find you?',
      options: sc([['I had to find or pitch for all of them', 0],
        ['Mostly I found them, with a few coming to me', 1],
        ['Mostly they came to me through referrals, recommendations or people approaching me', 2],
        ['Almost all of them came to me', 3]]) },

    { id: 24, category: 'Visibility Score', pillar: 'opportunity', type: 'single',
      text: 'When you get a good opportunity, do you use it to create more visibility or more opportunities?',
      options: sc([['No, I usually just focus on that one opportunity', 0],
        ['Sometimes, but I do not really have a strategy', 1], ['Usually', 2],
        ['Yes, I deliberately use opportunities to create more visibility, relationships and opportunities', 3]]) },

    { id: 25, category: 'Experience', type: 'single',
      text: 'How many years of experience do you have in the work or industry you want to be known for?',
      options: pl(['Less than 1 year', '1 to 3 years', '4 to 7 years', '8 to 15 years',
        'More than 15 years']) },

    { id: 26, category: 'Market Research', type: 'multi',
      text: 'What have you already done to try to become more visible?',
      helper: 'Select all that apply.',
      options: pl(['Posted more consistently on social media',
        'Networked or attended industry events',
        'Been a guest on podcasts or interview shows',
        'Tried to get media coverage or PR',
        'Spoken at events, workshops or on stages',
        'Collaborated with other people or brands',
        'Reached out or pitched myself for opportunities',
        'Used paid advertising',
        'Improved my website, social media profiles or personal brand',
        'Bought a course, joined a program or hired someone to help me become more visible',
        'I have not actively tried anything specific yet',
        'Other']) },

    { id: 27, category: 'Buyer Intent', type: 'single',
      text: 'How serious are you about increasing your visibility over the next 12 months?',
      options: pl(['I am interested, but it is not a major priority right now',
        'I definitely want greater visibility, but I am still figuring out what I am willing to do',
        'I am serious about increasing my visibility and ready to take consistent action',
        'Increasing my visibility is a major priority and I am willing to invest in the right strategy or support']) },

    { id: 28, category: 'Written Market Research', type: 'text',
      text: 'What do you feel is the biggest thing stopping you from getting the visibility or opportunities you want?',
      helper: 'Please keep your answer to one or two sentences.',
      options: [], maxLength: 500 }
  ];

  var PILLARS = ['direction', 'recognition', 'connection', 'consistency', 'opportunity'];
  var DISPLAY_ORDER = ['direction', 'recognition', 'consistency', 'connection', 'opportunity'];
  var PILLAR_NAMES = { direction: 'Direction', recognition: 'Recognition',
    connection: 'Connection', consistency: 'Consistency', opportunity: 'Opportunity' };

  var SCORED = QUESTIONS.filter(function (q) { return q.pillar; });

  var PILLAR_MAX = SCORED.reduce(function (m, q) {
    m[q.pillar] += Math.max.apply(null, q.options.map(function (o) { return o.score || 0; }));
    return m;
  }, { direction: 0, recognition: 0, connection: 0, consistency: 0, opportunity: 0 });

  var LEVELS = [
    { min: 90, name: 'Chosen Expert' },
    { min: 75, name: 'Recognised' },
    { min: 50, name: 'Building Recognition' },
    { min: 25, name: 'Emerging Visibility' },
    { min: 0, name: 'Hidden Potential' }
  ];

  /* "Visibility Gap Rating" is deliberately NOT implemented.
     HOW TO WORK OUT % SCORES.docx, section 8:
       "The Results Page example shows a rating such as SIGNIFICANT, but the
        rating bands have not been defined yet. Do not guess this logic.
        Leave it until the rating bands are confirmed."
     When the client confirms the bands, add them here and re-enable the row in
     results.js (search for gapRating). */

  function levelFor(score) {
    for (var i = 0; i < LEVELS.length; i++) if (score >= LEVELS[i].min) return LEVELS[i].name;
    return LEVELS[LEVELS.length - 1].name;
  }

  /** answers: { [questionId]: optionId | optionId[] | text }. Returns null if incomplete. */
  function computeResults(answers) {
    var points = { direction: 0, recognition: 0, connection: 0, consistency: 0, opportunity: 0 };
    for (var i = 0; i < SCORED.length; i++) {
      var q = SCORED[i], v = answers[q.id], opt = null;
      if (typeof v === 'string') {
        opt = q.options.filter(function (o) { return o.id === v; })[0] || null;
      }
      if (!opt || typeof opt.score !== 'number') return null;
      points[q.pillar] += opt.score;
    }
    var pillars = {}, sum = 0;
    PILLARS.forEach(function (id) {
      var pct = (points[id] / PILLAR_MAX[id]) * 100;
      pillars[id] = { id: id, points: points[id], max: PILLAR_MAX[id], percent: pct, display: Math.round(pct) };
      sum += pct;
    });
    var score = Math.round(sum / PILLARS.length);
    var strongest = PILLARS[0], primaryGap = PILLARS[0];
    PILLARS.forEach(function (id) {
      if (pillars[id].percent > pillars[strongest].percent) strongest = id;
      if (pillars[id].percent < pillars[primaryGap].percent) primaryGap = id;
    });
    return { pillars: pillars, score: score, gap: 100 - score, level: levelFor(score),
      strongest: strongest, primaryGap: primaryGap };
  }

  function badgeFor(res, pillar) {
    if (pillar === res.primaryGap) return 'Primary Blocker';
    if (pillar === res.strongest) return 'Strongest Area';
    var p = res.pillars[pillar].display;
    if (p >= 75) return 'Strong';
    if (p >= 50) return 'Building';
    return 'Developing';
  }
  var BADGE_TONE = { 'Primary Blocker': 'red', 'Strongest Area': 'green', Strong: 'green',
    Building: 'yellow', Developing: 'orange' };

  var COPY = {
    eyebrow: 'Your personalised visibility results',
    scoreTitle: 'Your Visibility Score',
    whatThisMeansTitle: 'What this means',
    whatThisMeans: {
      'Hidden Potential': 'You have real potential that most of the right people cannot see yet. Right now your visibility is not reflecting what you are capable of. Focusing on your {gap} will create the biggest shift right now.',
      'Emerging Visibility': 'You have already built some visibility foundations, but there is still a significant gap between your capability and how clearly your value is seen by the people who matter. Focusing on your {gap} will create the biggest shift right now.',
      'Building Recognition': 'You are building real recognition and people are starting to notice your value. The next step is closing the gaps that stop you being consistently chosen. Focusing on your {gap} will create the biggest shift right now.',
      'Recognised': 'You are recognised for what you do and opportunities are finding you. A few gaps are still limiting how far and how fast you can go. Focusing on your {gap} will create the biggest shift right now.',
      'Chosen Expert': 'You are seen, trusted and chosen in your space, and your visibility is working for you. Strengthening your {gap} will help you protect and grow that position.'
    },
    breakdownTitle: 'Your visibility breakdown',
    breakdownSubtitle: 'These scores show how you are performing across the five key areas of visibility.',
    strongestPanelTitle: "Where you're strongest",
    gapPanelTitle: 'Your biggest visibility gap',
    reportLinkText: 'Want your results on another device? This link opens your exact report anywhere.',
    reportLinkButton: 'Copy my report link',
    retake: 'Retake the quiz'
  };

  var PILLAR_COPY = {
    direction: {
      description: "How clear you are on what you want, where you're going and who you want to become known for.",
      strongest: 'You know what you want your visibility to lead to. That clarity means your time, content and relationships can work together and build towards the opportunities that matter most.',
      gap: 'Your visibility lacks a clear destination. When the outcome is unclear, your content, relationships and actions pull in different directions instead of compounding.'
    },
    recognition: {
      description: 'How clearly your value, expertise, credibility and proof are seen, understood and remembered by others.',
      strongest: 'You already have credibility and visible evidence that supports what you do. People are more likely to understand your value once they discover you.',
      gap: 'Your value is not yet easy to see. People may not quickly understand what makes you different or why they should trust you, so opportunities go to those whose expertise is more visible.'
    },
    consistency: {
      description: 'How regularly and strategically you show up so the right people keep seeing and remembering you.',
      strongest: 'You show up regularly and pay attention to what works. That rhythm keeps you front of mind, so the right people keep seeing and remembering you.',
      gap: 'Your visibility is not yet consistent enough to be remembered. When you show up in bursts, people forget you between appearances and your momentum keeps resetting.'
    },
    connection: {
      description: 'How effectively you build genuine relationships and become known by the people and circles that matter.',
      strongest: 'You are building genuine relationships with the people who matter. Doors open faster when the right people already know, like and trust you.',
      gap: 'The right people do not know you yet. Without strong relationships in your industry, even great work can go unnoticed and opportunities pass you by.'
    },
    opportunity: {
      description: 'How effectively your visibility turns into invitations, referrals, clients, media and other opportunities.',
      strongest: 'Your visibility is already turning into real opportunities. People are coming to you, and you know how to use each opportunity to create the next one.',
      gap: 'Your visibility is not yet turning into enough opportunities. You may be seen, but without a clear path from attention to invitation, you are still doing most of the chasing.'
    }
  };

  /* ---------- storage + shareable report link ---------- */
  var LEAD_KEY = 'vc_lead', ANS_KEY = 'vc_answers';

  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function read(key) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }

  function b64urlEncode(str) {
    return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(str) {
    var s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return decodeURIComponent(escape(atob(s)));
  }

  /** Scored answers + first name only — free-text answers never go in a URL. */
  function encodeReport(name, answers) {
    var a = {};
    SCORED.forEach(function (q) { if (answers[q.id]) a[q.id] = answers[q.id]; });
    return b64urlEncode(JSON.stringify({ v: 1, n: name || '', a: a }));
  }
  function decodeReport(token) {
    try {
      var d = JSON.parse(b64urlDecode(token));
      if (!d || d.v !== 1 || !d.a) return null;
      return { name: d.n || '', answers: d.a };
    } catch (e) { return null; }
  }

  global.VC = {
    QUESTIONS: QUESTIONS, SCORED: SCORED, PILLARS: PILLARS, DISPLAY_ORDER: DISPLAY_ORDER,
    PILLAR_NAMES: PILLAR_NAMES, PILLAR_MAX: PILLAR_MAX, COPY: COPY, PILLAR_COPY: PILLAR_COPY,
    BADGE_TONE: BADGE_TONE, LEAD_KEY: LEAD_KEY, ANS_KEY: ANS_KEY,
    computeResults: computeResults, badgeFor: badgeFor, levelFor: levelFor,
    store: store, read: read, encodeReport: encodeReport, decodeReport: decodeReport
  };
})(window);
