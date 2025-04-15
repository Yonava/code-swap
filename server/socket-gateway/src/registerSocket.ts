import {
  addPlayerIdSocketIdMapping,
  getAllMappings,
  removePlayerIdSocketIdMapping
} from "./registrationDatabase";
import { socketLogger } from "./socket";
import {
  type PlayerSocketInstance,
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME
} from "shared-types/dist/socket-gateway";
import { LOG_COLORS } from "./constants";

const printRegistrationSuccess = ({
  playerId,
  socketId
}: {
  playerId: string,
  socketId: string
}) => {
  const p = LOG_COLORS.playerId(playerId);
  const s = LOG_COLORS.socketId(socketId);
  socketLogger(`Registered ${p} to ${s}`);
}

const printUnregistrationSuccess = ({
  playerId,
  socketId
}: {
  playerId: string,
  socketId: string
}) => {
  const p = LOG_COLORS.playerId(playerId);
  const s = LOG_COLORS.socketId(socketId);
  socketLogger(`Unregistered ${p} from ${s}`);
}

const printUnregistrationNoPlayerId = ({
  socketId
}: {
  socketId: string
}) => {
  const s = LOG_COLORS.socketId(socketId);
  socketLogger(`Unregistered Socket Disconnected with ID ${s}`);
}

const printRegistrationError = ({
  socketId
}: {
  socketId: string
}) => {
  const s = LOG_COLORS.socketId(socketId);
  const c = LOG_COLORS.channel(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME);
  const e = LOG_COLORS.error('Error!');
  socketLogger(`${e} On inbound request to ${c}: No Player ID Provided - Registration For Socket ID ${s} Failed :(`);
}

const register = (socket: PlayerSocketInstance) => socket.on(
  SOCKET_GATEWAY_REGISTRATION_EVENT_NAME,
  async ({ playerId }, ack) => {
    if (!playerId) return printRegistrationError({ socketId: socket.id })

    await addPlayerIdSocketIdMapping({
      playerId,
      socketId: socket.id
    })
    // maybe add some match lookup logic and create socket rooms matching
    // match id

    // const mappings = await getAllMappings();
    // socketLogger(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    printRegistrationSuccess({
      playerId,
      socketId: socket.id
    });

    ack()
  }
)

const unregister = (socket: PlayerSocketInstance) => socket.on(
  'disconnect',
  async () => {
    const playerId = await removePlayerIdSocketIdMapping({
      socketId: socket.id
    })

    if (!playerId) return printUnregistrationNoPlayerId({ socketId: socket.id })

    // const mappings = await getAllMappings();
    // socketLogger(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    printUnregistrationSuccess({
      playerId,
      socketId: socket.id
    });
  }
)

export default [register, unregister]