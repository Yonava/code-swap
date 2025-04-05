import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" });
});

app.get("/", (req, res) => {
  res.send("Hello World! Server is working!");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

const PORT = process.env.PORT || LOCALHOST_PORT;

server.listen(Number(PORT), () => {
  console.log(`Server listening on port ${PORT}`);
});
