import { listenToChannel, logResponse } from '../listenToChannel';
import {
  Challenge,
  GAME_MANAGEMENT_CHANNEL,
  StartMatch,
  UpdateCodeSubmission,
} from 'shared-types';
import { RedisClient } from '../redis';
import {
  createChallengeRounds,
  fetchChallenges,
  NUMBER_OF_ROUNDS,
  packChallengesByRound,
  TIME_FROM_START_TO_START
} from '../createChallengeRounds';
import { ChallengeSetSubmissions, codeSubmissions } from '../db/codeSubmissions';
import { playerToTeam } from '../db/playerToTeam';

const { pub } = RedisClient.getInstance()
const { START_MATCH, START_CHALLENGE, END_CHALLENGE, UPDATE_CODE_SUBMISSION } = GAME_MANAGEMENT_CHANNEL

const getNewChallengeSetSubmissionObj = (challenges: Challenge[]) => challenges.reduce<ChallengeSetSubmissions>((acc, curr) => {
  acc[curr.id] = curr?.startingCode ?? ''
  return acc
}, {})

listenToChannel<StartMatch>({
  from: START_MATCH,
  fn: async ({ match }) => {
    const challenges = await fetchChallenges(NUMBER_OF_ROUNDS * 2)
    const challengesByRound = packChallengesByRound(challenges)
    const [starts, ends] = createChallengeRounds(match, challengesByRound)

    logResponse({ channel: START_MATCH, payload: JSON.stringify(starts) })

    codeSubmissions.set(match.id, [
      getNewChallengeSetSubmissionObj(challenges),
      getNewChallengeSetSubmissionObj(challenges),
    ])

    for (let i = 0; i < starts.length; i++) {
      setTimeout(() => {
        pub.publish(START_CHALLENGE, JSON.stringify(starts[i]))
      }, i * TIME_FROM_START_TO_START)
    }

    for (let i = 0; i < ends.length; i++) {
      setTimeout(() => {
        pub.publish(END_CHALLENGE, JSON.stringify(ends[i]))
      }, (i * TIME_FROM_START_TO_START) + TIME_FROM_START_TO_START)
    }
  }
})

listenToChannel<UpdateCodeSubmission>({
  from: UPDATE_CODE_SUBMISSION,
  fn: async ({ playerId, matchId, challengeId, code }) => {
    const match = codeSubmissions.get(matchId)
    if (!match) {
      console.log('match not found')
      return
    }

    const team = playerToTeam.get(playerId)
    if (team === undefined) {
      console.log('team not found')
      return
    }

    match[team][challengeId] = code
  }
})