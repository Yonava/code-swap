import { MATCH_MAKING_CHANNEL } from "./channels";
import { RedisClient } from "../redis";
import { io } from "../socket";
import { JoinMatchResponse } from "shared-types/dist/match-making";
import { getSocketIdFromPlayerId } from "../registrationDatabase";

const { SUBSCRIBE } = MATCH_MAKING_CHANNEL;
const { sub } = RedisClient.getInstance();

sub.subscribe(SUBSCRIBE.RESPONSE_CREATE_MATCH, async (message) => {
  const data: JoinMatchResponse = JSON.parse(message);
  const socketId = await getSocketIdFromPlayerId(data.playerId);
  if (!socketId) throw new Error(
    `Socket Registration Database Error: Socket ID not found for player ID ${data.playerId}`
  );
  io.to(socketId).emit(SUBSCRIBE.RESPONSE_CREATE_MATCH, data);
});

sub.subscribe(SUBSCRIBE.RESPONSE_JOIN_MATCH, async (message) => {
  const data: JoinMatchResponse = JSON.parse(message);
  const socketId = await getSocketIdFromPlayerId(data.playerId);
  if (!socketId) throw new Error(
    `Socket Registration Database Error: Socket ID not found for player ID ${data.playerId}`
  );
  io.to(socketId).emit(SUBSCRIBE.RESPONSE_JOIN_MATCH, data);
});