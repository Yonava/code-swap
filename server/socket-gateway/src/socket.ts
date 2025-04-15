import { Server } from 'socket.io';
import {
  IncomingMessage,
  Server as HTTPServer,
  ServerResponse
} from "http";
import registerListeners from './registerSocket';
import matchMakingListeners from './match-making/incomingFromClient'
import type {
  PlayerSocketInstance,
  SocketServerInstance
} from 'shared-types/dist/socket-gateway';
import { RedisClient } from './redis';

const { pub } = RedisClient.getInstance();

const SOCKET_LOG_PREFIX = '[Socket Server]';
export const socketLogger = (...msg: unknown[]) => console.log(`${SOCKET_LOG_PREFIX}`, ...msg);

export let io: SocketServerInstance;

const disconnectListener = (socket: PlayerSocketInstance) => socket.on('disconnect', () => {
  socketLogger(`Player Disconnected with Socket ID: ${socket.id}`);
})

export const activateSocketServer = (
  server: HTTPServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const socketListeners = [
    registerListeners,
    matchMakingListeners,
    disconnectListener,
  ].flat()

  io.on('connection', (socket) => {
    socketLogger(`Player Connected with Socket ID: ${socket.id}`);
    socketListeners.forEach(listener => listener(socket));
  })

  return io
}