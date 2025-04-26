// challengeRoutes.ts
import express from "express";
import { challenges } from "./challenges/challenges";

const router = express.Router();

function getRandomElements<T>(array: T[], count: number): T[] {
  if (count > array.length) {
    throw new Error("Count cannot be greater than array length");
  }

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

// get all challenges
router.get("/", (req, res) => {
  res.json(challenges);
});

// get random challenges, query param count determines how many
router.get("/random", (req, res) => {
  if (challenges.length === 0) {
    res.status(404).json({ error: "No challenges available" });
    return;
  }

  const { count } = req.query
  const parsedCount = count ? Number(count) : 1
  if (isNaN(parsedCount)) {
    res.status(400).json({ error: "Could not parse query param: count" })
    return
  }

  if (parsedCount <= 0 || !Number.isInteger(parsedCount)) {
    res.status(422).json({ error: "Query param count must be a positive integer" })
    return
  }

  if (parsedCount >= challenges.length) {
    res.status(422).json({ error: "Not enough challenges available" });
    return;
  }

  res.json(getRandomElements(challenges, parsedCount))
});

// get a specific challenge by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const problem = challenges.find((c) => c.id === id);

  if (!problem) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  res.json(problem);
});

export default router;
