import type { Server, Socket } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";
import type { CreateMatchRequest, CreateMatchResponse, JoinMatchRequest, JoinMatchResponse, Match, Player } from '../match-making';
import { MATCH_MAKING_CHANNEL } from "../match-making";
import { EndChallenge, GAME_MANAGEMENT_CHANNEL, MatchEnding, StartChallenge, UpdateCodeSubmission } from "../game-management";
export type SocketGatewayRegistrationRequest = {
    playerId: Player['id'];
};
export type PlayerJoinLeave = {
    /**
     * match with updated `teams` and `hostId` after the player left/joined
     */
    match: Match;
};
export type ClientSocketEvents = {
    [MATCH_MAKING_CHANNEL.REQUEST_CREATE_MATCH]: (req: CreateMatchRequest) => void;
    [MATCH_MAKING_CHANNEL.REQUEST_JOIN_MATCH]: (req: JoinMatchRequest) => void;
    [MATCH_MAKING_CHANNEL.LEAVE_MATCH]: () => void;
    [MATCH_MAKING_CHANNEL.MATCH_READY]: () => void;
    [GAME_MANAGEMENT_CHANNEL.UPDATE_CODE_SUBMISSION]: (data: UpdateCodeSubmission) => void;
};
export type ServerSocketEvents = {
    [MATCH_MAKING_CHANNEL.RESPONSE_CREATE_MATCH]: (res: CreateMatchResponse) => void;
    [MATCH_MAKING_CHANNEL.RESPONSE_JOIN_MATCH]: (res: JoinMatchResponse) => void;
    [MATCH_MAKING_CHANNEL.PLAYER_JOINED]: (data: PlayerJoinLeave) => void;
    [MATCH_MAKING_CHANNEL.PLAYER_LEFT]: (data: PlayerJoinLeave) => void;
    [GAME_MANAGEMENT_CHANNEL.START_CHALLENGE]: (data: StartChallenge) => void;
    [GAME_MANAGEMENT_CHANNEL.END_CHALLENGE]: (data: EndChallenge) => void;
    [GAME_MANAGEMENT_CHANNEL.MATCH_ENDING]: (data: MatchEnding) => void;
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
