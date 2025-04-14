"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlayerIdSocketIdMapping = exports.getPlayerIdFromSocketId = exports.getSocketIdFromPlayerId = exports.addPlayerIdSocketIdMapping = void 0;
/**
 * mocks a redis cache for handling these values at scale
 */
const playerIdToSocketIdMap = new Map();
const socketIdToPlayerIdMap = new Map();
const addPlayerIdSocketIdMapping = async ({ playerId, socketId }) => {
    playerIdToSocketIdMap.set(playerId, socketId);
    socketIdToPlayerIdMap.set(socketId, playerId);
};
exports.addPlayerIdSocketIdMapping = addPlayerIdSocketIdMapping;
const getSocketIdFromPlayerId = async (playerId) => {
    const socketId = playerIdToSocketIdMap.get(playerId);
    if (!socketId) {
        console.error(`Socket ID not found for player ID: ${playerId}`);
        return null;
    }
    return socketId;
};
exports.getSocketIdFromPlayerId = getSocketIdFromPlayerId;
const getPlayerIdFromSocketId = async (socketId) => {
    const playerId = socketIdToPlayerIdMap.get(socketId);
    if (!playerId) {
        console.error(`Player ID not found for socket ID: ${socketId}`);
        return null;
    }
    return playerId;
};
exports.getPlayerIdFromSocketId = getPlayerIdFromSocketId;
const removePlayerIdSocketIdMapping = async ({ playerId, socketId }) => {
    playerIdToSocketIdMap.delete(playerId);
    socketIdToPlayerIdMap.delete(socketId);
};
exports.removePlayerIdSocketIdMapping = removePlayerIdSocketIdMapping;
