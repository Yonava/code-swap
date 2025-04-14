"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const match_making_1 = require("shared-types/dist/match-making");
const redis_1 = require("../redis");
const matches_1 = require("../matches");
const { pub, sub } = redis_1.RedisClient.getInstance();
const { REQUEST_CREATE_MATCH, RESPONSE_CREATE_MATCH, REQUEST_JOIN_MATCH, RESPONSE_JOIN_MATCH, LEAVE_MATCH } = match_making_1.MATCH_MAKING_CHANNEL;
sub.subscribe(REQUEST_CREATE_MATCH, async (message) => {
    const data = JSON.parse(message); // add zod validation
    const result = await (0, matches_1.createNewMatch)(data.player);
    const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
    pub.publish(RESPONSE_CREATE_MATCH, JSON.stringify(publishedResponse));
});
sub.subscribe(REQUEST_JOIN_MATCH, async (message) => {
    const data = JSON.parse(message); // add zod validation
    const result = await (0, matches_1.addPlayerToMatch)(data);
    const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
    pub.publish(RESPONSE_JOIN_MATCH, JSON.stringify(publishedResponse));
});
sub.subscribe(LEAVE_MATCH, async (message) => {
    const data = JSON.parse(message); // add zod validation
    await (0, matches_1.removePlayerFromMatch)(data.matchId, data.playerId);
});
