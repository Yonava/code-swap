import { Challenge } from "../challenges";
import { Match, Player } from "../match-making";
export declare const GAME_MANAGEMENT_CHANNEL_PREFIX = "gameManagement";
export declare const GAME_MANAGEMENT_CHANNELS: {
    readonly START_MATCH: "gameManagement.startMatch";
    readonly START_CHALLENGE: "gameManagement.startChallenge";
    readonly END_CHALLENGE: "gameManagement.endChallenge";
    readonly UPDATE_CODE_SUBMISSION: "gameManagement.updateCodeSubmission";
};
export type StartMatch = {
    match: Match;
};
export type StartChallenge = {
    /**
     * the round of the challenge. Each challenge question is associated with one round
     */
    round: number;
    /**
     * unix timestamp of when the player submission period is scheduled to end.
     * A player submission period is the window that a user can write code for a challenge
     * and game management will consider it within the valid time box
     */
    endsAt: string;
    /**
     * maps a player id to the challenge question they are receiving
     */
    challenges: Record<Player['id'], {
        challengeId: Challenge['id'];
        /**
         * this code will replace the content in the players editor
         */
        code: string;
    }>;
};
export type EndChallenge = {
    /**
     * unix timestamp of when the next challenge will start.
     * `undefined` if that was the last challenge
     */
    startsAt: string | undefined;
};
