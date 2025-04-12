import { Player } from "shared-types";
import { PlayerSocketInstance } from "./types";

export const SOCKET_GATEWAY_PREFIX = 'socketGateway'
export const SOCKET_GATEWAY_REGISTRATION_EVENT_NAME = `${SOCKET_GATEWAY_PREFIX}.register`;

export type SocketGatewayRegistrationRequest = {
  playerId: Player['id'];
}

const playerIdToSocketIdMap = new Map<Player['id'], PlayerSocketInstance['id']>();
const socketIdToPlayerIdMap = new Map<PlayerSocketInstance['id'], Player['id']>();

const register = (socket: PlayerSocketInstance) => socket.on(
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME,
  (req, ack) => {
    const { playerId } = req
    playerIdToSocketIdMap.set(playerId, socket.id)
    socketIdToPlayerIdMap.set(socket.id, playerId)
    // maybe add some match lookup logic and create socket rooms matching
    // match id

    ack()
  }
)

export default [register]