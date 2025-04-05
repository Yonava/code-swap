import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { LOCALHOST_PORT } from "./constants";
import { challenges } from "./challenges/challenges";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());

// Get a specific challenge by ID
app.get("/challenge/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const problem = challenges.find((c) => c.id === id);

  if (!problem) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  res.json(problem);
});

// Get multiple challenges by IDs
app.get("/challenges", (req: Request, res: Response) => {
  const { ids } = req.query;

  if (!ids) {
    res.status(400).json({ error: "No challenge IDs provided" });
    return;
  }

  // Parse the comma-separated IDs
  const challengeIds = Array.isArray(ids) ? ids : String(ids).split(",");
  const requestedChallenges = challenges.filter((c) =>
    challengeIds.includes(c.id)
  );

  if (requestedChallenges.length === 0) {
    res
      .status(404)
      .json({ error: "No challenges found with the provided IDs" });
    return;
  }

  res.json(requestedChallenges);
});

// Get a random challenge
app.get("/challenges/random", (req: Request, res: Response) => {
  if (challenges.length === 0) {
    res.status(404).json({ error: "No challenges available" });
    return;
  }

  const randomIndex = Math.floor(Math.random() * challenges.length);
  res.json(challenges[randomIndex]);
});

// Get all challenges
app.get("/challenges/all", (req: Request, res: Response) => {
  res.json(challenges);
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(__dirname + "/public/index.html");
  });
}

const PORT = Number(process.env.PORT) || LOCALHOST_PORT;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Available challenges: ${challenges.length}`);
});
