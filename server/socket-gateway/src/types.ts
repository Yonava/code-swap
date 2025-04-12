import type { Server, Socket } from "socket.io";
import { JoinMatchRequest, JoinMatchResponse, LeaveMatch } from 'shared-types'
import { MATCH_MAKING_CHANNEL } from "./match-making/channels";
import {
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME,
  type SocketGatewayRegistrationRequest
} from "./registerSocket";

type ClientSocketEvents = {
  [SOCKET_GATEWAY_REGISTRATION_EVENT_NAME]: (
    req: SocketGatewayRegistrationRequest,
    ack: () => void
  ) => void,
  [MATCH_MAKING_CHANNEL.PUBLISH.REQUEST_CREATE_MATCH]: (req: JoinMatchRequest) => void,
  [MATCH_MAKING_CHANNEL.PUBLISH.REQUEST_JOIN_MATCH]: (req: JoinMatchRequest) => void,
  [MATCH_MAKING_CHANNEL.PUBLISH.LEAVE_MATCH]: (req: LeaveMatch) => void,
}

type ServerSocketEvents = {
  [MATCH_MAKING_CHANNEL.SUBSCRIBE.RESPONSE_CREATE_MATCH]: (res: JoinMatchResponse) => void,
  [MATCH_MAKING_CHANNEL.SUBSCRIBE.RESPONSE_JOIN_MATCH]: (res: JoinMatchResponse) => void,
}

export type SocketServerInstance = Server<ClientSocketEvents, ServerSocketEvents, {}, {}>
export type PlayerSocketInstance = Socket<ClientSocketEvents, ServerSocketEvents, {}, {}>