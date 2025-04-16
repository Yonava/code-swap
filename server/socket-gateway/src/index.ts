import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import { PORT } from './constants';
import { activateSocketServer } from './socket';

const app = express();
const server = createServer(app);

activateSocketServer(server)

app.use(express.json());

server.listen(PORT, () => {
  console.log(`🔌 Socket Gateway Live on Port ${PORT}`);
});