import { listenToChannel, pubSubLogger } from '../listenToChannel';
import {
  GAME_MANAGEMENT_CHANNEL,
  StartMatch,
  StartChallenge,
  Challenge,
} from 'shared-types';
import axios from 'axios'

const { START_MATCH, START_CHALLENGE } = GAME_MANAGEMENT_CHANNEL

const fetchChallenges = async () => {
  const CHALLENGE_URL = `http://localhost:3003/challenges/random?count=2`
  const { data } = await axios.get<Challenge[] | { error: string }>(CHALLENGE_URL)
  if ('error' in data) throw new Error(data.error)
  return data
}

listenToChannel<StartMatch, StartChallenge>({
  from: START_MATCH,
  replyTo: START_CHALLENGE,
  fn: async ({ match }) => {
    const challenges = await fetchChallenges()
    const [team1, team2] = match.teams
    const [t1p1, t1p2] = team1
    const [t2p1, t2p2] = team2

    return {
      matchId: match.id,
      round: 1,
      endsAt: 204,
      challenges: {
        [t1p1.id]: {
          challengeId: challenges[0].id,
          code: challenges[0].startingCode ?? ''
        },
        [t1p2.id]: {
          challengeId: challenges[1].id,
          code: challenges[0].startingCode ?? ''
        },
      }
    }
  }
})