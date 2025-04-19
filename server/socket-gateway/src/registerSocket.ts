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
  socketId,
  rooms,
}: {
  playerId: string,
  socketId: string,
  rooms: string[],
}) => {
  const p = LOG_COLORS.playerId(playerId);
  const s = LOG_COLORS.socketId(socketId);
  let str = `Unregistered ${p} from ${s} `
  if (rooms.length === 0) {
    str += 'and left no match rooms'
  } else if (rooms.length === 1) {
    const room = LOG_COLORS.matchId(rooms[0])
    str += `and left match room ${room}`
  } else {
    const commaSeparatedRooms = LOG_COLORS.matchId(rooms.join(', '))
    str += `and left ${rooms.length} match rooms: ${commaSeparatedRooms}`
  }
  socketLogger(str);
}

const printUnregistrationNoPlayerId = ({
  socketId
}: {
  socketId: string
}) => {
  const s = LOG_COLORS.socketId(socketId);
  socketLogger(`Unregistered Socket Disconnected with ID ${s}`);
}

export const registerSocket = async (idPairing: {
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
  'disconnecting',
  async () => {
    // slice removes default self socket.id room
    const rooms = Array.from(socket.rooms).slice(1)
    const playerId = await removePlayerIdSocketIdMapping({
      socketId: socket.id
    })

    if (!playerId) return printUnregistrationNoPlayerId({ socketId: socket.id })

    printUnregistrationSuccess({
      playerId,
      socketId: socket.id,
      rooms
    });
  }
)