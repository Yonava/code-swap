import { listenToChannel, logResponse } from '../listenToChannel';
import {
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

const { pub } = RedisClient.getInstance()
const { START_MATCH, START_CHALLENGE, END_CHALLENGE, UPDATE_CODE_SUBMISSION } = GAME_MANAGEMENT_CHANNEL

listenToChannel<StartMatch>({
  from: START_MATCH,
  fn: async ({ match }) => {
    const challenges = await fetchChallenges(NUMBER_OF_ROUNDS * 2)
    const challengesByRound = packChallengesByRound(challenges)
    const [starts, ends] = createChallengeRounds(match, challengesByRound)

    logResponse({ channel: START_MATCH, payload: JSON.stringify(starts) })

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
    console.log('updating', playerId, challengeId, code)
  }
})