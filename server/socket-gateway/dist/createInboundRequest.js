"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInboundRequest = exports.printReceivedSuccess = void 0;
const socket_1 = require("./socket");
const redis_1 = require("./redis");
const registrationDatabase_1 = require("./registrationDatabase");
const constants_1 = require("./constants");
const json_colorizer_1 = require("json-colorizer");
const { pub } = redis_1.RedisClient.getInstance();
const printReceivedSuccess = ({ channel, playerId, payload }) => {
    const p = constants_1.LOG_COLORS.playerId(playerId);
    const c = constants_1.LOG_COLORS.channel(channel);
    let str = `Inbound request from ${p} to ${c}`;
    if (payload) {
        const blob = (0, json_colorizer_1.colorize)(JSON.stringify(payload, null, 2));
        str += `\n${blob}`;
    }
    (0, socket_1.socketLogger)(str);
};
exports.printReceivedSuccess = printReceivedSuccess;
const printRegistrationNotFoundError = ({ channel, socketId }) => {
    const s = constants_1.LOG_COLORS.socketId(socketId);
    const c = constants_1.LOG_COLORS.channel(channel);
    const e = constants_1.LOG_COLORS.error('Error!');
    (0, socket_1.socketLogger)(`${e} On inbound request to ${c}: Registration Not Found For Socket ID ${s}`);
};
const createInboundRequest = (channel) => (socket) => socket.on(channel, async (req) => {
    const playerId = await (0, registrationDatabase_1.getPlayerIdFromSocketId)(socket.id);
    if (!playerId)
        return printRegistrationNotFoundError({ channel, socketId: socket.id });
    (0, exports.printReceivedSuccess)({
        channel,
        playerId,
        payload: req
    });
    pub.publish(channel, JSON.stringify(req));
});
exports.createInboundRequest = createInboundRequest;
