import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";
import challengeRoutes from "./router";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());

app.use("/challenges", challengeRoutes);

const PORT = process.env.PORT || LOCALHOST_PORT;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
