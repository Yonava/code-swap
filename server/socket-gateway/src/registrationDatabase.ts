import type { Player } from "shared-types/dist/match-making";
import type { PlayerSocketInstance } from "shared-types/dist/socket-gateway";

/**
 * mocks a redis cache for handling these values at scale
 */
const playerIdToSocketIdMap = new Map<Player['id'], PlayerSocketInstance['id']>();
const socketIdToPlayerIdMap = new Map<PlayerSocketInstance['id'], Player['id']>();

export const addPlayerIdSocketIdMapping = async ({ playerId, socketId }: {
  playerId: Player['id'],
  socketId: PlayerSocketInstance['id']
}) => {
  playerIdToSocketIdMap.set(playerId, socketId);
  socketIdToPlayerIdMap.set(socketId, playerId);
}

export const getSocketIdFromPlayerId = async (playerId: Player['id']) => {
  const socketId = playerIdToSocketIdMap.get(playerId);
  if (!socketId) {
    console.error(`Socket ID not found for player ID: ${playerId}`);
    return null;
  }
  return socketId;
}

export const getPlayerIdFromSocketId = async (socketId: PlayerSocketInstance['id']) => {
  const playerId = socketIdToPlayerIdMap.get(socketId);
  if (!playerId) return null;
  return playerId;
}

export const getAllMappings = async () => ({
  playerIdToSocketIdMap: Array.from(playerIdToSocketIdMap.entries()),
  socketIdToPlayerIdMap: Array.from(socketIdToPlayerIdMap.entries()),
})

export const removePlayerIdSocketIdMapping = async ({ socketId }: {
  socketId: PlayerSocketInstance['id']
}) => {
  const playerId = socketIdToPlayerIdMap.get(socketId);
  if (playerId) {
    playerIdToSocketIdMap.delete(playerId);
    socketIdToPlayerIdMap.delete(socketId);
  }
  return playerId;
}