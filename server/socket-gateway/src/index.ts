import express from 'express';
import { createClient } from 'redis';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PORT } from './constants';
import type { JoinResponse, Player, SocketServer } from './types';

dotenv.config();

const app = express();
const server = createServer(app);
const io: SocketServer = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());

const redisPub = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  }
});

const redisSub = redisPub.duplicate();

redisPub.on('error', (err) => console.error('Redis Client Error', err));

redisPub.connect();
redisSub.connect();

redisPub.on('connect', () => {
  console.log('👨‍⚖️ Redis Publisher Connected');
});

redisSub.on('connect', () => {
  console.log('🐱 Redis Subscriber Connected');
});

app.get('/', (req, res) => {
  res.send('Socket Gateway is running');
});

const playerToSocketIdMap = new Map<Player['id'], string>();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('requestJoin', (data) => {
    console.log(`Join request received: ${data}`);

    playerToSocketIdMap.set(data.player.id, socket.id);

    redisPub.publish('matchMaking.requestJoin', JSON.stringify(data));
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

redisSub.subscribe('matchMaking.responseJoin', (message) => {
  const data: JoinResponse = JSON.parse(message);
  const socketId = playerToSocketIdMap.get(data.playerId)
  if (!socketId) {
    console.error(`Socket ID not found for player ID: ${data.playerId}`);
    return;
  }
  io.to(socketId).emit('responseJoin', data);
});

server.listen(PORT, () => {
  console.log(`🔌 Socket Gateway Live on Port ${PORT}`);
});