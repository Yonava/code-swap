"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_types_1 = require("shared-types");
const printInboundRequest_1 = require("../printInboundRequest");
const redis_1 = require("../redis");
const { pub } = redis_1.RedisClient.getInstance();
const { UPDATE_CODE_SUBMISSION } = shared_types_1.GAME_MANAGEMENT_CHANNEL;
const updateCodeSubmission = (socket) => {
    socket.on(UPDATE_CODE_SUBMISSION, async (data) => {
        (0, printInboundRequest_1.printReceivedSuccess)({ channel: UPDATE_CODE_SUBMISSION, playerId: data.playerId, payload: data });
        pub.publish(UPDATE_CODE_SUBMISSION, JSON.stringify(data));
    });
};
exports.default = [updateCodeSubmission];
