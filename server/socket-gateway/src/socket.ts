import { Server } from 'socket.io';
import {
  IncomingMessage,
  Server as HTTPServer,
  ServerResponse
} from "http";
import type { SocketServerInstance } from "./types";
import registerListeners from './registerSocket';
import matchMakingListeners from './match-making/incomingFromClient'

const SOCKET_LOG_PREFIX = '[Socket Server]';
export const socketLogger = (msg: string) => console.log(`${SOCKET_LOG_PREFIX}`, msg);

export const activateSocketServer = (
  server: HTTPServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io: SocketServerInstance = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const socketListeners = [
    registerListeners,
    matchMakingListeners
  ].flat()

  io.on('connection', (socket) => {
    socketLogger(`Player Connected with Socket ID: ${socket.id}`);
    socketListeners.forEach(listener => listener(socket));
  })

  return io
}