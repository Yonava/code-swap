export const MATCH_MAKING_CHANNEL_PREFIX = 'matchMaking';

export const MATCH_MAKING_CHANNEL = {
  REQUEST_JOIN_MATCH: `${MATCH_MAKING_CHANNEL_PREFIX}.requestJoinMatch`,
  REQUEST_CREATE_MATCH: `${MATCH_MAKING_CHANNEL_PREFIX}.requestCreateMatch`,
  LEAVE_MATCH: `${MATCH_MAKING_CHANNEL_PREFIX}.leaveMatch`,
  RESPONSE_JOIN_MATCH: `${MATCH_MAKING_CHANNEL_PREFIX}.responseJoinMatch`,
  RESPONSE_CREATE_MATCH: `${MATCH_MAKING_CHANNEL_PREFIX}.responseCreateMatch`,
  PLAYER_JOINED: `${MATCH_MAKING_CHANNEL_PREFIX}.playerJoined`,
  PLAYER_LEFT: `${MATCH_MAKING_CHANNEL_PREFIX}.playerLeft`,
  MATCH_READY: `${MATCH_MAKING_CHANNEL_PREFIX}.matchReady`,
} as const;

export type MatchMakingChannel = typeof MATCH_MAKING_CHANNEL[keyof typeof MATCH_MAKING_CHANNEL]

export type Player = {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export type Match = {
  id: string;
  hostId: Player['id'];
  teams: [[Player | undefined, Player | undefined], [Player | undefined, Player | undefined]];
}

export type FullMatch = {
  id: string;
  hostId: Player['id'];
  teams: [[Player, Player], [Player, Player]];
}

export type TeamIndex = 0 | 1;

export type JoinMatchRequest = {
  player: Player;
  matchId: Match['id'];
  teamIndex: TeamIndex;
}

export type JoinMatchResponseAccepted = {
  match: Match;
}

export type JoinMatchResponseRejected = {
  error: string;
}

export type CreateMatchRequest = {
  player: Player;
}

export type CreateMatchResponseAccepted = {
  match: Match;
}

export type CreateMatchResponseRejected = {
  error: string;
}

export type JoinMatchResponse = { playerId: Player['id'] } & (
  JoinMatchResponseAccepted | JoinMatchResponseRejected
)

export type CreateMatchResponse = { playerId: Player['id'] } & (
  CreateMatchResponseAccepted | CreateMatchResponseRejected
)

export type LeaveMatch = {
  playerId: Player['id'];
}

export type MatchReady = {
  playerId: Player['id']
}