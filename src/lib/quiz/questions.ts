// Single source of truth for the quiz, transcribed from
// "FINAL QUESTIONS TABLE PILLARS TAGS SCORES.docx".

export const PILLARS = ["direction", "recognition", "connection", "consistency", "opportunity"] as const;
export type PillarId = (typeof PILLARS)[number];

export const PILLAR_NAMES: Record<PillarId, string> = {
  direction: "Direction",
  recognition: "Recognition",
  connection: "Connection",
  consistency: "Consistency",
  opportunity: "Opportunity",
};

export interface AnswerOption {
  id: string;
  label: string;
  score?: number;
  tags?: readonly string[];
}

export type QuestionType = "single" | "multi" | "text";

export interface Question {
  id: number;
  category: string;
  text: string;
  helper?: string;
  type: QuestionType;
  pillar?: PillarId;
  options: readonly AnswerOption[];
  maxLength?: number;
}

/** Answer value: option id for single, option ids for multi, free text for text. */
export type AnswerValue = string | string[];
export type Answers = Partial<Record<number, AnswerValue>>;

function tagged(pairs: [label: string, ...tags: string[]][]): AnswerOption[] {
  return pairs.map(([label, ...tags], i) => ({ id: letter(i), label, tags }));
}

function scored(pairs: [label: string, score: number][]): AnswerOption[] {
  return pairs.map(([label, score], i) => ({ id: letter(i), label, score }));
}

function plain(labels: string[]): AnswerOption[] {
  return labels.map((label, i) => ({ id: letter(i), label }));
}

function letter(i: number): string {
  return String.fromCharCode(65 + i);
}

export const QUESTIONS: readonly Question[] = [
  {
    id: 1,
    category: "Role",
    type: "single",
    text: "Which best describes what you do?",
    options: tagged([
      ["Entrepreneur or business owner", "ROLE_ENTREPRENEUR"],
      ["Coach", "ROLE_COACH"],
      ["Speaker", "ROLE_SPEAKER"],
      ["Author", "ROLE_AUTHOR"],
      ["Content creator or personal brand", "ROLE_PERSONAL_BRAND"],
      ["Other", "ROLE_OTHER"],
    ]),
  },
  {
    id: 2,
    category: "Visibility Goal",
    type: "single",
    text: "What would you most like greater visibility to help you achieve in the next 12 months?",
    helper: "Choose the ONE thing you want most.",
    options: tagged([
      ["Attract more clients and increase my income", "GOAL_CLIENTS_INCOME"],
      ["Get more speaking opportunities", "GOAL_SPEAKING"],
      ["Get more media, TV, magazine or press opportunities", "GOAL_MEDIA"],
      ["Get invited onto more podcasts or interview shows", "GOAL_PODCASTS"],
      ["Get a book deal, attract publisher interest or increase the reach of my book", "GOAL_BOOK"],
      ["Get more brand partnerships or collaborations", "GOAL_PARTNERSHIPS"],
      ["Become more recognised in my industry and get considered for bigger opportunities", "GOAL_RECOGNITION"],
      ["Other", "GOAL_OTHER"],
    ]),
  },
  {
    id: 3,
    category: "Visibility Problem",
    type: "single",
    text: "What is your biggest visibility problem right now?",
    options: tagged([
      ["I do not know where to focus", "PROBLEM_DIRECTION"],
      ["I do not stand out enough from others in my industry", "PROBLEM_DIFFERENTIATION"],
      ["Not enough people know who I am", "PROBLEM_RECOGNITION"],
      ["I do not know enough of the right people", "PROBLEM_RELATIONSHIPS"],
      ["I am posting, but I am not getting enough reach or audience growth", "PROBLEM_REACH"],
      ["I have visibility or followers, but it is not leading to enough opportunities", "PROBLEM_CONVERSION_TO_OPPORTUNITY"],
      ["I hold myself back or do not put myself forward enough", "PROBLEM_SELF_VISIBILITY"],
      ["I struggle to stay consistent", "PROBLEM_CONSISTENCY"],
      ["I am not sure what the problem is", "PROBLEM_UNKNOWN"],
      ["Other", "PROBLEM_OTHER"],
    ]),
  },
  {
    id: 4,
    category: "Primary Platform",
    type: "single",
    text: "Which social media platform do you use most for your business or personal brand?",
    options: tagged([
      ["Instagram", "PLATFORM_INSTAGRAM"],
      ["TikTok", "PLATFORM_TIKTOK"],
      ["YouTube", "PLATFORM_YOUTUBE"],
      ["LinkedIn", "PLATFORM_LINKEDIN"],
      ["Facebook", "PLATFORM_FACEBOOK"],
      ["Threads", "PLATFORM_THREADS"],
      ["X", "PLATFORM_X"],
      ["Other", "PLATFORM_OTHER"],
    ]),
  },
  {
    id: 5,
    category: "Visibility Score",
    pillar: "direction",
    type: "single",
    text: "How clear are you about what you want greater visibility to help you achieve?",
    options: scored([
      ["I am not really sure yet", 0],
      ["I want more visibility, but I have several different goals", 1],
      ["I know my main goal, but I could be more focused", 2],
      ["I know exactly what I want my visibility to lead to", 3],
    ]),
  },
  {
    id: 6,
    category: "Visibility Score",
    pillar: "direction",
    type: "single",
    text: "Do you know who can help you get the opportunities you want?",
    options: scored([
      ["No, I am not really sure who they are", 0],
      ["I know the types of people I need to know", 1],
      ["I know some of the right people", 2],
      ["Yes, I know exactly who I need to connect with", 3],
    ]),
  },
  {
    id: 7,
    category: "Visibility Score",
    pillar: "direction",
    type: "single",
    text: "Do you know where to show up to get in front of the right people?",
    helper: "For example, certain platforms, events, stages, media or industry groups.",
    options: scored([
      ["No, I am not really sure", 0],
      ["I have a general idea", 1],
      ["I know most of the places that matter", 2],
      ["Yes, I know exactly where I need to be", 3],
    ]),
  },
  {
    id: 8,
    category: "Visibility Score",
    pillar: "direction",
    type: "single",
    text: "How focused are you with your visibility right now?",
    options: scored([
      ["I am not really doing anything consistently", 0],
      ["I am trying lots of different things without a clear focus", 1],
      ["I am mostly focused on the things that matter", 2],
      ["I have a clear focus and know where to put my time and energy", 3],
    ]),
  },
  {
    id: 9,
    category: "Visibility Score",
    pillar: "direction",
    type: "single",
    text: "Are the things you are doing to become more visible helping you move towards the opportunities you want?",
    options: scored([
      ["Not really", 0],
      ["Sometimes, but a lot of what I do feels random", 1],
      ["Most of the time", 2],
      ["Yes, what I do is connected to what I want to achieve", 3],
    ]),
  },
  {
    id: 10,
    category: "Visibility Score",
    pillar: "recognition",
    type: "single",
    text: "Do you know what makes you different from other people in your industry?",
    options: scored([
      ["No, I am not really sure", 0],
      ["I have some ideas, but nothing very clear", 1],
      ["Yes, I know what makes me different", 2],
      ["Yes, I have a very clear point of difference", 3],
    ]),
  },
  {
    id: 11,
    category: "Visibility Score",
    pillar: "recognition",
    type: "single",
    text: "When people look at your business or personal brand, do they understand what you do?",
    options: scored([
      ["Not really, I often have to explain it", 0],
      ["Somewhat, but it is not always clear", 1],
      ["Yes, most people understand what I do", 2],
      ["Yes, people quickly understand what I do and what I am good at", 3],
    ]),
  },
  {
    id: 12,
    category: "Visibility Score",
    pillar: "recognition",
    type: "single",
    text: "Is there proof online that shows you are good at what you do?",
    helper:
      "For example, results, testimonials, case studies, examples of your work, media features, speaking appearances, books, awards, qualifications, brand partnerships or endorsements.",
    options: scored([
      ["Very little or none yet", 0],
      ["Yes, but I do not show much of it online", 1],
      ["Yes, I have good proof online that people can easily find", 2],
      ["Yes, I have a lot of strong proof online that builds my credibility", 3],
    ]),
  },
  {
    id: 13,
    category: "Visibility Score",
    pillar: "recognition",
    type: "single",
    text: "How big is your audience on your biggest social media platform?",
    helper: "Choose your biggest platform. Do not add your platforms together.",
    options: scored([
      ["Under 1,000", 0],
      ["1,000 to 5,000", 1],
      ["5,000 to 20,000", 1],
      ["20,000 to 100,000", 2],
      ["100,000 to 250,000", 2],
      ["250,000 to 500,000", 3],
      ["More than 500,000", 3],
    ]),
  },
  {
    id: 14,
    category: "Visibility Score",
    pillar: "recognition",
    type: "single",
    text: "Do people in your industry come to you for your advice or expertise?",
    options: scored([
      ["Never", 0],
      ["Rarely", 1],
      ["Sometimes", 2],
      ["Regularly", 3],
    ]),
  },
  {
    id: 15,
    category: "Visibility Score",
    pillar: "connection",
    type: "single",
    text: "Think about the key people in your industry who could open doors for you. How many of them know who you are?",
    options: scored([
      ["Almost none", 0],
      ["A few", 1],
      ["Quite a few", 2],
      ["Most of the key people I want to know me", 3],
    ]),
  },
  {
    id: 16,
    category: "Visibility Score",
    pillar: "connection",
    type: "single",
    text: "How often are you in the right rooms, events, groups or conversations where valuable industry connections can happen?",
    options: scored([
      ["Rarely or never", 0],
      ["Occasionally", 1],
      ["Fairly regularly", 2],
      ["Very regularly and intentionally", 3],
    ]),
  },
  {
    id: 17,
    category: "Visibility Score",
    pillar: "connection",
    type: "single",
    text: "When you meet someone who could become a valuable connection, do you follow up afterwards?",
    options: scored([
      ["Rarely", 0],
      ["Sometimes, but usually only once", 1],
      ["Usually", 2],
      ["Yes, and I make an effort to stay connected over time", 3],
    ]),
  },
  {
    id: 18,
    category: "Visibility Score",
    pillar: "connection",
    type: "single",
    text: "How often do you connect with people in your industry simply to build a genuine relationship, without wanting or expecting anything from them?",
    options: scored([
      ["Almost never", 0],
      ["Occasionally", 1],
      ["Fairly regularly", 2],
      ["Regularly, building genuine relationships is an important part of what I do", 3],
    ]),
  },
  {
    id: 19,
    category: "Inner Visibility Blocker",
    type: "single",
    text: "What do you think has held you back the most from becoming more visible?",
    helper: "Choose the ONE that feels most true for you.",
    options: tagged([
      ["I am afraid of being judged, criticised or rejected", "BLOCKER_FEAR_OF_JUDGEMENT"],
      ["I have a fear of being seen and feel uncomfortable putting myself out there", "BLOCKER_FEAR_OF_BEING_SEEN"],
      [
        "I struggle with confidence or imposter syndrome and question whether I am credible or good enough",
        "BLOCKER_IMPOSTER_CONFIDENCE",
      ],
      ["I am afraid of failing or putting myself out there and getting no result", "BLOCKER_FEAR_OF_FAILURE"],
      ["I overthink things, second guess myself or wait until everything feels perfect", "BLOCKER_OVERTHINKING"],
      ["Promoting myself feels awkward or too self promotional", "BLOCKER_SELF_PROMOTION"],
      ["I do not know where to start or what I should be doing", "BLOCKER_STRATEGY_CONFUSION"],
      ["I do not know what to say or what content to create", "BLOCKER_CONTENT_CONFUSION"],
      ["I start, but I struggle to stay consistent", "BLOCKER_CONSISTENCY"],
      ["I have tried things before and became discouraged when they did not work", "BLOCKER_DISCOURAGEMENT"],
      ["Nothing internal is really holding me back, I mainly need a better strategy", "BLOCKER_STRATEGY_ONLY"],
      ["Other", "BLOCKER_OTHER"],
    ]),
  },
  {
    id: 20,
    category: "Visibility Score",
    pillar: "consistency",
    type: "single",
    text: "How often do you currently post on social media?",
    options: scored([
      ["Rarely or never", 0],
      ["A few times a month", 1],
      ["1 to 3 times a week", 2],
      ["Daily or almost daily", 3],
      ["Multiple times a day", 3],
    ]),
  },
  {
    id: 21,
    category: "Visibility Score",
    pillar: "consistency",
    type: "single",
    text: "How often do you look at what is growing your visibility and then do more of what works?",
    options: scored([
      ["I do not really track it", 0],
      ["Occasionally", 1],
      ["Fairly regularly", 2],
      ["Regularly, I pay attention to what works and repeat it", 3],
    ]),
  },
  {
    id: 22,
    category: "Visibility Score",
    pillar: "opportunity",
    type: "single",
    text: "When did someone last approach you with an opportunity you did not ask for?",
    helper: "For example, speaking, media, podcasts, clients, partnerships, collaborations or referrals.",
    options: scored([
      ["Never", 0],
      ["More than a year ago", 1],
      ["In the last few months", 2],
      ["In the last month", 3],
    ]),
  },
  {
    id: 23,
    category: "Visibility Score",
    pillar: "opportunity",
    type: "single",
    text: "Think about your last few good opportunities. Did you find them, or did they find you?",
    options: scored([
      ["I had to find or pitch for all of them", 0],
      ["Mostly I found them, with a few coming to me", 1],
      ["Mostly they came to me through referrals, recommendations or people approaching me", 2],
      ["Almost all of them came to me", 3],
    ]),
  },
  {
    id: 24,
    category: "Visibility Score",
    pillar: "opportunity",
    type: "single",
    text: "When you get a good opportunity, do you use it to create more visibility or more opportunities?",
    options: scored([
      ["No, I usually just focus on that one opportunity", 0],
      ["Sometimes, but I do not really have a strategy", 1],
      ["Usually", 2],
      ["Yes, I deliberately use opportunities to create more visibility, relationships and opportunities", 3],
    ]),
  },
  {
    id: 25,
    category: "Experience",
    type: "single",
    text: "How many years of experience do you have in the work or industry you want to be known for?",
    options: tagged([
      ["Less than 1 year", "EXPERIENCE_UNDER_1"],
      ["1 to 3 years", "EXPERIENCE_1_3"],
      ["4 to 7 years", "EXPERIENCE_4_7"],
      ["8 to 15 years", "EXPERIENCE_8_15"],
      ["More than 15 years", "EXPERIENCE_15_PLUS"],
    ]),
  },
  {
    id: 26,
    category: "Market Research",
    type: "multi",
    text: "What have you already done to try to become more visible?",
    helper: "Select all that apply.",
    options: plain([
      "Posted more consistently on social media",
      "Networked or attended industry events",
      "Been a guest on podcasts or interview shows",
      "Tried to get media coverage or PR",
      "Spoken at events, workshops or on stages",
      "Collaborated with other people or brands",
      "Reached out or pitched myself for opportunities",
      "Used paid advertising",
      "Improved my website, social media profiles or personal brand",
      "Bought a course, joined a program or hired someone to help me become more visible",
      "I have not actively tried anything specific yet",
      "Other",
    ]),
  },
  {
    id: 27,
    category: "Buyer Intent",
    type: "single",
    text: "How serious are you about increasing your visibility over the next 12 months?",
    options: tagged([
      ["I am interested, but it is not a major priority right now", "INTENT_LOW"],
      ["I definitely want greater visibility, but I am still figuring out what I am willing to do", "INTENT_INTERESTED"],
      ["I am serious about increasing my visibility and ready to take consistent action", "INTENT_HIGH", "READY_FOR_ACTION"],
      [
        "Increasing my visibility is a major priority and I am willing to invest in the right strategy or support",
        "INTENT_HIGH",
        "READY_FOR_ACTION",
        "READY_TO_INVEST",
      ],
    ]),
  },
  {
    id: 28,
    category: "Written Market Research",
    type: "text",
    text: "What do you feel is the biggest thing stopping you from getting the visibility or opportunities you want?",
    helper: "Please keep your answer to one or two sentences.",
    options: [],
    maxLength: 500,
  },
];

export const SCORED_QUESTIONS: readonly Question[] = QUESTIONS.filter((q) => q.pillar !== undefined);

export function getQuestion(id: number): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
