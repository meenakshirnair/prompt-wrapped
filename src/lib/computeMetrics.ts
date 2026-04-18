import type {
  NormalizedData,
  Metrics,
  DailyCount,
  HourlyCount,
  WeekdayCount,
  TopicCount,
  Topic,
} from "../types"
import { classifyTopic, TOPIC_LABELS } from "./classifyTopic"

/**
 * Takes normalized data and returns all computed metrics.
 * Pure function — given the same input, always returns the same output.
 */
export function computeMetrics(data: NormalizedData): Metrics {
  const { conversations } = data

  // Handle empty input gracefully
  if (conversations.length === 0) {
    return emptyMetrics()
  }

  // Flatten all messages with their timestamp info for easy iteration
  const allMessages = conversations.flatMap(c => c.messages)
  const userMessages = allMessages.filter(m => m.role === "user")
  const assistantMessages = allMessages.filter(m => m.role === "assistant")

  // Word counts
  const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length
  const totalUserWords = userMessages.reduce((sum, m) => sum + countWords(m.content), 0)
  const totalAssistantWords = assistantMessages.reduce((sum, m) => sum + countWords(m.content), 0)

  // Dates
  const timestamps = allMessages.map(m => m.timestamp.getTime()).sort((a, b) => a - b)
  const firstMessageDate = new Date(timestamps[0])
  const lastMessageDate = new Date(timestamps[timestamps.length - 1])

  // Time bucket aggregations
  const dayMap = new Map<string, number>()
  const hourMap = new Map<number, number>()
  const weekdayMap = new Map<number, number>()

  for (const msg of allMessages) {
    const d = msg.timestamp
    const dayKey = toDayKey(d)
    dayMap.set(dayKey, (dayMap.get(dayKey) ?? 0) + 1)
    hourMap.set(d.getHours(), (hourMap.get(d.getHours()) ?? 0) + 1)
    weekdayMap.set(d.getDay(), (weekdayMap.get(d.getDay()) ?? 0) + 1)
  }

  const messagesByDay: DailyCount[] = Array.from(dayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const messagesByHour: HourlyCount[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourMap.get(hour) ?? 0,
  }))

  const messagesByWeekday: WeekdayCount[] = Array.from({ length: 7 }, (_, day) => ({
    day,
    count: weekdayMap.get(day) ?? 0,
  }))

  // Streaks
  const activeDayKeys = [...dayMap.keys()].sort()
  const { currentStreak, longestStreak } = computeStreaks(activeDayKeys)

  // Longest conversation
  let longestConvo = conversations[0]
  for (const c of conversations) {
    if (c.messages.length > longestConvo.messages.length) longestConvo = c
  }

  // Topic classification
  const topicMap = new Map<Topic, number>()
  for (const msg of userMessages) {
    const topic = classifyTopic(msg.content)
    topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1)
  }

  const topics: TopicCount[] = Array.from(topicMap.entries())
    .map(([topic, count]) => ({
      topic,
      label: TOPIC_LABELS[topic],
      count,
      percentage: userMessages.length > 0 ? (count / userMessages.length) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    totalConversations: conversations.length,
    totalMessages: allMessages.length,
    totalUserMessages: userMessages.length,
    totalAssistantMessages: assistantMessages.length,
    totalUserWords,
    totalAssistantWords,

    firstMessageDate,
    lastMessageDate,
    activeDays: dayMap.size,

    avgMessagesPerConversation: allMessages.length / conversations.length,
    avgUserWordsPerMessage: userMessages.length > 0
      ? totalUserWords / userMessages.length
      : 0,

    longestConversationLength: longestConvo.messages.length,
    longestConversationTitle: longestConvo.title,

    messagesByDay,
    messagesByHour,
    messagesByWeekday,

    currentStreak,
    longestStreak,

    topics,
  }
}

/** Return a YYYY-MM-DD key from a Date, in local time. */
function toDayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/**
 * Given a sorted array of YYYY-MM-DD strings representing days on which
 * the user was active, return the longest streak ever and the current streak
 * (counting back from today).
 */
function computeStreaks(sortedDayKeys: string[]): { currentStreak: number; longestStreak: number } {
  if (sortedDayKeys.length === 0) return { currentStreak: 0, longestStreak: 0 }

  const daySet = new Set(sortedDayKeys)

  // Longest ever streak
  let longest = 1
  let running = 1
  for (let i = 1; i < sortedDayKeys.length; i++) {
    const prev = new Date(sortedDayKeys[i - 1])
    const curr = new Date(sortedDayKeys[i])
    const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 1) {
      running++
      longest = Math.max(longest, running)
    } else {
      running = 1
    }
  }

  // Current streak (counting back from today)
  let current = 0
  const today = new Date()
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  while (daySet.has(toDayKey(cursor))) {
    current++
    cursor.setDate(cursor.getDate() - 1)
  }

  return { currentStreak: current, longestStreak: longest }
}

function emptyMetrics(): Metrics {
  return {
    totalConversations: 0,
    totalMessages: 0,
    totalUserMessages: 0,
    totalAssistantMessages: 0,
    totalUserWords: 0,
    totalAssistantWords: 0,
    firstMessageDate: null,
    lastMessageDate: null,
    activeDays: 0,
    avgMessagesPerConversation: 0,
    avgUserWordsPerMessage: 0,
    longestConversationLength: 0,
    longestConversationTitle: "",
    messagesByDay: [],
    messagesByHour: [],
    messagesByWeekday: [],
    currentStreak: 0,
    longestStreak: 0,
    topics: [],
  }
}