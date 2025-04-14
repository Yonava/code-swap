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
  if (!playerId) {
    console.error(`Player ID not found for socket ID: ${socketId}`);
    return null;
  }
  return playerId;
}

export const removePlayerIdSocketIdMapping = async ({ playerId, socketId }: {
  playerId: Player['id'],
  socketId: PlayerSocketInstance['id']
}) => {
  playerIdToSocketIdMap.delete(playerId);
  socketIdToPlayerIdMap.delete(socketId);
}