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
import { PlayerJoinLeave } from "shared-types/dist/socket-gateway";

const {
  RESPONSE_JOIN_MATCH,
  RESPONSE_CREATE_MATCH,
  PLAYER_JOINED,
  PLAYER_LEFT,
} = MATCH_MAKING_CHANNEL;

const logSocketLookupError = ({ playerId, payload }: {
  playerId: string
  payload: string
}) => {
  const e = LOG_COLORS.error('Error!');
  const c = LOG_COLORS.channel(RESPONSE_JOIN_MATCH);
  const blob = colorize(payload);
  pubSubLogger(
    `${e} Response from ${c} to ${playerId} dropped due to missing socket/socketId. Check registration db and  payload\n${blob}`
  );
}

listenToChannel<JoinMatchResponse>({
  from: RESPONSE_JOIN_MATCH,
  fn: async (data) => {
    const logErr = () => logSocketLookupError({
      playerId: data.playerId,
      payload: JSON.stringify(data)
    })

    const socketId = await getSocketIdFromPlayerId(data.playerId);
    if (!socketId) return logErr();
    const socket = io.sockets.sockets.get(socketId)
    if (!socket) return logErr();

    if ('error' in data) return socket.emit(RESPONSE_JOIN_MATCH, data);

    const { match } = data
    socket.join(match.id)
    io.to(match.id).emit(PLAYER_JOINED, { match })
  }
});

listenToChannel<JoinMatchResponse>({
  from: RESPONSE_CREATE_MATCH,
  fn: async (data) => {
    const logErr = () => logSocketLookupError({
      playerId: data.playerId,
      payload: JSON.stringify(data)
    })

    const socketId = await getSocketIdFromPlayerId(data.playerId);
    if (!socketId) return logErr();
    const socket = io.sockets.sockets.get(socketId)
    if (!socket) return logErr();

    if ('error' in data) return socket.emit(RESPONSE_CREATE_MATCH, data);

    const { match } = data
    socket.join(match.id)
    io.to(match.id).emit(PLAYER_JOINED, { match })
  }
});

listenToChannel<PlayerJoinLeave>({
  from: PLAYER_LEFT,
  fn: ({ match }) => io.to(match.id).emit(PLAYER_LEFT, { match })
})