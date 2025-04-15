import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import type { JoinMatchRequest, JoinMatchResponse, LeaveMatch, Player } from '../match-making';
import { MATCH_MAKING_CHANNEL } from "../match-making";
export declare const SOCKET_GATEWAY_PREFIX = "socketGateway";
export declare const SOCKET_GATEWAY_REGISTRATION_EVENT_NAME = "socketGateway.register";
export type SocketGatewayRegistrationRequest = {
    playerId: Player['id'];
};
export type ClientSocketEvents = {
    [SOCKET_GATEWAY_REGISTRATION_EVENT_NAME]: (req: SocketGatewayRegistrationRequest, ack: () => void) => void;
    [MATCH_MAKING_CHANNEL.REQUEST_CREATE_MATCH]: (req: JoinMatchRequest) => void;
    [MATCH_MAKING_CHANNEL.REQUEST_JOIN_MATCH]: (req: JoinMatchRequest) => void;
    [MATCH_MAKING_CHANNEL.LEAVE_MATCH]: (req: LeaveMatch) => void;
};
export type ServerSocketEvents = {
    [MATCH_MAKING_CHANNEL.RESPONSE_CREATE_MATCH]: (res: JoinMatchResponse) => void;
    [MATCH_MAKING_CHANNEL.RESPONSE_JOIN_MATCH]: (res: JoinMatchResponse) => void;
};
/**
 * for server-side use only
 */
export type SocketServerInstance = Server<ClientSocketEvents, ServerSocketEvents, {}, {}>;
export type PlayerSocketInstance = Socket<ClientSocketEvents, ServerSocketEvents, {}, {}>;
/**
 * for client-side use only
 */
export type ClientSocketInstance = ClientSocket<ServerSocketEvents, ClientSocketEvents>;
