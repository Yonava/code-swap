import { Challenge } from "../challenges";
import { FullMatch, Match, Player, TeamIndex } from "../match-making";

export const GAME_MANAGEMENT_CHANNEL_PREFIX = "gameManagement";

export const GAME_MANAGEMENT_CHANNEL = {
  START_MATCH: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.startMatch`,
  START_CHALLENGE: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.startChallenge`,
  END_CHALLENGE: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.endChallenge`,
  MATCH_ENDING: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.matchEnding`,
  MATCH_ENDED: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.matchEnded`,
  UPDATE_CODE_SUBMISSION: `${GAME_MANAGEMENT_CHANNEL_PREFIX}.updateCodeSubmission`,
} as const;

export type GameManagementChannel =
  (typeof GAME_MANAGEMENT_CHANNEL)[keyof typeof GAME_MANAGEMENT_CHANNEL];

export type StartMatch = {
  match: FullMatch;
};

export type MatchIdForRouting = {
  /**
   * match id the challenge is being sent to, for routing purposes
   */
  matchId: Match["id"];
};

export type ChallengeData = {
  challengeId: Challenge["id"];
  /**
   * this code will replace the content in the players editor
   */
  code: string;
  /**
   * whether this code submission is marked as final by the team.
   * Final code cannot be edited any longer
   */
  isFinished: boolean;
};

export type StartChallenge = {
  /**
   * unix timestamp of when the player submission period is scheduled to end.
   * A player submission period is the window that a user can write code for a challenge
   * and game management will consider it within the valid time box
   */
  endsAt: number;
  /**
   * maps a player id to the challenge question they are receiving
   */
  challenges: Record<Player["id"], ChallengeData>;
} & MatchIdForRouting;

export type EndChallenge = {
  /**
   * unix timestamp of when the next round will start
   */
  startsAt: number;
} & MatchIdForRouting;

export type MatchEnding = {
  /**
   * unix timestamp of when the match is over. Leaves a bit of wiggle room for final submissions before its
   * to late!
   */
  at: number
} & MatchIdForRouting

/**
 * the object the players client stores
 */
export type ClientChallenge = Pick<StartChallenge, "endsAt"> &
  ChallengeData;

export type UpdateCodeSubmission = {
  playerId: Player["id"];
} & ChallengeData &
  MatchIdForRouting;

export type ChallengeSetSubmissions = Record<Challenge["id"], ChallengeData>;

export type CodeSubmissionsDB = Map<
  Match["id"],
  [ChallengeSetSubmissions, ChallengeSetSubmissions]
>;

export type PlayerToTeamDB = Map<Player["id"], TeamIndex>;
