import type { Server, Socket } from "socket.io";
import type { JoinMatchRequest, JoinMatchResponse, LeaveMatch, Player } from '../match-making'
import { MATCH_MAKING_CHANNEL } from "../match-making";

export const SOCKET_GATEWAY_PREFIX = 'socketGateway'
export const SOCKET_GATEWAY_REGISTRATION_EVENT_NAME = `${SOCKET_GATEWAY_PREFIX}.register`;

export type SocketGatewayRegistrationRequest = {
  playerId: Player['id'];
}

type ClientSocketEvents = {
  [SOCKET_GATEWAY_REGISTRATION_EVENT_NAME]: (
    req: SocketGatewayRegistrationRequest,
    ack: () => void
  ) => void,
  [MATCH_MAKING_CHANNEL.REQUEST_CREATE_MATCH]: (req: JoinMatchRequest) => void,
  [MATCH_MAKING_CHANNEL.REQUEST_JOIN_MATCH]: (req: JoinMatchRequest) => void,
  [MATCH_MAKING_CHANNEL.LEAVE_MATCH]: (req: LeaveMatch) => void,
}

type ServerSocketEvents = {
  [MATCH_MAKING_CHANNEL.RESPONSE_CREATE_MATCH]: (res: JoinMatchResponse) => void,
  [MATCH_MAKING_CHANNEL.RESPONSE_JOIN_MATCH]: (res: JoinMatchResponse) => void,
}

export type SocketServerInstance = Server<ClientSocketEvents, ServerSocketEvents, {}, {}>
export type PlayerSocketInstance = Socket<ClientSocketEvents, ServerSocketEvents, {}, {}>