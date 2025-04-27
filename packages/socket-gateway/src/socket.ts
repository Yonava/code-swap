import { Server } from 'socket.io';
import {
  IncomingMessage,
  Server as HTTPServer,
  ServerResponse
} from "http";
import { unregisterListener } from './registerSocket';
import matchMakingListeners from './match-making/inboundFromClient'
import gameManagementListeners from './game-management/inboundFromClient'
import type { SocketServerInstance } from 'shared-types/dist/socket-gateway';
import { LOG_COLORS } from './constants';

const SOCKET_LOG_PREFIX = '[Socket Server]';
export const socketLogger = (...msg: unknown[]) => console.log(`${SOCKET_LOG_PREFIX}`, ...msg);

export let io: SocketServerInstance;

export const activateSocketServer = (
  server: HTTPServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const socketListeners = [
    unregisterListener,
    matchMakingListeners,
    gameManagementListeners,
  ].flat()

  io.on('connection', (socket) => {
    socketLogger(`New Socket Connected with ID ${LOG_COLORS.socketId(socket.id)}`);
    socketListeners.forEach(listener => listener(socket));
  })

  return io
}