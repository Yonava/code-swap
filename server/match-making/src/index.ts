import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PORT } from './constants';
import './pub-sub/subscribers';

const app = express();
app.use(express.json());

app.listen(PORT, () => {
  console.log(`👩‍❤️‍💋‍👩 Match Making Live on Port ${PORT}`);
});