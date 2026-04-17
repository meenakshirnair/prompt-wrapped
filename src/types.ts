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