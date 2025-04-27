"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../redis");
const socket_1 = require("../socket");
const match_making_1 = require("shared-types/dist/match-making");
const registrationDatabase_1 = require("../registrationDatabase");
const { sub } = redis_1.RedisClient.getInstance();
const { RESPONSE_JOIN_MATCH, RESPONSE_CREATE_MATCH } = match_making_1.MATCH_MAKING_CHANNEL;
sub.subscribe(RESPONSE_CREATE_MATCH, async (message) => {
    const data = JSON.parse(message);
    const socketId = await (0, registrationDatabase_1.getSocketIdFromPlayerId)(data.playerId);
    if (!socketId)
        throw new Error(`Socket Registration Database Error: Socket ID not found for player ID ${data.playerId}`);
    socket_1.io.to(socketId).emit(RESPONSE_CREATE_MATCH, data);
});
sub.subscribe(RESPONSE_JOIN_MATCH, async (message) => {
    const data = JSON.parse(message);
    const socketId = await (0, registrationDatabase_1.getSocketIdFromPlayerId)(data.playerId);
    if (!socketId)
        throw new Error(`Socket Registration Database Error: Socket ID not found for player ID ${data.playerId}`);
    socket_1.io.to(socketId).emit(RESPONSE_JOIN_MATCH, data);
});
