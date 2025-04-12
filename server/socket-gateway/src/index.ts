import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { PORT } from './constants';
import { activateSocketServer } from './socket';

dotenv.config();

const app = express();
const server = createServer(app);

activateSocketServer(server)

app.use(express.json());

// redisSub.subscribe('matchMaking.responseJoin', (message) => {
//   const data: JoinResponse = JSON.parse(message);
//   const socketId = playerToSocketIdMap.get(data.playerId)
//   if (!socketId) {
//     console.error(`Socket ID not found for player ID: ${data.playerId}`);
//     return;
//   }
//   io.to(socketId).emit('responseJoin', data);
// });

server.listen(PORT, () => {
  console.log(`🔌 Socket Gateway Live on Port ${PORT}`);
});