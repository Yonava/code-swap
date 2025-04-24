"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_types_1 = require("shared-types");
const listenToChannel_1 = require("../listenToChannel");
const socket_1 = require("../socket");
const { START_CHALLENGE } = shared_types_1.GAME_MANAGEMENT_CHANNEL;
(0, listenToChannel_1.listenToChannel)({
    from: START_CHALLENGE,
    fn: (data) => socket_1.io.to(data.matchId).emit(START_CHALLENGE, data)
});
