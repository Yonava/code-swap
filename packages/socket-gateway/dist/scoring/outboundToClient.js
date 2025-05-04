"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_types_1 = require("shared-types");
const listenToChannel_1 = require("../listenToChannel");
const socket_1 = require("../socket");
const { MATCH_RESULT } = shared_types_1.SCORING_CHANNEL;
(0, listenToChannel_1.listenToChannel)({
    from: MATCH_RESULT,
    fn: (data) => socket_1.io.to(data.matchId).emit(MATCH_RESULT, data)
});
