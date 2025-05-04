import { Challenge } from "../challenges";
import { ChallengeData, ChallengeSetSubmissions } from "../game-management";
import { Match } from "../match-making";
export declare const SCORING_CHANNEL_PREFIX = "scoring";
export declare const SCORING_CHANNEL: {
    readonly MATCH_READY_TO_SCORE: "scoring.matchReadyToScore";
    readonly MATCH_RESULT: "scoring.matchResult";
};
export type ScoringChannel = (typeof SCORING_CHANNEL)[keyof typeof SCORING_CHANNEL];
export type MatchReadyToScore = {
    matchId: Match["id"];
    challengeSet: [ChallengeSetSubmissions, ChallengeSetSubmissions];
};
export type ChallengeResult = {
    challengeId: Challenge['id'];
    challengeTitle: Challenge['title'];
    gradedCodeSubmission: [ChallengeData['code'], ChallengeData['code']];
    testCasesPassed: [number, number];
    totalTestCases: number;
};
export type MatchResult = {
    matchId: Match["id"];
    result: readonly [ChallengeResult, ChallengeResult];
};
