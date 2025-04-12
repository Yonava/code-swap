import { PlayerSocketInstance } from "../types";
import { MATCH_MAKING_CHANNEL } from "./channels";
import { RedisClient } from "../redis";

const { PUBLISH } = MATCH_MAKING_CHANNEL;
const { pub } = RedisClient.getInstance();

const requestCreateMatch = (socket: PlayerSocketInstance) => socket.on(
  PUBLISH.REQUEST_CREATE_MATCH,
  (req) => pub.publish(PUBLISH.REQUEST_CREATE_MATCH, JSON.stringify(req))
);

const requestJoinMatch = (socket: PlayerSocketInstance) => socket.on(
  PUBLISH.REQUEST_JOIN_MATCH,
  (req) => pub.publish(PUBLISH.REQUEST_JOIN_MATCH, JSON.stringify(req))
);

const leaveMatch = (socket: PlayerSocketInstance) => socket.on(
  PUBLISH.LEAVE_MATCH,
  (req) => pub.publish(PUBLISH.LEAVE_MATCH, JSON.stringify(req))
);

export default [requestCreateMatch, requestJoinMatch, leaveMatch]