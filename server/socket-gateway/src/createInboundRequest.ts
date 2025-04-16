import type { ClientSocketEvents, PlayerSocketInstance } from "shared-types/dist/socket-gateway";
import { socketLogger } from "./socket";
import { RedisClient } from "./redis";
import { getPlayerIdFromSocketId } from "./registrationDatabase";
import { LOG_COLORS } from "./constants";
import { colorize } from 'json-colorizer'

const { pub } = RedisClient.getInstance();

const printReceivedSuccess = ({ channel, playerId, payload }: {
  channel: keyof ClientSocketEvents,
  playerId: string,
  payload: unknown
}) => {
  const p = LOG_COLORS.playerId(playerId);
  const c = LOG_COLORS.channel(channel);
  const blob = colorize(JSON.stringify(payload, null, 2));
  socketLogger(`Inbound request from ${p} to ${c}\n${blob}`)
}

const printReceivedError = ({ channel, socketId }: {
  channel: keyof ClientSocketEvents,
  socketId: string
}) => {
  const s = LOG_COLORS.socketId(socketId);
  const c = LOG_COLORS.channel(channel);
  const e = LOG_COLORS.error('Error!');
  socketLogger(`${e} On inbound request to ${c}: Registration Not Found For Socket ID ${s}`);
}

export const createInboundRequest = (channel: keyof ClientSocketEvents) => (
  socket: PlayerSocketInstance
) => socket.on(
  channel,
  async (req: unknown) => {
    const playerId = await getPlayerIdFromSocketId(socket.id);
    if (!playerId) return printReceivedError({ channel, socketId: socket.id })
    printReceivedSuccess({
      channel,
      playerId,
      payload: req
    });
    pub.publish(channel, JSON.stringify(req))
  }
)
