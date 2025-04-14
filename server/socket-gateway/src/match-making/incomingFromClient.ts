import type { PlayerSocketInstance } from "shared-types/dist/socket-gateway";
import { MATCH_MAKING_CHANNEL } from "shared-types/dist/match-making";
import { RedisClient } from "../redis";

const { pub } = RedisClient.getInstance();

const {
  REQUEST_CREATE_MATCH,
  REQUEST_JOIN_MATCH,
  LEAVE_MATCH
} = MATCH_MAKING_CHANNEL;

const requestCreateMatch = (socket: PlayerSocketInstance) => socket.on(
  REQUEST_CREATE_MATCH,
  (req) => pub.publish(REQUEST_CREATE_MATCH, JSON.stringify(req))
);

const requestJoinMatch = (socket: PlayerSocketInstance) => socket.on(
  REQUEST_JOIN_MATCH,
  (req) => pub.publish(REQUEST_JOIN_MATCH, JSON.stringify(req))
);

const leaveMatch = (socket: PlayerSocketInstance) => socket.on(
  LEAVE_MATCH,
  (req) => pub.publish(LEAVE_MATCH, JSON.stringify(req))
);

export default [requestCreateMatch, requestJoinMatch, leaveMatch]