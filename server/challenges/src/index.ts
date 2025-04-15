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

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
  });
}

const PORT = Number(process.env.PORT) || LOCALHOST_PORT;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
