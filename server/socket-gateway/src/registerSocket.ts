import { addPlayerIdSocketIdMapping } from "./registrationDatabase";
import {
  type PlayerSocketInstance,
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME
} from "shared-types/dist/socket-gateway";

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