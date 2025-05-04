import axios from "axios"
import { Challenge } from "shared-types"

export const fetchChallenges = async (count: number) => {
  const CHALLENGE_URL = `http://localhost:3003/challenges/random?count=${count}`
  const { data } = await axios.get<Challenge[] | { error: string }>(CHALLENGE_URL)
  if ('error' in data) throw new Error(data.error)
  return data
}

/**
 * time from start of round to end of round
 */
export const TIME_FROM_START_TO_END = 1_000 * 20

/**
 * time between the end of a round and the start of a new round event
 */
export const TIME_FROM_END_TO_START = 1_000 * 5