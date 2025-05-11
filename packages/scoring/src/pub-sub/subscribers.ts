import { listenToChannel } from "../listenToChannel";
import { Challenge, ChallengeData, ChallengeResult, MatchReadyToScore, MatchResult, SCORING_CHANNEL } from "shared-types";
import { fetchChallenge, runTestCases } from "../utils";

const getChallengeResult = async (challengeId: Challenge['id'], challengeData: [ChallengeData, ChallengeData]): Promise<ChallengeResult> => {
  const res = await fetchChallenge(challengeId);
  if (!res.challenge) throw res.error

  const { code: team1Code } = challengeData[0]
  const { code: team2Code } = challengeData[1]

  const team1Result = await runTestCases(team1Code, res.challenge.testCases)
  const team2Result = await runTestCases(team2Code, res.challenge.testCases)

  return {
    challengeId,
    challengeTitle: res.challenge.title,
    gradedCodeSubmission: [team1Code, team2Code],
    testCasesPassed: [team1Result.passed, team2Result.passed],
    totalTestCases: res.challenge.testCases.length
  }
}

listenToChannel<MatchReadyToScore, MatchResult>({
  from: SCORING_CHANNEL.MATCH_READY_TO_SCORE,
  replyTo: SCORING_CHANNEL.MATCH_RESULT,
  fn: async ({ matchId, challengeSet }) => {
    const [challengeId1, challengeId2] = Object.keys(challengeSet[0])
    const result = [
      await getChallengeResult(challengeId1, [challengeSet[0][challengeId1], challengeSet[1][challengeId1]]),
      await getChallengeResult(challengeId2, [challengeSet[0][challengeId2], challengeSet[1][challengeId2]])
    ] as const

    return {
      matchId,
      result,
    }
  },
});
