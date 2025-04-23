import { MATCH_MAKING_CHANNEL } from "shared-types/dist/match-making";
import { printReceivedSuccess, printRegistrationNotFoundError } from "../printInboundRequest";
import { PlayerSocketInstance } from "shared-types";
import { RedisClient } from "../redis";
import { registerSocket } from "../registerSocket";
import { LOG_COLORS } from "../constants";
import { socketLogger } from "../socket";
import { getPlayerIdFromSocketId } from "../registrationDatabase";

const { pub } = RedisClient.getInstance()

const {
  REQUEST_CREATE_MATCH,
  RESPONSE_CREATE_MATCH,

  REQUEST_JOIN_MATCH,
  RESPONSE_JOIN_MATCH,

  LEAVE_MATCH,
  MATCH_READY,
} = MATCH_MAKING_CHANNEL;

const printRegistrationError = ({
  socketId,
  channel,
  issue,
}: {
  socketId: string,
  channel: string,
  issue: string,
}) => {
  const s = LOG_COLORS.socketId(socketId);
  const c = LOG_COLORS.channel(channel);
  const e = LOG_COLORS.error('Registration Error!');
  socketLogger(`${e} On inbound request to ${c} for socket ${s}: ${issue}`);
}

const requestCreateMatch = (socket: PlayerSocketInstance) => {
  socket.on(REQUEST_CREATE_MATCH, async (req) => {
    const playerId = req.player.id
    try {
      await registerSocket({ socketId: socket.id, playerId })
    } catch (e) {
      if (e instanceof Error) {
        printRegistrationError({
          socketId: socket.id,
          channel: REQUEST_CREATE_MATCH,
          issue: e.message
        })
        return socket.emit(RESPONSE_CREATE_MATCH, { playerId, error: e.message })
      }
      throw new Error(`Unhandled Registration Failure -> ${String(e)}`)
    }

    printReceivedSuccess({ channel: REQUEST_CREATE_MATCH, playerId, payload: req })
    pub.publish(REQUEST_CREATE_MATCH, JSON.stringify(req))
  })
};

const requestJoinMatch = (socket: PlayerSocketInstance) => {
  socket.on(REQUEST_JOIN_MATCH, async (req) => {
    const playerId = req.player.id
    try {
      await registerSocket({ socketId: socket.id, playerId })
    } catch (e) {
      if (e instanceof Error) {
        printRegistrationError({
          socketId: socket.id,
          channel: REQUEST_JOIN_MATCH,
          issue: e.message
        })
        return socket.emit(RESPONSE_JOIN_MATCH, { playerId, error: e.message })
      }
      throw new Error(`Unhandled Registration Failure -> ${String(e)}`)
    }

    printReceivedSuccess({ channel: REQUEST_JOIN_MATCH, playerId, payload: req })
    pub.publish(REQUEST_JOIN_MATCH, JSON.stringify(req))
  })
};

const leaveMatch = (socket: PlayerSocketInstance) => {
  socket.on(LEAVE_MATCH, async () => {
    const { id: socketId } = socket
    const playerId = await getPlayerIdFromSocketId(socketId);
    if (!playerId) return printRegistrationNotFoundError({ channel: LEAVE_MATCH, socketId })
    pub.publish(LEAVE_MATCH, JSON.stringify({ playerId }))
  })
}

const startMatch = (socket: PlayerSocketInstance) => {
  socket.on(MATCH_READY, async () => {
    const { id: socketId } = socket
    const playerId = await getPlayerIdFromSocketId(socketId);
    if (!playerId) return printRegistrationNotFoundError({ channel: LEAVE_MATCH, socketId })
    // pub.publish()
  })
}

export default [requestCreateMatch, requestJoinMatch, leaveMatch]