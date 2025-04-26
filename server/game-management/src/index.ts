import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'
import { PORT } from './constants';
import { RedisClient } from './redis';
import './pub-sub/subscribers';

const app = express();

app.use(cors())
app.use(express.json());

app.get('/health', (req, res) => {
  const { pub, sub } = RedisClient.getInstance();
  res.status(200).json({
    status: 'ok',
    redisPub: pub.isReady,
    redisSub: sub.isReady,
  });
})

app.listen(PORT, () => {
  console.log(`🎮 Game Management Live on Port ${PORT}`);
});