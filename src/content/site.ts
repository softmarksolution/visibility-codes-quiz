// All visible copy and links live here so they can be edited in one place.
//
// Copy marked "DRAFT" was written by the developer to fill gaps in the client's
// designs and needs client approval. Everything else is taken from the client's
// font card, brand card and results page PDF.

import type { IconName } from "@/components/Icon";
import type { PillarId } from "@/lib/quiz/questions";
import type { Badge, LevelName } from "@/lib/quiz/scoring";

export const brand = {
  tagline: "Stand out • Be seen • Be chosen",
  copyright: "© 2026 Katrina Kavvalos International",
  privacyUrl: "/privacy-policy",
  termsUrl: "/terms-of-use",
  instagramHandle: "@KatrinaKavvalos",
  hashtag: "#TheVisibilityCodes",
  websiteLabel: "TheVisibilityCodes.com",
  websiteUrl: "https://thevisibilitycodes.com",
};

// Landing page copy, word for word from the client's desktop and mobile layout PDFs.
// Uppercase styling is applied in CSS so screen readers read words, not letters.
// Images in /public/landing were cropped from the flattened PDFs; replace them with the
// client's original files (same names) for sharper photos and logos.
export const landing = {
  hero: {
    title: "Why Aren’t You Getting The Opportunities You Know You Deserve?",
    body: "In just 3 minutes, discover what is stopping you from standing out, being seen and being chosen, and what to shift next.",
    tagline: "Stand out. Be seen. Be chosen.",
    button: "Start assessment",
    journey: ["Overlooked", "Recognised", "Chosen"],
    imageAlt: "Katrina Kavvalos in front of The Visibility Codes title",
  },
  press: [
    { id: "aacta", file: "press-aacta-7f994ed4.webp", name: "AACTA Awards", w: 109, h: 61 },
    { id: "nyfinance", file: "press-nyfinance-4c0ec20f.webp", name: "The New York Finance", w: 106, h: 52 },
    { id: "dailytelegraph", file: "press-dailytelegraph-bc29e80d.webp", name: "The Daily Telegraph", w: 152, h: 41 },
    { id: "seven", file: "press-seven-ec966de3.webp", name: "Channel 7", w: 42, h: 43 },
    { id: "nine", file: "press-nine-201cf967.webp", name: "Channel 9", w: 76, h: 40 },
    { id: "currentaffair", file: "press-currentaffair-04b9335a.webp", name: "A Current Affair", w: 118, h: 39 },
    { id: "newidea", file: "press-newidea-9a71eae4.webp", name: "New Idea", w: 67, h: 47 },
    { id: "tennews", file: "press-tennews-f29340fa.webp", name: "10 News First", w: 85, h: 43 },
    { id: "livingroom", file: "press-livingroom-223c89b0.webp", name: "The Living Room", w: 89, h: 40 },
    { id: "prevention", file: "press-prevention-47565bee.webp", name: "Prevention", w: 122, h: 37 },
  ],
  score: {
    title: "Get Your Visibility Score Free",
    body: "The first step to improving your visibility is knowing exactly where your gap is. Take this 3-minute Visibility Assessment to uncover what may be keeping you from standing out, being seen, and being chosen for the opportunities you want.",
    bullets: [
      { icon: "target", strong: "Discover your Visibility Score,", rest: " from 0 to 100, and what it means." },
      { icon: "search", strong: "Identify your primary visibility gap", rest: " and the area that needs the most attention." },
      { icon: "clipboard", strong: "Get your visibility category", rest: " and personalised next steps you can apply straight away." },
    ],
    after: "You’ll receive your score, primary blocker, strongest area, and next steps to help you move forward with clarity.",
    button: "Get your free score",
    gaugeTitle: "Your visibility score",
    sample: 88,
    rangeFrom: "Hidden potential",
    rangeTo: "Chosen expert",
    pill: "Score. Gap. Next steps.",
  },
  // "Why The Visibility Codes work" — the section between the score card and
  // "Who this is for" in the client's FINAL.pdf. Copy is word for word.
  why: {
    eyebrow: "Why The Visibility Codes Work",
    titleStart: "You cannot build visibility",
    titleGold: "waiting to be discovered.",
    photoAlt: "Katrina Kavvalos on the TikTok Awards red carpet",
    paragraphs: [
      "I have been chosen for opportunities, stages and rooms I was not the most qualified for on paper. Not because I was better than everyone else, but because I learned how to position myself to be seen, remembered and chosen.",
      "At the same time, I have seen incredibly talented, experienced and qualified people stay overlooked simply because they were not visible in the right way.",
      "You can have the experience, the talent and the expertise, and still be missed. Visibility changes when you learn how to position yourself so the right people notice you, remember you and choose you, even before you feel like the obvious choice.",
    ],
    stats: [
      { icon: "instagram", lead: "600,000+", rest: "followers on Instagram",
        note: "Built through visibility, positioning and content that gets remembered." },
      { icon: "people", lead: "Almost 1 million", rest: "across social media",
        note: "A personal brand grown through strategic positioning and visibility." },
      { icon: "microphone", lead: "", rest: "Chosen for major media and red carpets",
        note: "Including interviewing global celebrities and entertainment leaders." },
      { icon: "stage", lead: "12,000 people", rest: "Chosen to host in front of", leadAfter: true,
        note: "Alongside world class speakers such as Tony Robbins, Steven Bartlett, Gary Brecka and more." },
    ],
    footnote: "The Visibility Codes are built from the same strategies I have used in real life to create recognition, credibility, proximity and opportunity.",
  },
  who: {
    title: "Who this is for",
    photoAlt: "Sydney host Katrina Kavvalos with Steven Bartlett and Tony Robbins",
    bullets: [
      "You know you’re good at what you do, but you still feel overlooked in your industry.",
      "You struggle to explain what makes you different, so your message is not cutting through.",
      "You’re showing up and creating content, but it is not turning into recognition, authority or opportunities.",
      "You keep watching people with less experience get the clients, stages, media and partnerships you want.",
      "You know you need to become more visible, but you are unsure where to focus or what will actually move the needle.",
      "You feel capable of playing at a much bigger level, but your current positioning does not reflect the level you want to be known for.",
    ],
  },
  gaps: {
    titleStart: "What’s Your",
    titleGold: "Visibility Gap?",
    body: "In just 3 minutes, uncover the hidden gap affecting your visibility, identify where you are strongest, and receive a personalised next-step plan.",
    items: [
      { name: "Direction", text: "Your message, positioning, or focus is unclear, making it harder for people to understand what you do and why it matters." },
      { name: "Recognition", text: "You have value to offer, but the right people are not noticing, remembering, or choosing you yet." },
      { name: "Consistency", text: "You show up in pockets, but not often enough to build trust, momentum, and authority." },
      { name: "Connection", text: "Your content or presence is not fully creating resonance, trust, or the relationships that open doors." },
      { name: "Opportunity", text: "You are visible in some ways, but not yet positioned for the rooms, referrals, and aligned opportunities you want." },
    ],
    button: "Start free quiz",
  },
  meet: {
    title: "Meet Katrina",
    photoAlt: "Katrina Kavvalos hosting the AACTA Awards red carpet",
    paragraphs: [
      "Katrina Kavvalos is a TV show creator, producer, speaker, media personality, red carpet host, celebrity interviewer, and #1 bestselling author whose career spans broadcast television, publishing, and digital media.",
      "As a Red Carpet Host and Celebrity Interviewer at the AACTA Awards, Katrina has interviewed some of the most recognisable names in entertainment, and also served as VIP Social Media Reporter for The Voice Australia and singer Will.i.am.",
      "With more than a decade of experience across media and digital platforms, Katrina has built a respected reputation across both broadcast and social, while contributing to bestselling books on credibility, relationships, and personal influence in the digital age.",
      "Across television, publishing, and visibility-focused media projects, Katrina’s work explores identity, reinvention, success, and human potential, helping people step out of the background, elevate their authority, and become impossible to overlook.",
    ],
  },
  galleryLabel: "Katrina speaking, hosting and on the red carpet",
  gallery: [
    { id: 1, file: "gallery-1-8b696ff3.webp", alt: "Katrina speaking on stage to a full conference room", w: 744, h: 632 },
    { id: 2, file: "gallery-2-86ce7eac.webp", alt: "Katrina interviewing an actor on the red carpet", w: 744, h: 632 },
    { id: 3, file: "gallery-3-6886fec8.webp", alt: "Katrina with a guest at a red carpet event", w: 372, h: 316 },
    { id: 4, file: "gallery-4-e403b6ad.webp", alt: "Katrina with a guest at an awards night", w: 556, h: 592 },
    { id: 5, file: "gallery-5-8c59104b.webp", alt: "Katrina with two guests at a media event", w: 556, h: 592 },
    { id: 6, file: "gallery-6-83f5aa2d.webp", alt: "Katrina laughing with a guest on the red carpet", w: 556, h: 592 },
    { id: 7, file: "gallery-7-f023b411.webp", alt: "Katrina presenting on stage at a live event", w: 556, h: 592 },
  ],
  final: {
    lines: ["You were never meant", "to be overlooked."],
    body: "Discover what is currently holding back your visibility, and the exact area to focus on next.",
    button: "Get your visibility score free",
  },
} as const;

export const unlock = {
  headline: {
    "Hidden Potential": "You Have Hidden Potential.", // DRAFT
    "Emerging Visibility": "Your Visibility Is Emerging.", // DRAFT
    "Building Recognition": "You're Building Recognition.",
    Recognised: "You're Recognised.", // DRAFT
    "Chosen Expert": "You're a Chosen Expert.", // DRAFT
  } satisfies Record<LevelName, string>,
  body: "Now comes the part that matters most. Discover where your visibility is strongest, where your biggest gap is holding you back, and what to shift next so you can become more recognised and chosen.",
  firstNameLabel: "First name",
  emailLabel: "Email",
  button: "Unlock my full report",
  sending: "Unlocking…",
  smallPrint: "Your personalised Visibility Report will be sent straight to your inbox.",
  genericError: "Something went wrong. Please try again.",
};

/* Check-out and thank-you copy, from the client's
   "VISIBILITY ACTION PLAN - CHECK OUT PAGE COPY.docx". That document opens
   "CHECK OUT PAGE COPY - $35 USD (USED WHEN THEY CLICK BUTTON ON RESULTS PAGE)"
   and marks the Masterclass waitlist "ADD TO YOUR PURCHASE - MUST SAY FREE", so
   the plan is the paid item and the waitlist is the free add-on. */
/* The opt-in pop-up every "start" button opens, and the quiz cover page it
   hands off to. Copy from the client's landing page design and
   "6. QUIZ / 1. QUIZ COVER PAGE - PAGE 1 / COVER PAGE COPY.docx".
   The .docx heading says "29 QUESTIONS"; the cover artwork says 28, which is
   what the quiz actually asks, so 28 is used. */
export const optIn = {
  titleLines: ["Discover Your", "Visibility Score", "and Find Your Gap"],
  body: "Enter your details below to get your personalised Visibility Score and instant insights.",
  note: "We’ll send it straight to your inbox.",
  namePlaceholder: "Name",
  emailPlaceholder: "Email",
  phonePlaceholder: "Phone",
  button: "Get My Visibility Score Now",
  close: "Close",
};

export const quizCover = {
  eyebrow: "For entrepreneurs, coaches, speakers, authors, personal brands",
  title: "What’s actually standing between you and the opportunities you know you’re capable of?",
  stats: ["28 Questions", "Personalised Visibility Score", "3 Minute Quiz"],
  paragraphs: [
    "You know you are good at what you do. You have the experience, the knowledge and the ability to deliver. Yet somehow, you keep watching other people get the clients, stages, media opportunities, partnerships and invitations you know you could handle. You show up, work hard and keep building your expertise, but the right people still do not seem to see you at the level you know you are capable of.",
    "I became fascinated by this because every major opportunity in my career came to me. From hosting the AACTA Awards red carpet, to my first speaking tour, to being chosen to host one of the biggest entrepreneurial events in front of 12,000 people alongside Tony Robbins, Steven Bartlett, Gary Brecka and other world class speakers, I did not chase those opportunities. I was chosen for them.",
    "It is time to stop wondering what is wrong with you, why you are not being noticed, and what is keeping you from being chosen. In 3 minutes, this assessment will help you identify what is really getting in the way, where your visibility is breaking down, and exactly what to shift so the right people begin to see, recognise and choose you.",
  ],
  button: "Start quiz",
  footnote:
    "Remember to answer based on where you are right now, not where you want to be. The more honest your answers, the more useful your result.",
};

export const checkoutCopy = {
  eyebrow: "Your personalised next step",
  title: "Your Personalised Visibility Action Plan",
  priceCents: 3500,
  currency: "USD",
  inside: "Inside, you’ll get:",
  bullets: [
    "A guided AI strategy prompt tailored to your biggest visibility gap",
    "Three personalised strategy options to help you identify your strongest path forward",
    "Your personalised focus strategy showing you what to prioritise and where to focus",
    "Practical worksheets to turn your insights into clear decisions and next steps",
    "Your activation plan so you know exactly what action to take next",
    "A one week action plan to help you start putting your strategy into motion immediately",
    "A progress check to make sure your plan is clear, realistic and ready to execute",
  ],
  closing:
    "Walk away knowing exactly what to focus on, what to do next and how to start moving your visibility forward.",
  addOnLabel: "Add to your purchase",
  addOnFree: "Free",
  addOnTitle: "The Visibility Codes Masterclass",
  addOnSubtitle: "Priority Waitlist Access",
  addOnBody:
    "Learn the exact strategies that got me chosen for red carpets, major stages and to host alongside some of the world’s biggest names, even when I wasn’t the obvious choice.",
  addOnJoin:
    "Join the Priority Waitlist FREE to be first to know when doors open, plus receive early updates, priority bonuses and special launch pricing available only to Priority Waitlist members.",
  payButton: (amount: string) => `Pay ${amount}`,
  buyButton: "Complete my purchase",
  coverAlt: (edition: string) => `Visibility Action Plan, ${edition} Edition`,
  /* Which edition the buyer is getting. Without this the page said only
     "personalised to your result" and never named the edition, so the first
     mention of "Direction Edition" was inside the payment dialog. */
  editionLabel: (edition: string) => `${edition} Edition`,
  personalised: "Personalised to your result",
  noResultTitle: "We could not find your results",
  noResultBody:
    "Your Action Plan is built around the visibility gap your assessment finds, so we need your results first — it takes about 3 minutes.",
  noResultButton: "Take the 3-minute assessment",
  backToResults: "← Back to my results",
  terms: "By paying you agree to the",
  termsLink: "Terms of Purchase",
};

/* Three states, from the local thank-you page: purchased and on the waitlist,
   purchased and not, and no purchase. Each is a lead line, body copy, a set of
   cards and a closing pair. */
const SPAM =
  "If you do not see the email within the next few minutes, check your spam or promotions folder and move the email into your primary inbox.";
const MASTERCLASS = "The Visibility Codes Masterclass";

export interface ThankYouCard {
  icon: IconName;
  eyebrow?: string;
  title: string;
  small?: boolean;
  paras: string[];
  cta?: { label: string; href: "plan" | "waitlist" | "results" };
  note?: string;
  strip?: { head: string; text: string };
}

export interface ThankYouState {
  titleLines: string[];
  titleEm?: string;
  lead?: string;
  body: string[];
  cards: ThankYouCard[];
  closeA: string;
  closeB?: string;
  closeTag?: boolean;
}

export const thankYouCopy = {
  tagline: "Stand out. Be seen. Be chosen.",
  follow: "Follow @KatrinaKavvalos",
  instagram: "https://www.instagram.com/katrinakavvalos/",
  byEmail:
    "Your Action Plan is on its way to your inbox — check your email in the next few minutes.",

  paidOnWaitlist: {
    titleLines: ["Your personalised", "Visibility Action Plan is ready."],
    lead: "Purchase confirmed. You’re officially in.",
    body: [
      "You’ve taken the next step from simply knowing your visibility gap to doing something about it.",
      "Your personalised Visibility Action Plan is designed to help you turn your results into clear, focused action.",
    ],
    cards: [
      {
        icon: "mail",
        title: "Check your email",
        small: true,
        paras: [
          "Your purchase confirmation, a copy of your Visibility Action Plan and your Masterclass waitlist confirmation are on their way to your inbox.",
          SPAM,
          "Keep this email. It contains your access details and important next steps.",
        ],
      },
      {
        icon: "document",
        eyebrow: "Access now",
        title: "Access Your Visibility Action Plan",
        paras: [
          "Your Action Plan has been created around the visibility area your assessment identified as your biggest gap.",
          "Inside, you will use guided strategy, AI prompts and practical exercises to help you clarify what needs to change and decide exactly what to do next.",
        ],
        cta: { label: "Access my action plan", href: "plan" },
        note: "Save your Action Plan somewhere easy to find so you can return to it as you work through each section.",
      },
      {
        icon: "calendar",
        eyebrow: "You’re on the waitlist",
        title: MASTERCLASS,
        paras: [
          "You’re officially on the Priority Waitlist. You’ll be the first to know when doors open, plus receive early updates, priority bonuses and special launch pricing — available only to Priority Waitlist members.",
        ],
        strip: { head: "Watch your inbox", text: "We’ll be in touch with all the details." },
      },
    ],
    closeA: "You have your result. Now turn it into action.",
    closeB: "Start with your Visibility Action Plan and get ready for the next level.",
  } satisfies ThankYouState,

  paid: {
    titleLines: ["Your personalised", "Visibility Action Plan is ready."],
    lead: "Purchase confirmed. You’re officially in.",
    body: [
      "You’ve taken the next step from simply knowing your visibility gap to doing something about it.",
      "Your personalised Visibility Action Plan is ready to help you turn your results into clear, focused action.",
    ],
    cards: [
      {
        icon: "mail",
        title: "Check your email",
        small: true,
        paras: [
          "Your purchase confirmation and a copy of your Visibility Action Plan are on their way to your inbox.",
          SPAM,
          "Keep this email. It contains your access details and Action Plan link.",
        ],
      },
      {
        icon: "document",
        eyebrow: "Start here",
        title: "Access Your Visibility Action Plan",
        paras: [
          "Your Action Plan has been created around the visibility area your assessment identified as your biggest gap.",
          "Inside, you will use guided strategy, AI prompts and practical exercises to help you clarify what needs to change and decide exactly what to do next.",
        ],
        cta: { label: "Access my action plan", href: "plan" },
        note: "Save your Action Plan somewhere easy to find so you can return to it as you work through each section.",
      },
      {
        icon: "screen",
        eyebrow: "Want to go deeper?",
        title: MASTERCLASS,
        paras: [
          "Go behind the scenes and learn the exact strategies, mindset and positioning that get you chosen for red carpets, major stages and standout opportunities.",
          "The Visibility Codes Masterclass shows you how to strengthen all five areas of visibility so you can position yourself more powerfully, become more recognised and create bigger opportunities for what’s next.",
        ],
        cta: { label: "Join the priority waitlist free", href: "waitlist" },
      },
    ],
    closeA: "You have your result. Now turn it into action.",
    closeB: "Start with your Visibility Action Plan and take your first step today.",
  } satisfies ThankYouState,

  notPaid: {
    titleLines: ["Your visibility results are ready."],
    titleEm: "You now know where you stand.",
    body: [
      "Your assessment has identified your Visibility Score, your strongest visibility area and the gap that may be holding you back most.",
      "A link to your full results has been emailed to you, so you can return to them anytime.",
    ],
    cards: [
      {
        icon: "mail",
        title: "Check your email",
        small: true,
        paras: [
          "Your visibility results have been sent to your inbox.",
          SPAM,
          "Keep this email. It contains your full results and a link to return to them anytime.",
        ],
        cta: { label: "Return to my results", href: "results" },
      },
      {
        icon: "screen",
        eyebrow: "Want to go deeper?",
        title: MASTERCLASS,
        paras: [
          "Discover the exact strategies, mindset shifts and proven steps behind being chosen for red carpets, major stages and standout opportunities.",
          "Go beyond your results and learn how to strengthen all five areas of visibility so you can position yourself more powerfully, become more recognised and create the opportunities you want.",
        ],
        cta: { label: "Join the priority waitlist free", href: "waitlist" },
      },
      {
        icon: "clock",
        title: "Your results are still yours",
        small: true,
        paras: [
          "You can return to your full results anytime using the link in the email we’ve sent you. It will always be there when you need a reminder of your Visibility Score, your strongest area and the gap to focus on.",
        ],
      },
    ],
    closeA: "You know where you stand. Now decide what happens next.",
    closeTag: true,
  } satisfies ThankYouState,
};

export const resultsCopy = {
  eyebrow: "Your personalised visibility results",
  intro: ["Your assessment has identified how effectively you are currently positioned to be seen, recognised, remembered and ", "chosen", " for opportunities."],
  scoreTitle: "Your Visibility Score",
  gapLabel: "Visibility Gap",
  blockerLabel: "Primary Visibility Blocker",
  strongestLabel: "Strongest Visibility Area",
  whatThisMeansTitle: "What this means",
  // "{gap}" is replaced with the highlighted gap name, e.g. "Direction Gap".
  whatThisMeans: {
    "Hidden Potential":
      "You have real potential that most of the right people cannot see yet. Right now your visibility is not reflecting what you are capable of. Focusing on your {gap} will create the biggest shift right now.", // DRAFT
    "Emerging Visibility":
      "You have already built some visibility foundations, but there is still a significant gap between your capability and how clearly your value is seen by the people who matter. Focusing on your {gap} will create the biggest shift right now.",
    "Building Recognition":
      "You are building real recognition and people are starting to notice your value. The next step is closing the gaps that stop you being consistently chosen. Focusing on your {gap} will create the biggest shift right now.", // DRAFT
    Recognised:
      "You are recognised for what you do and opportunities are finding you. A few gaps are still limiting how far and how fast you can go. Focusing on your {gap} will create the biggest shift right now.", // DRAFT
    "Chosen Expert":
      "You are seen, trusted and chosen in your space, and your visibility is working for you. Strengthening your {gap} will help you protect and grow that position.", // DRAFT
  } satisfies Record<LevelName, string>,
  breakdownTitle: "Your visibility breakdown",
  breakdownSubtitle: "These scores show how you are performing across the five key areas of visibility.",
  strongestPanelTitle: "Where you're strongest",
  gapPanelTitle: "Your biggest visibility gap",
  quickActionTitle: "Your quick action step",
  /* This previously read "one of the bonuses you'll receive when you join The
     Visibility Codes Masterclass", which contradicts the client's check-out
     copy: "CHECK OUT PAGE COPY - $35 USD (USED WHEN THEY CLICK BUTTON ON
     RESULTS PAGE)". The plan is the paid item; the Masterclass waitlist is the
     free add-on to it. */
  bonus: (pillar: string) => ({
    before: `Your full ${pillar} Action Plan goes deeper — personalised strategy options, worksheets, a one-week plan and a progress check, built around this result.`,
    button: "Access my Action Plan",
  }),
  reportLinkText: "Want your results on another device? This link opens your exact report anywhere.",
  reportLinkButton: "Copy my report link",
  retake: "Retake the quiz",
  invalidTitle: "This report link isn't valid",
  invalidBody: "The link may have been cut short when it was copied. You can take the quiz again to get your score.",
  invalidButton: "Take the quiz",
};

/** Display order on the results page (matches the PDF). */
export const PILLAR_DISPLAY_ORDER: PillarId[] = ["direction", "recognition", "consistency", "connection", "opportunity"];

export const badgeTone: Record<Badge, "red" | "green" | "orange" | "yellow"> = {
  "Primary Blocker": "red",
  "Strongest Area": "green",
  Strong: "green",
  Building: "yellow",
  Developing: "orange",
};

interface PillarCopy {
  description: string;
  strongest: string;
  gap: string;
  action: { title: string; steps: string; closing: string };
}

export const pillarCopy: Record<PillarId, PillarCopy> = {
  direction: {
    description: "How clear you are on what you want, where you're going and who you want to become known for.",
    strongest:
      "You know what you want your visibility to lead to. That clarity means your time, content and relationships can work together and build towards the opportunities that matter most.", // DRAFT
    gap: "Your visibility lacks a clear destination. When the outcome is unclear, your content, relationships and actions pull in different directions instead of compounding.",
    action: {
      title: "Start with Direction.",
      steps:
        "Define where you want to be known for. List the top 3 outcomes you want your visibility to create in the next 12 months. Write down one clear opportunity you want next and who needs to know you for it to happen.",
      closing: "Write it down now. Clarity creates momentum.",
    },
  },
  recognition: {
    description: "How clearly your value, expertise, credibility and proof are seen, understood and remembered by others.",
    strongest:
      "You already have credibility and visible evidence that supports what you do. People are more likely to understand your value once they discover you.",
    gap: "Your value is not yet easy to see. People may not quickly understand what makes you different or why they should trust you, so opportunities go to those whose expertise is more visible.", // DRAFT
    action: {
      // DRAFT
      title: "Start with Recognition.",
      steps:
        "Write one sentence that explains what you do, who you help and what makes you different. Then gather three pieces of proof, such as a result, a testimonial or an example of your work, and make sure people can find them on your main platform.",
      closing: "Make your value obvious. Proof builds trust.",
    },
  },
  connection: {
    description: "How effectively you build genuine relationships and become known by the people and circles that matter.",
    strongest:
      "You are building genuine relationships with the people who matter. Doors open faster when the right people already know, like and trust you.", // DRAFT
    gap: "The right people do not know you yet. Without strong relationships in your industry, even great work can go unnoticed and opportunities pass you by.", // DRAFT
    action: {
      // DRAFT
      title: "Start with Connection.",
      steps:
        "List five people in your industry who could open doors for you. Choose one this week and reach out simply to add value, with no ask attached. Then follow up with the last valuable connection you made.",
      closing: "Relationships compound. Start one today.",
    },
  },
  consistency: {
    description: "How regularly and strategically you show up so the right people keep seeing and remembering you.",
    strongest:
      "You show up regularly and pay attention to what works. That rhythm keeps you front of mind, so the right people keep seeing and remembering you.", // DRAFT
    gap: "Your visibility is not yet consistent enough to be remembered. When you show up in bursts, people forget you between appearances and your momentum keeps resetting.", // DRAFT
    action: {
      // DRAFT
      title: "Start with Consistency.",
      steps:
        "Choose one platform and a posting rhythm you can keep for the next 30 days, even if it is just twice a week. Put it in your calendar. At the end of each week, note what worked best and do more of it.",
      closing: "Small, steady actions beat big bursts.",
    },
  },
  opportunity: {
    description: "How effectively your visibility turns into invitations, referrals, clients, media and other opportunities.",
    strongest:
      "Your visibility is already turning into real opportunities. People are coming to you, and you know how to use each opportunity to create the next one.", // DRAFT
    gap: "Your visibility is not yet turning into enough opportunities. You may be seen, but without a clear path from attention to invitation, you are still doing most of the chasing.", // DRAFT
    action: {
      // DRAFT
      title: "Start with Opportunity.",
      steps:
        "Look at your last good opportunity. Write down how you can use it to create the next one: share it, thank the people involved and ask who else would value what you do. Make it easy for people to invite you.",
      closing: "Every opportunity can open the next door.",
    },
  },
};

export const masterclass = {
  title: "So what now?",
  subtitle: "This is where we close your visibility gap.",
  bio: "I've built my visibility from the ground up — with over 650K+ followers on Instagram alone and close to 1 MILLION across all my social channels. I've had 70+ viral posts, hosted red carpets, worked in media and built a personal brand that gets opportunities, invitations and partnerships. Now I'll show you exactly how to do the same.",
  learnIntro: "Inside The Visibility Codes Masterclass you'll learn how to:",
  learn: [
    { icon: "target", title: "Get clarity", text: "Know your direction and what to focus on" },
    { icon: "crown", title: "Build authority", text: "Be seen as the obvious expert in your space" },
    { icon: "people", title: "Create proof", text: "Convert with the right evidence and offers" },
    { icon: "key", title: "Unlock opportunity", text: "Turn visibility into invitations and income" },
    { icon: "sparkle", title: "Create luck", text: "Make yourself known and be remembered" },
  ],
  dates: [
    { icon: "calendar", lines: ["The Visibility Codes Masterclass", "4 days. Live online.", "Masterclass starts"], date: "28 October 2026" },
    { icon: "people", lines: ["Waitlist doors open"], date: "15 October 2026" },
    { icon: "person", lines: ["Public doors open"], date: "17 October 2026" },
  ],
  googleButton: "Add 17 October to your calendar",
  icsButton: "Apple / Outlook calendar",
  calendarEvent: {
    uid: "public-doors-open-2026@thevisibilitycodes.com",
    title: "The Visibility Codes Masterclass: Public Doors Open",
    date: "2026-10-17",
    description:
      "Public doors open for The Visibility Codes Masterclass. 4 days, live online. Masterclass starts 28 October 2026.",
    url: "https://thevisibilitycodes.com",
  },
} as const;

export const referral = {
  title: "Refer a friend",
  body: "Share your personal link below with a friend and raise your True Visibility™—while saving more.",
  baseUrl: "https://www.truevisibility.com/waitlist",
  button: "Copy link",
  perks: [
    { icon: "userPlus", title: "Save", text: "Refer 1 paying friend and receive 10% off your purchase." },
    { icon: "people", title: "Go free", text: "Refer 5 paying friends and unlock your VIP ticket free." },
    { icon: "gift", title: "Earn", text: "After 5 paid referrals, unlock 10% commission on every additional paid referral." },
  ],
} as const;
