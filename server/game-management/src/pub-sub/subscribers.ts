import { listenToChannel, logResponse } from '../listenToChannel';
import {
  Challenge,
  GAME_MANAGEMENT_CHANNEL,
  Player,
  StartChallenge,
  StartMatch,
  UpdateCodeSubmission,
} from 'shared-types';
import { RedisClient } from '../redis';
import {
  createChallengeRounds,
  fetchChallenges,
  NUMBER_OF_ROUNDS,
  packChallengesByRound,
  TIME_FROM_START_TO_END,
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

const injectCurrentSubmissionState = (challenge: StartChallenge) => {
  console.log('injecting in progress')

  const matchSubmissions = codeSubmissions.get(challenge.matchId)

  if (!matchSubmissions) {
    console.log('no submissions on match that should exist')
    return
  }

  const playerIdToChallengeId = Object.entries(challenge.challenges).reduce((acc, [playerId, { challengeId }]) => {
    acc[playerId] = challengeId
    return acc
  }, {} as Record<Player['id'], Challenge['id']>)

  const playerIds = Object.keys(challenge.challenges)

  for (const playerId of playerIds) {
    const team = playerToTeam.get(playerId)
    if (team === undefined) {
      console.log('player should be assigned to a team but was not :(')
      return
    }

    const challengeId = playerIdToChallengeId[playerId]
    const currentSubmission = matchSubmissions[team][challengeId]
    challenge.challenges[playerId].code = currentSubmission
  }
}

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

    playerToTeam.set(match.teams[0][0].id, 0)
    playerToTeam.set(match.teams[0][1].id, 0)

    playerToTeam.set(match.teams[1][0].id, 1)
    playerToTeam.set(match.teams[1][1].id, 1)

    for (let i = 0; i < starts.length; i++) {
      setTimeout(() => {
        const { challenges } = starts[i]
        injectCurrentSubmissionState(starts[i])
        pub.publish(START_CHALLENGE, JSON.stringify(starts[i]))
      }, i * TIME_FROM_START_TO_START)
    }

    for (let i = 0; i < ends.length; i++) {
      setTimeout(() => {
        pub.publish(END_CHALLENGE, JSON.stringify(ends[i]))
      }, (i * TIME_FROM_START_TO_START) + TIME_FROM_START_TO_END)
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