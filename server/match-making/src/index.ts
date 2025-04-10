import express from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { PORT } from './constants';
import { JoinRequest, JoinResponse, JoinResponseRejected, Match } from './types';

dotenv.config();

const app = express();

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
  console.log('🐮 Redis Publisher Connected');
});

redisSub.on('connect', () => {
  console.log('🐱 Redis Subscriber Connected');
});

redisSub.subscribe('matchMaking.requestJoin', async (message) => {
  const data: JoinRequest = JSON.parse(message); // add zod validation
  console.log(`Join request received: ${data}`);

  await new Promise((r) => setTimeout(r, 1000));

  console.log('Ok cool, figured stuff out. Now sending response back to client');

  const match: Match = {
    id: data.matchId,
    teams: {
      team1: [data.player],
      team2: [],
    },
    host: data.player.id,
  };

  const willReject = Math.random() < 0.5; // 50% chance to reject

  if (willReject) {
    const response: JoinResponse = {
      playerId: data.player.id,
      error: 'Match is full',
    };
    console.log(`Join request rejected: ${data}`);
    await redisPub.publish('matchMaking.responseJoin', JSON.stringify(response));
    return;
  }

  await redisPub.publish('matchMaking.responseJoin', JSON.stringify({ match, playerId: data.player.id }));
});

redisSub.subscribe('matchMaking.leave', (message) => {
  console.log(`Message received: ${message}`);
});

app.get('/', (req, res) => {
  res.send('Match Making is running');
});

app.listen(PORT, () => {
  console.log(`👩‍❤️‍💋‍👩 Match Making Live on Port ${PORT}`);
});