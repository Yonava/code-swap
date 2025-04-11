import type { Server } from "socket.io";

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

export type JoinMatchResponse = { playerId: Player['id'] } & (JoinMatchResponseAccepted | JoinMatchResponseRejected)
export type CreateMatchResponse = { playerId: Player['id'] } & (CreateMatchResponseAccepted | CreateMatchResponseRejected)

export type LeaveMatch = {
  playerId: Player['id'];
  matchId: Match['id'];
}