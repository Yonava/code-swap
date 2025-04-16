import { Server } from 'socket.io';
import {
  IncomingMessage,
  Server as HTTPServer,
  ServerResponse
} from "http";
import registerListeners from './registerSocket';
import matchMakingListeners from './match-making/incomingFromClient'
import type { SocketServerInstance } from 'shared-types/dist/socket-gateway';
import { RedisClient } from './redis';
import chalk from 'chalk';

const { pub } = RedisClient.getInstance();

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
    registerListeners,
    matchMakingListeners,
  ].flat()

  io.on('connection', (socket) => {
    socketLogger(`New Socket Connected with ID ${chalk.bold.yellow(socket.id)}`);
    socketListeners.forEach(listener => listener(socket));
  })

  return io
}