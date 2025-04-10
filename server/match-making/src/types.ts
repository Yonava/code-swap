import type { Server } from "socket.io";

export type Player = {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export type Match = {
  id: string;
  teams: {
    team1: Player[];
    team2: Player[];
  },
  host: string;
}

// a request to join from a user results in either a response confirmation with the match data or a rejection
export type JoinRequest = {
  player: Player;
  matchId: string;
  team: 1 | 2;
}

export type JoinResponseAccepted = {
  match: Match;
}

export type JoinResponseRejected = {
  error: string;
}

export type JoinResponse = { playerId: Player['id'] } & (JoinResponseAccepted | JoinResponseRejected)

export type Leave = {}

type ClientSocketEvents = {
  requestJoin: (req: JoinRequest) => void,
}

type ServerSocketEvents = {
  responseJoin: (res: JoinResponse) => void,
}

export type SocketServer = Server<ClientSocketEvents, ServerSocketEvents, {}, {}>