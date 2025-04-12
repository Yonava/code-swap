import type { Server } from "socket.io";

type ClientSocketEvents = {
  requestJoin: (req: JoinRequest) => void,
}

type ServerSocketEvents = {
  responseJoin: (res: JoinResponse) => void,
}

export type SocketServer = Server<ClientSocketEvents, ServerSocketEvents, {}, {}>