import type { Server } from "socket.io";
import { Match } from 'shared-types'

const match: Match = {
  id: 'matchId',
  hostId: 'hostId',
  teams: [
    [undefined, undefined],
    [undefined, undefined],
  ],
}

type ClientSocketEvents = {
  requestJoin: (req: JoinRequest) => void,
}

type ServerSocketEvents = {
  responseJoin: (res: JoinResponse) => void,
}

export type SocketServer = Server<ClientSocketEvents, ServerSocketEvents, {}, {}>