import axios from "axios"
import { Challenge } from "shared-types"

export const fetchChallenges = async (count: number) => {
  const baseUrl = process.env.CHALLENGES_URL || 'http://localhost:3003'
  const CHALLENGE_URL = `${baseUrl}/challenges/random?count=${count}`
  const { data } = await axios.get<Challenge[] | { error: string }>(CHALLENGE_URL)
  if ('error' in data) throw new Error(data.error)
  return data
}

/**
 * time from start of round to end of round
 */
export const TIME_FROM_START_TO_END = 1_000 * 30

/**
 * time between the end of a round and the start of a new round event
 */
export const TIME_FROM_END_TO_START = 1_000 * 5

/**
 * the time given to the team that has not yet submitted their
 * final code before scoring commences
 */
export const TIME_BEFORE_MATCH_ENDS = 1_000 * 15