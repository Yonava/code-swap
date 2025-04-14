import {
  type CreateMatchRequest,
  type JoinMatchRequest,
  type LeaveMatch,
  MATCH_MAKING_CHANNEL
} from 'shared-types/dist/match-making';
import { RedisClient } from "../redis";
import {
  addPlayerToMatch,
  createNewMatch,
  removePlayerFromMatch
} from "../matches";

const { pub, sub } = RedisClient.getInstance();

const {
  REQUEST_CREATE_MATCH,
  RESPONSE_CREATE_MATCH,
  REQUEST_JOIN_MATCH,
  RESPONSE_JOIN_MATCH,
  LEAVE_MATCH
} = MATCH_MAKING_CHANNEL;

sub.subscribe(REQUEST_CREATE_MATCH, async (message) => {
  const data: CreateMatchRequest = JSON.parse(message); // add zod validation
  const result = await createNewMatch(data.player);
  const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
  pub.publish(RESPONSE_CREATE_MATCH, JSON.stringify(publishedResponse));
});

sub.subscribe(REQUEST_JOIN_MATCH, async (message) => {
  const data: JoinMatchRequest = JSON.parse(message); // add zod validation
  const result = await addPlayerToMatch(data);
  const publishedResponse = typeof result === 'string' ? { error: result } : { match: result };
  pub.publish(RESPONSE_JOIN_MATCH, JSON.stringify(publishedResponse));
});

sub.subscribe(LEAVE_MATCH, async (message) => {
  const data: LeaveMatch = JSON.parse(message); // add zod validation
  await removePlayerFromMatch(data.matchId, data.playerId);
});