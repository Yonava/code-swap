import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PORT } from './constants';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Socket Gateway is running');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on('message', (data) => {
    console.log(`Message received: ${data}`);
    io.emit('message', data);
  });
});

server.listen(PORT, () => {
  console.log(`🔌 Socket Gateway Live on Port ${PORT}`);
});