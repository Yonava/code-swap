import { io } from "../socket";
import {
  type JoinMatchResponse,
  MATCH_MAKING_CHANNEL
} from "shared-types/dist/match-making";
import { getSocketIdFromPlayerId } from "../registrationDatabase";
import { listenToChannel } from "../listenToChannel";
import { pubSubLogger } from "../listenToChannel";
import { LOG_COLORS } from "../constants";
import { colorize } from "json-colorizer";

const {
  RESPONSE_JOIN_MATCH,
  RESPONSE_CREATE_MATCH
} = MATCH_MAKING_CHANNEL;

const logSocketLookupError = ({ playerId, payload }: {
  playerId: string
  payload: string
}) => {
  const e = LOG_COLORS.error('Error!');
  const c = LOG_COLORS.channel(RESPONSE_JOIN_MATCH);
  const blob = colorize(payload);
  pubSubLogger(
    `${e} Response from ${c} to ${playerId} dropped due to missing socket ID. Check registration db and  payload\n${blob}`
  );
}

listenToChannel<JoinMatchResponse>({
  from: RESPONSE_JOIN_MATCH,
  fn: async (data) => {
    const socketId = await getSocketIdFromPlayerId(data.playerId);
    if (!socketId) return logSocketLookupError({ playerId: data.playerId, payload: JSON.stringify(data) });
    io.to(socketId).emit(RESPONSE_JOIN_MATCH, data);
  }
});

listenToChannel<JoinMatchResponse>({
  from: RESPONSE_CREATE_MATCH,
  fn: async (data) => {
    const socketId = await getSocketIdFromPlayerId(data.playerId);
    if (!socketId) return logSocketLookupError({ playerId: data.playerId, payload: JSON.stringify(data) });
    io.to(socketId).emit(RESPONSE_CREATE_MATCH, data);
  }
});