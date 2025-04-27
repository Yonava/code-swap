import { ChallengeSetSubmissions } from "../game-management";
import { Match } from "../match-making";
export declare const SCORING_CHANNEL_PREFIX = "scoring";
export declare const SCORING_CHANNEL: {
    CHALLENGE_RESULT: string;
    MATCH_READY_TO_SCORE: string;
    MATCH_RESULT: string;
};
export type ScoringChannel = (typeof SCORING_CHANNEL)[keyof typeof SCORING_CHANNEL];
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
