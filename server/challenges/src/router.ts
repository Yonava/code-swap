// challengeRoutes.ts
import express from "express";
import { challenges } from "./challenges/challenges";

const router = express.Router();

// get all challenges
router.get("/all", (req, res) => {
  res.json(challenges);
});

// get a random challenge
router.get("/random", (req, res) => {
  if (challenges.length === 0) {
    res.status(404).json({ error: "No challenges available" });
    return;
  }

  const randomIndex = Math.floor(Math.random() * challenges.length);
  res.json(challenges[randomIndex]);
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

// get multiple challenges by ids
router.get("/", (req, res) => {
  const { ids } = req.body;

  if (!ids) {
    res.status(400).json({ error: "No challenge IDs provided" });
    return;
  }

  // parse the comma-separated ids
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

export default router;
