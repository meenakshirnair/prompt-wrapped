import type { Topic } from "../types"

// Keyword rules. Order matters — more specific categories first so they win ties.
// Each rule: a set of keywords that, if any appear, classify the message into that topic.
const RULES: Array<{ topic: Topic; keywords: RegExp }> = [
  {
    topic: "career",
    keywords: /\b(resume|cv|cover letter|job|interview|linkedin|recruiter|hiring|hr|offer letter|salary|h1b|visa|sponsor|opt|application|applying|hiring manager|outreach|referral|onsite|technical screen|recruiter call|career|role|position|jd|job description|apply|applying)\b/i,
  },
  {
    topic: "coding",
    keywords: /\b(code|coding|bug|error|function|api|typescript|javascript|python|react|sql|database|debug|git|npm|console|compile|import|export|async|await|endpoint|docker|kubernetes|regex|syntax|stack trace|null|undefined|html|css|component|state|hook|backend|frontend|repo|github|deploy|build|install|terminal)\b/i,
  },
  {
    topic: "writing",
    keywords: /\b(write|writing|draft|rewrite|edit|email|message|essay|blog|article|post|caption|headline|newsletter|proofread|rephrase|paraphrase|tone|sentence|paragraph|linkedin post|outreach email|cold email|pitch)\b/i,
  },
  {
    topic: "data",
    keywords: /\b(data|analyze|analysis|analytics|dashboard|chart|visualize|visualization|excel|spreadsheet|csv|query|metric|kpi|tableau|power bi|looker|pandas|dataframe|forecast|regression|correlation|segment|insight|trend|statistic)\b/i,
  },
  {
    topic: "learning",
    keywords: /\b(explain|how does|why does|what is|what are|what does|teach me|help me understand|tutorial|beginner|concept|difference between|example of|meaning of|definition|walkthrough|step by step|guide me|show me how|learn)\b/i,
  },
  {
    topic: "planning",
    keywords: /\b(plan|planning|strategy|should i|help me decide|roadmap|timeline|schedule|goal|priority|prioritize|decision|trade[- ]off|weigh|pros and cons|recommend|recommendation|approach|best way|brainstorm|idea|project|organize)\b/i,
  },
  {
    topic: "personal",
    keywords: /\b(feeling|feel|relationship|friend|family|anxious|anxiety|stressed|advice|life|motivation|therapist|dating|partner|health|doctor|sleep|workout|exercise|diet|meditation|coffee|food|recipe|travel|trip)\b/i,
  },
]

/**
 * Classify a single user message into a topic bucket.
 * Runs through rules in order; first match wins.
 */
export function classifyTopic(text: string): Topic {
  for (const rule of RULES) {
    if (rule.keywords.test(text)) {
      return rule.topic
    }
  }
  return "other"
}

/** Pretty display names for each topic. */
export const TOPIC_LABELS: Record<Topic, string> = {
  coding: "Coding & tech",
  career: "Career & job search",
  writing: "Writing & editing",
  data: "Data & analysis",
  learning: "Learning & explaining",
  planning: "Planning & strategy",
  personal: "Personal & life",
  other: "Other",
}