// All visible copy and links live here so they can be edited in one place.
//
// Copy marked "DRAFT" was written by the developer to fill gaps in the client's
// designs and needs client approval. Everything else is taken from the client's
// font card, brand card and results page PDF.

import type { PillarId } from "@/lib/quiz/questions";
import type { Badge, LevelName } from "@/lib/quiz/scoring";

export const brand = {
  tagline: "Stand out · Be seen · Be chosen",
  copyright: "© 2026 Katrina Kavvalos International",
  // TODO(client): real Privacy Policy and Terms URLs.
  privacyUrl: "#",
  termsUrl: "#",
  instagramHandle: "@KatrinaKavvalos",
  hashtag: "#TheVisibilityCodes",
  websiteLabel: "TheVisibilityCodes.com",
  websiteUrl: "https://thevisibilitycodes.com",
};

// Cover page copy, word for word from the client's cover page design.
// Uppercase styling is applied in CSS so screen readers read words, not letters.
export const landing = {
  eyebrow: "For entrepreneurs, coaches, speakers, authors, personal brands",
  headingLines: ["What’s actually standing between", "you and the opportunities", "you know you’re capable of?"],
  pills: ["28 questions", "Personalised visibility score", "3 minute quiz"],
  paragraphs: [
    "You know you are good at what you do. You have the experience, the knowledge and the ability to deliver. Yet somehow, you keep watching other people get the clients, stages, media opportunities, partnerships and invitations you know you could handle. You show up, work hard and keep building your expertise, but the right people still do not seem to see you at the level you know you are capable of.",
    "I became fascinated by this because every major opportunity in my career came to me. From hosting the AACTA Awards red carpet, to my first speaking tour, to being chosen to host one of the biggest entrepreneurial events in front of 12,000 people alongside Tony Robbins, Steven Bartlett, Gary Brecka and other world class speakers, I did not chase those opportunities. I was chosen for them.",
    "It is time to stop wondering what is wrong with you, why you are not being noticed, and what is keeping you from being chosen. In 3 minutes, this assessment will help you identify what is really getting in the way, where your visibility is breaking down, and exactly what to shift so the right people begin to see, recognise and choose you.",
  ],
  button: "Start quiz",
  reminder: [
    "Remember to answer based on where you are right now, not where you want to be.",
    "The more honest your answers, the more useful your result.",
  ],
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
  bonus: (pillar: string) => ({
    before: `The full ${pillar} Action Plan (with deeper exercises and prompts) is one of the bonuses you'll receive when you join `,
    link: "The Visibility Codes Masterclass.",
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
