import { RedisClient } from "../redis";
import { io } from "../socket";
import {
  type JoinMatchResponse,
  MATCH_MAKING_CHANNEL
} from "shared-types/dist/match-making";
import { getSocketIdFromPlayerId } from "../registrationDatabase";

const { sub } = RedisClient.getInstance();

const {
  RESPONSE_JOIN_MATCH,
  RESPONSE_CREATE_MATCH
} = MATCH_MAKING_CHANNEL;

sub.subscribe(RESPONSE_CREATE_MATCH, async (message) => {
  const data: JoinMatchResponse = JSON.parse(message);
  const socketId = await getSocketIdFromPlayerId(data.playerId);
  if (!socketId) throw new Error(
    `Socket Registration Database Error: Socket ID not found for player ID ${data.playerId}`
  );
  io.to(socketId).emit(RESPONSE_CREATE_MATCH, data);
});

sub.subscribe(RESPONSE_JOIN_MATCH, async (message) => {
  const data: JoinMatchResponse = JSON.parse(message);
  const socketId = await getSocketIdFromPlayerId(data.playerId);
  if (!socketId) throw new Error(
    `Socket Registration Database Error: Socket ID not found for player ID ${data.playerId}`
  );
  io.to(socketId).emit(RESPONSE_JOIN_MATCH, data);
});