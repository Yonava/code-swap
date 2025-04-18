"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_making_1 = require("shared-types/dist/match-making");
const createInboundRequest_1 = require("../createInboundRequest");
const redis_1 = require("../redis");
const registerSocket_1 = require("../registerSocket");
const constants_1 = require("../constants");
const socket_1 = require("../socket");
const { pub } = redis_1.RedisClient.getInstance();
const { REQUEST_CREATE_MATCH, RESPONSE_CREATE_MATCH, REQUEST_JOIN_MATCH, RESPONSE_JOIN_MATCH, LEAVE_MATCH, } = match_making_1.MATCH_MAKING_CHANNEL;
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
            await (0, registerSocket_1.register)({ socketId: socket.id, playerId });
        }
        catch (e) {
            if (e instanceof Error) {
                printRegistrationError({
                    socketId: socket.id,
                    channel: REQUEST_CREATE_MATCH,
                    issue: e.message
                });
                socket.emit(RESPONSE_CREATE_MATCH, { playerId, error: e.message });
            }
            throw new Error(`Unhandled Registration Failure -> ${String(e)}`);
        }
        (0, createInboundRequest_1.printReceivedSuccess)({ channel: REQUEST_CREATE_MATCH, playerId, payload: req });
        pub.publish(REQUEST_CREATE_MATCH, JSON.stringify(req));
    });
};
const requestJoinMatch = (socket) => {
    socket.on(REQUEST_JOIN_MATCH, async (req) => {
        const playerId = req.player.id;
        try {
            await (0, registerSocket_1.register)({ socketId: socket.id, playerId });
        }
        catch (e) {
            if (e instanceof Error) {
                printRegistrationError({
                    socketId: socket.id,
                    channel: REQUEST_JOIN_MATCH,
                    issue: e.message
                });
                socket.emit(RESPONSE_JOIN_MATCH, { playerId, error: e.message });
            }
            throw new Error(`Unhandled Registration Failure -> ${String(e)}`);
        }
        (0, createInboundRequest_1.printReceivedSuccess)({ channel: REQUEST_JOIN_MATCH, playerId, payload: req });
        pub.publish(REQUEST_JOIN_MATCH, JSON.stringify(req));
    });
};
const leaveMatch = (0, createInboundRequest_1.createInboundRequest)(LEAVE_MATCH);
exports.default = [requestCreateMatch, requestJoinMatch, leaveMatch];
