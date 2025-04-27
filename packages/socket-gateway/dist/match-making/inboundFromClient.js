"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_making_1 = require("shared-types/dist/match-making");
const printInboundRequest_1 = require("../printInboundRequest");
const redis_1 = require("../redis");
const registerSocket_1 = require("../registerSocket");
const constants_1 = require("../constants");
const socket_1 = require("../socket");
const registrationDatabase_1 = require("../registrationDatabase");
const { pub } = redis_1.RedisClient.getInstance();
const { REQUEST_CREATE_MATCH, RESPONSE_CREATE_MATCH, REQUEST_JOIN_MATCH, RESPONSE_JOIN_MATCH, LEAVE_MATCH, MATCH_READY, } = match_making_1.MATCH_MAKING_CHANNEL;
const printRegistrationError = ({ socketId, channel, issue, }) => {
    const s = constants_1.LOG_COLORS.socketId(socketId);
    const c = constants_1.LOG_COLORS.channel(channel);
    const e = constants_1.LOG_COLORS.error('Registration Error!');
    (0, socket_1.socketLogger)(`${e} On inbound request to ${c} for socket ${s}: ${issue}`);
};
const requestCreateMatch = (socket) => {
    socket.on(REQUEST_CREATE_MATCH, async (req) => {
        const playerId = req.player.id;
        try {
            await (0, registerSocket_1.registerSocket)({ socketId: socket.id, playerId });
        }
        catch (e) {
            if (e instanceof Error) {
                printRegistrationError({
                    socketId: socket.id,
                    channel: REQUEST_CREATE_MATCH,
                    issue: e.message
                });
                return socket.emit(RESPONSE_CREATE_MATCH, { playerId, error: e.message });
            }
            throw new Error(`Unhandled Registration Failure -> ${String(e)}`);
        }
        (0, printInboundRequest_1.printReceivedSuccess)({ channel: REQUEST_CREATE_MATCH, playerId, payload: req });
        pub.publish(REQUEST_CREATE_MATCH, JSON.stringify(req));
    });
};
const requestJoinMatch = (socket) => {
    socket.on(REQUEST_JOIN_MATCH, async (req) => {
        const playerId = req.player.id;
        try {
            await (0, registerSocket_1.registerSocket)({ socketId: socket.id, playerId });
        }
        catch (e) {
            if (e instanceof Error) {
                printRegistrationError({
                    socketId: socket.id,
                    channel: REQUEST_JOIN_MATCH,
                    issue: e.message
                });
                return socket.emit(RESPONSE_JOIN_MATCH, { playerId, error: e.message });
            }
            throw new Error(`Unhandled Registration Failure -> ${String(e)}`);
        }
        (0, printInboundRequest_1.printReceivedSuccess)({ channel: REQUEST_JOIN_MATCH, playerId, payload: req });
        pub.publish(REQUEST_JOIN_MATCH, JSON.stringify(req));
    });
};
const leaveMatch = (socket) => {
    socket.on(LEAVE_MATCH, async () => {
        const { id: socketId } = socket;
        const playerId = await (0, registrationDatabase_1.getPlayerIdFromSocketId)(socketId);
        if (!playerId)
            return (0, printInboundRequest_1.printRegistrationNotFoundError)({ channel: LEAVE_MATCH, socketId });
        (0, printInboundRequest_1.printReceivedSuccess)({ channel: LEAVE_MATCH, playerId });
        pub.publish(LEAVE_MATCH, JSON.stringify({ playerId }));
    });
};
const matchReady = (socket) => {
    socket.on(MATCH_READY, async () => {
        const { id: socketId } = socket;
        const playerId = await (0, registrationDatabase_1.getPlayerIdFromSocketId)(socketId);
        if (!playerId)
            return (0, printInboundRequest_1.printRegistrationNotFoundError)({ channel: MATCH_READY, socketId });
        (0, printInboundRequest_1.printReceivedSuccess)({ channel: MATCH_READY, playerId });
        pub.publish(MATCH_READY, JSON.stringify({ playerId }));
    });
};
exports.default = [requestCreateMatch, requestJoinMatch, leaveMatch, matchReady];
