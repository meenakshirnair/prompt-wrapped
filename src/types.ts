// The clean, normalized shape that all parsers output.
// Everything downstream (charts, stats, Wrapped card) uses this.

export type Role = "user" | "assistant"

export type Source = "claude" | "chatgpt"

export interface Message {
  role: Role
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export interface NormalizedData {
  source: Source
  conversations: Conversation[]
}

// The computed stats output. Every chart and stat card reads from this.

export interface DailyCount {
  date: string   // YYYY-MM-DD
  count: number
}

export interface HourlyCount {
  hour: number   // 0 to 23
  count: number
}

export interface WeekdayCount {
  day: number    // 0 = Sunday, 6 = Saturday
  count: number
}

export interface Metrics {
  // Totals
  totalConversations: number
  totalMessages: number
  totalUserMessages: number
  totalAssistantMessages: number
  totalUserWords: number
  totalAssistantWords: number

  // Timeframe
  firstMessageDate: Date | null
  lastMessageDate: Date | null
  activeDays: number      // number of unique days you chatted

  // Averages
  avgMessagesPerConversation: number
  avgUserWordsPerMessage: number

  // Extremes
  longestConversationLength: number
  longestConversationTitle: string

  // Time patterns
  messagesByDay: DailyCount[]
  messagesByHour: HourlyCount[]
  messagesByWeekday: WeekdayCount[]

  // Streaks
  currentStreak: number
  longestStreak: number
}