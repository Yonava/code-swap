import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PORT } from './constants';
import { RedisClient } from './redis';
import { getAllMatches } from './db/matches';
import './pub-sub/subscribers';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  const { pub, sub } = RedisClient.getInstance();
  res.status(200).json({
    status: 'ok',
    redisPub: pub.isReady,
    redisSub: sub.isReady,
  });
})

app.get('/matches', async (req, res) => {
  const matches = await getAllMatches();
  res.status(200).json(matches);
})

app.listen(PORT, () => {
  console.log(`👩‍❤️‍💋‍👩 Match Making Live on Port ${PORT}`);
});