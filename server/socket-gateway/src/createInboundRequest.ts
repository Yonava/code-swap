import type { ClientSocketEvents } from "shared-types/dist/socket-gateway";
import { socketLogger } from "./socket";
import { LOG_COLORS } from "./constants";
import { colorize } from 'json-colorizer'

export const printReceivedSuccess = ({ channel, playerId, payload }: {
  channel: keyof ClientSocketEvents,
  playerId: string,
  payload: unknown
}) => {
  const p = LOG_COLORS.playerId(playerId);
  const c = LOG_COLORS.channel(channel);

  let str = `Inbound request from ${p} to ${c}`
  if (payload) {
    const blob = colorize(JSON.stringify(payload, null, 2));
    str += `\n${blob}`
  }
  socketLogger(str)
}

export const printRegistrationNotFoundError = ({ channel, socketId }: {
  channel: keyof ClientSocketEvents,
  socketId: string
}) => {
  const s = LOG_COLORS.socketId(socketId);
  const c = LOG_COLORS.channel(channel);
  const e = LOG_COLORS.error('Error!');
  socketLogger(`${e} On inbound request to ${c}: Registration Not Found For Socket ID ${s}`);
}
