import { Challenge } from "../challenges"
import { Player } from "../match-making"

export const GAME_MANAGEMENT_CHANNEL_PREFIX = 'gameManagement'

export const GAME_MANAGEMENT_CHANNELS = {
  START_MATCH: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.startMatch`,
  START_CHALLENGE: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.startChallenge`,
  END_CHALLENGE: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.endChallenge`
} as const

export type StartChallenge = {
  /**
   * the round of the challenge. Each challenge question is associated with one round
   */
  round: number,
  /**
   * unix timestamp of when the player submission period is scheduled to end.
   * A player submission period is the window that a user can write code for a challenge
   * and game management will consider it within the valid time box
   */
  endsAt: string,
  /**
   * maps a player id to the challenge question they are receiving
   */
  challenges: Record<Player['id'], {
    challengeId: Challenge['id'],
    /**
     * this code will replace the content in the players editor
     */
    code: string
  }>
}

export type EndChallenge = {
  /**
   * unix timestamp of when the next challenge will start.
   * `undefined` if that was the last challenge
   */
  startsAt: string | undefined
}