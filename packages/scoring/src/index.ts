import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";
import testRoutes from "./router";
import "./pub-sub/subscribers";
import { RedisClient } from "./redis";

const app = express();
const server = createServer(app);

app.use(express.json());

app.use("/test", testRoutes);

app.get("/health", (req, res) => {
  const { pub, sub } = RedisClient.getInstance();
  res.status(200).json({
    status: "ok",
    redisPub: pub.isReady,
    redisSub: sub.isReady,
  });
});

const PORT = process.env.PORT || LOCALHOST_PORT;
server.listen(PORT, () => {
  console.log(`📈 Scoring Live on Port ${PORT}`);
});
