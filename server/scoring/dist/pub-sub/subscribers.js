"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listenToChannel_1 = require("../listenToChannel");
const shared_types_1 = require("shared-types");
(0, listenToChannel_1.listenToChannel)({
    from: shared_types_1.SCORING_CHANNEL.MATCH_READY_TO_SCORE,
    fn: async (data) => {
        console.log("scoring", data.challengeSet);
    },
});
