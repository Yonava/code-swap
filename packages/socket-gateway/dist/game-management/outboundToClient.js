"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_types_1 = require("shared-types");
const listenToChannel_1 = require("../listenToChannel");
const socket_1 = require("../socket");
const { START_CHALLENGE, END_CHALLENGE, MATCH_ENDING, MATCH_ENDED } = shared_types_1.GAME_MANAGEMENT_CHANNEL;
(0, listenToChannel_1.listenToChannel)({
    from: START_CHALLENGE,
    fn: (data) => socket_1.io.to(data.matchId).emit(START_CHALLENGE, data)
});
(0, listenToChannel_1.listenToChannel)({
    from: END_CHALLENGE,
    fn: (data) => socket_1.io.to(data.matchId).emit(END_CHALLENGE, data)
});
(0, listenToChannel_1.listenToChannel)({
    from: MATCH_ENDING,
    fn: (data) => socket_1.io.to(data.matchId).emit(MATCH_ENDING, data)
});
(0, listenToChannel_1.listenToChannel)({
    from: MATCH_ENDED,
    fn: (data) => socket_1.io.to(data.matchId).emit(MATCH_ENDED)
});
