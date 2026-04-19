import type { NormalizedData, Conversation, Message, Role } from "../types"

// ChatGPT export shape (what we care about)
interface ChatGPTRawMessage {
  id: string
  author: {
    role: "user" | "assistant" | "system" | "tool"
    name: string | null
  }
  content: {
    content_type: string
    parts?: Array<string | { type: string; [key: string]: any }>
  }
  create_time: number | null
}

interface ChatGPTRawNode {
  id: string
  parent: string | null
  children: string[]
  message: ChatGPTRawMessage | null
}

interface ChatGPTRawConversation {
  conversation_id: string
  title: string | null
  create_time: number
  update_time: number
  mapping: Record<string, ChatGPTRawNode>
  current_node?: string
}

/**
 * Walk ChatGPT's mapping tree from the current_node back to the root,
 * which gives us the most recent linear thread of messages.
 *
 * ChatGPT stores conversations as a graph because of "regenerate response" —
 * we want the actual conversation the user saw, which is the path ending
 * at current_node.
 */
function walkConversation(rawConvo: ChatGPTRawConversation): ChatGPTRawNode[] {
  const { mapping, current_node } = rawConvo
  if (!current_node || !mapping[current_node]) {
    // Fallback: return all nodes in mapping order
    return Object.values(mapping)
  }

  const path: ChatGPTRawNode[] = []
  let cursor: string | null = current_node
  while (cursor && mapping[cursor]) {
    path.unshift(mapping[cursor])
    cursor = mapping[cursor].parent
  }
  return path
}

/**
 * Extract plain text from a message's content.parts array.
 * Skips image/file parts, joins string parts.
 */
function extractText(message: ChatGPTRawMessage): string {
  if (!message.content?.parts) return ""
  return message.content.parts
    .filter((p): p is string => typeof p === "string")
    .join("\n")
    .trim()
}

/**
 * Takes ChatGPT's raw export and returns normalized data.
 *
 * Edge cases:
 * - System & tool messages → skip
 * - Empty messages → skip
 * - Conversations with no usable messages → skip
 * - Untitled conversations → "Untitled"
 */
export function parseChatGPT(raw: ChatGPTRawConversation[]): NormalizedData {
  const conversations: Conversation[] = []

  for (const rawConvo of raw) {
    const messages: Message[] = []
    const nodes = walkConversation(rawConvo)

    for (const node of nodes) {
      if (!node.message) continue
      const role = node.message.author?.role
      if (role !== "user" && role !== "assistant") continue

      const text = extractText(node.message)
      if (text.length === 0) continue

      const ts = node.message.create_time ?? rawConvo.create_time
      messages.push({
        role: role as Role,
        content: text,
        timestamp: new Date(ts * 1000),  // Unix seconds → JS milliseconds
      })
    }

    if (messages.length === 0) continue

    conversations.push({
      id: rawConvo.conversation_id,
      title: rawConvo.title?.trim() || "Untitled",
      createdAt: new Date(rawConvo.create_time * 1000),
      updatedAt: new Date(rawConvo.update_time * 1000),
      messages,
    })
  }

  return {
    source: "chatgpt",
    conversations,
  }
}