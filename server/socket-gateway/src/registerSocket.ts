import {
  addPlayerIdSocketIdMapping,
  removePlayerIdSocketIdMapping
} from "./registrationDatabase";
import { socketLogger } from "./socket";
import type { PlayerSocketInstance } from "shared-types/dist/socket-gateway";
import type { Player } from "shared-types/dist/match-making";
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

export const register = async (idPairing: {
  socketId: PlayerSocketInstance['id'],
  playerId: Player['id']
}) => {
  if (!idPairing.playerId) throw new Error('no player id provided')
  try {
    await addPlayerIdSocketIdMapping(idPairing)
    printRegistrationSuccess(idPairing);
  } catch (e) {
    throw e
  }
}

export const unregisterListener = (socket: PlayerSocketInstance) => socket.on(
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