# Data Shape Notes

## Claude export — schema confirmed ✅

**Top level:** array of conversation objects (45 in my file)

**Conversation fields:**
- `uuid` — unique ID
- `name` — title string; empty for unnamed/unsaved chats (use "Untitled" fallback)
- `summary` — short summary (often empty, ignore for now)
- `created_at` / `updated_at` — ISO timestamp strings
- `chat_messages` — array of message objects

**Message fields:**
- `uuid` — message ID
- `sender` — "human" or "assistant" (map to "user"/"assistant")
- `text` — plain text string; populated for real messages
- `content` — array of content blocks, where `content[0].text` mirrors `text`
- `created_at` — ISO timestamp string

**Parser rules:**
- Use `m.text` first, fall back to `m.content?.[0]?.text`, else skip
- Empty conversation names → "Untitled"
- Conversations can have 0 messages (skip them)
- Messages can be empty strings (skip them)

## ChatGPT export — TODO
(parse once the email export arrives)

## Edge cases encountered
- Conversation 1: has 2 messages, both empty text and empty content[0].text
- Conversation 2: has 0 messages
- Real conversations (like "Cold email job applications"): both text and content[0].text populated with identical strings