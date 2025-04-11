import { RedisClient } from "../redis";
import { MATCH_MAKING_CHANNEL } from "./channels";
import { JoinMatchRequest, JoinMatchResponse, Match } from '../types';

const redisClient = RedisClient.getInstance();
const { pub: redisPub, sub: redisSub } = redisClient;

redisSub.subscribe(MATCH_MAKING_CHANNEL.SUBSCRIBE.REQUEST_JOIN_MATCH, async (message) => {
  const data: JoinMatchRequest = JSON.parse(message); // add zod validation
  console.log(`Join request received: ${data}`);

  await new Promise((r) => setTimeout(r, 1000));

  console.log('Ok cool, figured stuff out. Now sending response back to client');

  const match: Match = {
    id: data.matchId,
    teams: {
      team1: [data.player],
      team2: [],
    },
    hostId: data.player.id,
  };

  const willReject = Math.random() < 0.5; // 50% chance to reject

  if (willReject) {
    const response: JoinMatchResponse = {
      playerId: data.player.id,
      error: 'Match is full',
    };
    console.log(`Join request rejected: ${data}`);
    await redisPub.publish('matchMaking.responseJoin', JSON.stringify(response));
    return;
  }

  await redisPub.publish('matchMaking.responseJoin', JSON.stringify({ match, playerId: data.player.id }));
});

redisSub.subscribe(MATCH_MAKING_CHANNEL.SUBSCRIBE.LEAVE_MATCH, (message) => {
  console.log(`Message received: ${message}`);
});