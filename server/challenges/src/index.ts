import dotenv from "dotenv";
import express from "express";
import cors from 'cors'
import { PORT } from "./constants";
import challengeRoutes from "./router";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());

app.use("/challenges", challengeRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
