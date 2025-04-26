"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_types_1 = require("shared-types");
const registrationDatabase_1 = require("../registrationDatabase");
const printInboundRequest_1 = require("../printInboundRequest");
const redis_1 = require("../redis");
const { pub } = redis_1.RedisClient.getInstance();
const { UPDATE_CODE_SUBMISSION } = shared_types_1.GAME_MANAGEMENT_CHANNEL;
const updateCodeSubmission = (socket) => {
    socket.on(UPDATE_CODE_SUBMISSION, async (data) => {
        const { id: socketId } = socket;
        const playerId = await (0, registrationDatabase_1.getPlayerIdFromSocketId)(socketId);
        if (!playerId)
            return (0, printInboundRequest_1.printRegistrationNotFoundError)({ channel: UPDATE_CODE_SUBMISSION, socketId });
        (0, printInboundRequest_1.printReceivedSuccess)({ channel: UPDATE_CODE_SUBMISSION, playerId, payload: data });
        pub.publish(UPDATE_CODE_SUBMISSION, JSON.stringify({ playerId, ...data }));
    });
};
exports.default = [updateCodeSubmission];
