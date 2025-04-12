import { Player } from "shared-types";
import { PlayerSocketInstance } from "./types";
import { addPlayerIdSocketIdMapping } from "./registrationDatabase";

export const SOCKET_GATEWAY_PREFIX = 'socketGateway'
export const SOCKET_GATEWAY_REGISTRATION_EVENT_NAME = `${SOCKET_GATEWAY_PREFIX}.register`;

export type SocketGatewayRegistrationRequest = {
  playerId: Player['id'];
}

const register = (socket: PlayerSocketInstance) => socket.on(
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME,
  async ({ playerId }, ack) => {
    await addPlayerIdSocketIdMapping({
      playerId,
      socketId: socket.id
    })
    // maybe add some match lookup logic and create socket rooms matching
    // match id

    ack()
  }
)

export default [register]