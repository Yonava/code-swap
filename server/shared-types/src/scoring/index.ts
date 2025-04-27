import { ChallengeSetSubmissions } from "../game-management";
import { Match } from "../match-making";

export const SCORING_CHANNEL_PREFIX = "scoring";

export const SCORING_CHANNEL = {
  CHALLENGE_RESULT: `${SCORING_CHANNEL_PREFIX}.challengeResult`,
  MATCH_READY_TO_SCORE: `${SCORING_CHANNEL_PREFIX}.matchReadyToScore`,
  MATCH_RESULT: `${SCORING_CHANNEL_PREFIX}.matchResult`,
};

export type ScoringChannel =
  (typeof SCORING_CHANNEL)[keyof typeof SCORING_CHANNEL];

export type MatchReadyToScore = {
  matchId: Match["id"];
  challengeSet: [ChallengeSetSubmissions, ChallengeSetSubmissions];
};

export type ChallengeResult = {
  matchId: Match["id"];
  challengeId: string;
  result: {
    testCasesPassed: [number, number];
    totalTestCases: number;
  };
};

export type MatchResult = {
  matchId: Match["id"];
  finalScore: [number, number];
};
