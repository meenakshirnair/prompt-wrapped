import type { NormalizedData, Conversation, Message, Role } from "../types"

// Claude's raw export has these shapes. We type them loosely as `any`
// because we don't control that data and it's messier than we care about.
interface ClaudeRawMessage {
  uuid: string
  sender: "human" | "assistant"
  text?: string
  content?: Array<{ type: string; text?: string }>
  created_at: string
}

interface ClaudeRawConversation {
  uuid: string
  name: string
  created_at: string
  updated_at: string
  chat_messages: ClaudeRawMessage[]
}

/**
 * Takes Claude's raw export (an array of conversations) and returns
 * a normalized NormalizedData object.
 *
 * Handles edge cases we found on Day 2:
 * - Conversations with no name → "Untitled"
 * - Conversations with 0 messages → skipped entirely
 * - Messages with empty text → skipped
 * - Messages where `text` is empty but `content[0].text` has the content
 */
export function parseClaude(raw: ClaudeRawConversation[]): NormalizedData {
  const conversations: Conversation[] = []

  for (const rawConvo of raw) {
    const messages: Message[] = []

    for (const rawMsg of rawConvo.chat_messages ?? []) {
      // Pick the best text source: `text` first, fall back to content[0].text
      const text = rawMsg.text?.trim() || rawMsg.content?.[0]?.text?.trim() || ""

      // Skip empty messages
      if (text.length === 0) continue

      // Map sender → role
      const role: Role = rawMsg.sender === "human" ? "user" : "assistant"

      messages.push({
        role,
        content: text,
        timestamp: new Date(rawMsg.created_at),
      })
    }

    // Skip conversations with no usable messages
    if (messages.length === 0) continue

    conversations.push({
      id: rawConvo.uuid,
      title: rawConvo.name?.trim() || "Untitled",
      createdAt: new Date(rawConvo.created_at),
      updatedAt: new Date(rawConvo.updated_at),
      messages,
    })
  }

  return {
    source: "claude",
    conversations,
  }
}