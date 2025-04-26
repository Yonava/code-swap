"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listenToChannel_1 = require("../listenToChannel");
const shared_types_1 = require("shared-types");
const redis_1 = require("../redis");
const createChallengeRounds_1 = require("../createChallengeRounds");
const { pub } = redis_1.RedisClient.getInstance();
const { START_MATCH, START_CHALLENGE, END_CHALLENGE, UPDATE_CODE_SUBMISSION } = shared_types_1.GAME_MANAGEMENT_CHANNEL;
(0, listenToChannel_1.listenToChannel)({
    from: START_MATCH,
    fn: async ({ match }) => {
        const challenges = await (0, createChallengeRounds_1.fetchChallenges)(createChallengeRounds_1.NUMBER_OF_ROUNDS * 2);
        const challengesByRound = (0, createChallengeRounds_1.packChallengesByRound)(challenges);
        const [starts, ends] = (0, createChallengeRounds_1.createChallengeRounds)(match, challengesByRound);
        (0, listenToChannel_1.logResponse)({ channel: START_MATCH, payload: JSON.stringify(starts) });
        for (let i = 0; i < starts.length; i++) {
            setTimeout(() => {
                pub.publish(START_CHALLENGE, JSON.stringify(starts[i]));
            }, i * createChallengeRounds_1.TIME_FROM_START_TO_START);
        }
        for (let i = 0; i < ends.length; i++) {
            setTimeout(() => {
                pub.publish(END_CHALLENGE, JSON.stringify(ends[i]));
            }, (i * createChallengeRounds_1.TIME_FROM_START_TO_START) + createChallengeRounds_1.TIME_FROM_START_TO_START);
        }
    }
});
(0, listenToChannel_1.listenToChannel)({
    from: UPDATE_CODE_SUBMISSION,
    fn: async ({ playerId, challengeId, code }) => {
        console.log('updating', playerId, challengeId, code);
    }
});
