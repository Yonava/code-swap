"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("../redis");
const channels_1 = require("./channels");
const matches_1 = require("../matches");
const redisClient = redis_1.RedisClient.getInstance();
const { pub: redisPub, sub: redisSub } = redisClient;
const { PUBLISH, SUBSCRIBE } = channels_1.MATCH_MAKING_CHANNEL;
redisSub.subscribe(SUBSCRIBE.REQUEST_CREATE_MATCH, async (message) => {
    const data = JSON.parse(message); // add zod validation
    const result = await (0, matches_1.createNewMatch)(data.player);
    const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
    redisPub.publish(PUBLISH.RESPONSE_CREATE_MATCH, JSON.stringify(publishedResponse));
});
redisSub.subscribe(SUBSCRIBE.REQUEST_JOIN_MATCH, async (message) => {
    const data = JSON.parse(message); // add zod validation
    const result = await (0, matches_1.addPlayerToMatch)(data);
    const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
    redisPub.publish(PUBLISH.RESPONSE_JOIN_MATCH, JSON.stringify(publishedResponse));
});
redisSub.subscribe(SUBSCRIBE.LEAVE_MATCH, (message) => {
    console.log(`Message received: ${message}`);
});
