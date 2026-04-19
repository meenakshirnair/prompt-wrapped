import type { NormalizedData } from "../types"
import { parseClaude } from "./parseClaude"
import { parseChatGPT } from "./parseChatGPT"

/**
 * Auto-detect whether a JSON export is from Claude or ChatGPT,
 * then parse it into normalized form.
 *
 * Throws if the format isn't recognized.
 */
export function detectAndParse(raw: unknown): NormalizedData {
  if (!Array.isArray(raw)) {
    throw new Error("Expected an array of conversations.")
  }
  if (raw.length === 0) {
    throw new Error("This file contains zero conversations.")
  }

  const first = raw[0] as Record<string, unknown>

  // ChatGPT signature: has `mapping` (object) and `conversation_id`
  if (first && typeof first === "object" && "mapping" in first && "conversation_id" in first) {
    return parseChatGPT(raw as any)
  }

  // Claude signature: has `chat_messages` and `uuid`
  if (first && typeof first === "object" && "chat_messages" in first && "uuid" in first) {
    return parseClaude(raw as any)
  }

  throw new Error("This doesn't look like a Claude or ChatGPT export. Are you sure you uploaded the right file?")
}