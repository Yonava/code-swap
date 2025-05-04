import { Challenge } from "../challenges";
import { ChallengeData, ChallengeSetSubmissions } from "../game-management";
import { Match } from "../match-making";

export const SCORING_CHANNEL_PREFIX = "scoring";

export const SCORING_CHANNEL = {
  MATCH_READY_TO_SCORE: `${SCORING_CHANNEL_PREFIX}.matchReadyToScore`,
  MATCH_RESULT: `${SCORING_CHANNEL_PREFIX}.matchResult`,
} as const;

export type ScoringChannel =
  (typeof SCORING_CHANNEL)[keyof typeof SCORING_CHANNEL];

export type MatchReadyToScore = {
  matchId: Match["id"];
  challengeSet: [ChallengeSetSubmissions, ChallengeSetSubmissions];
};

export type ChallengeResult = {
  challengeId: Challenge['id'],
  challengeTitle: Challenge['title'],
  gradedCodeSubmission: [ChallengeData['code'], ChallengeData['code']],
  testCasesPassed: [number, number],
  totalTestCases: number
}

export type MatchResult = {
  matchId: Match["id"];
  result: readonly [ChallengeResult, ChallengeResult]
};
