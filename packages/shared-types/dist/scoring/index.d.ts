import { Challenge } from "../challenges";
import { ChallengeSetSubmissions } from "../game-management";
import { Match } from "../match-making";
export declare const SCORING_CHANNEL_PREFIX = "scoring";
export declare const SCORING_CHANNEL: {
    MATCH_READY_TO_SCORE: string;
    MATCH_RESULT: string;
};
export type ScoringChannel = (typeof SCORING_CHANNEL)[keyof typeof SCORING_CHANNEL];
export type MatchReadyToScore = {
    matchId: Match["id"];
    challengeSet: [ChallengeSetSubmissions, ChallengeSetSubmissions];
};
export type ChallengeResult = {
    challengeId: Challenge['id'];
    challengeTitle: Challenge['title'];
    testCasesPassed: [number, number];
    totalTestCases: number;
};
export type MatchResult = {
    matchId: Match["id"];
    result: [ChallengeResult, ChallengeResult];
};
