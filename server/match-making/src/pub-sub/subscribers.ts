import { RedisClient } from "../redis";
import { MATCH_MAKING_CHANNEL } from "./channels";
import { CreateMatchRequest, JoinMatchRequest } from '../types';
import { addPlayerToMatch, createNewMatch } from "../matches";

const redisClient = RedisClient.getInstance();
const { pub: redisPub, sub: redisSub } = redisClient;

const { PUBLISH, SUBSCRIBE } = MATCH_MAKING_CHANNEL;

redisSub.subscribe(SUBSCRIBE.REQUEST_CREATE_MATCH, async (message) => {
  const data: CreateMatchRequest = JSON.parse(message); // add zod validation
  const result = await createNewMatch(data.player);
  const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
  redisPub.publish(PUBLISH.RESPONSE_CREATE_MATCH, JSON.stringify(publishedResponse));
});

redisSub.subscribe(SUBSCRIBE.REQUEST_JOIN_MATCH, async (message) => {
  const data: JoinMatchRequest = JSON.parse(message); // add zod validation
  const result = await addPlayerToMatch(data);
  const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
  redisPub.publish(PUBLISH.RESPONSE_JOIN_MATCH, JSON.stringify(publishedResponse));
});

redisSub.subscribe(SUBSCRIBE.LEAVE_MATCH, (message) => {
  console.log(`Message received: ${message}`);
});