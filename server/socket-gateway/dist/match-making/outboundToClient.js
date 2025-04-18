"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../socket");
const match_making_1 = require("shared-types/dist/match-making");
const registrationDatabase_1 = require("../registrationDatabase");
const listenToChannel_1 = require("../listenToChannel");
const listenToChannel_2 = require("../listenToChannel");
const constants_1 = require("../constants");
const json_colorizer_1 = require("json-colorizer");
const { RESPONSE_JOIN_MATCH, RESPONSE_CREATE_MATCH, PLAYER_JOINED, PLAYER_LEFT, } = match_making_1.MATCH_MAKING_CHANNEL;
const logSocketLookupError = ({ playerId, payload }) => {
    const e = constants_1.LOG_COLORS.error('Error!');
    const c = constants_1.LOG_COLORS.channel(RESPONSE_JOIN_MATCH);
    const blob = (0, json_colorizer_1.colorize)(payload);
    (0, listenToChannel_2.pubSubLogger)(`${e} Response from ${c} to ${playerId} dropped due to missing socket/socketId. Check registration db and  payload\n${blob}`);
};
(0, listenToChannel_1.listenToChannel)({
    from: RESPONSE_JOIN_MATCH,
    fn: async (data) => {
        const logErr = () => logSocketLookupError({
            playerId: data.playerId,
            payload: JSON.stringify(data)
        });
        const socketId = await (0, registrationDatabase_1.getSocketIdFromPlayerId)(data.playerId);
        if (!socketId)
            return logErr();
        const socket = socket_1.io.sockets.sockets.get(socketId);
        if (!socket)
            return logErr();
        if ('error' in data)
            return socket.emit(RESPONSE_JOIN_MATCH, data);
        const { match } = data;
        socket.join(match.id);
        socket_1.io.to(match.id).emit(PLAYER_JOINED, { match });
    }
});
(0, listenToChannel_1.listenToChannel)({
    from: RESPONSE_CREATE_MATCH,
    fn: async (data) => {
        const logErr = () => logSocketLookupError({
            playerId: data.playerId,
            payload: JSON.stringify(data)
        });
        const socketId = await (0, registrationDatabase_1.getSocketIdFromPlayerId)(data.playerId);
        if (!socketId)
            return logErr();
        const socket = socket_1.io.sockets.sockets.get(socketId);
        if (!socket)
            return logErr();
        if ('error' in data)
            return socket.emit(RESPONSE_CREATE_MATCH, data);
        const { match } = data;
        socket.join(match.id);
        socket_1.io.to(match.id).emit(PLAYER_JOINED, { match });
        console.log(socket.rooms);
    }
});
(0, listenToChannel_1.listenToChannel)({
    from: PLAYER_LEFT,
    fn: ({ match }) => socket_1.io.to(match.id).emit(PLAYER_LEFT, { match })
});
