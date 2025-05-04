import express from "express";
import { fetchChallenge, runTestCases } from "./utils";

const router = express.Router();

router.post("/", async (req, res) => {
  const { func, challengeId } = req.body;

  if (!func || !challengeId) {
    res.status(400).json({ error: "Function and challenge ID are required" });
    return;
  }

  const { challenge } = await fetchChallenge(challengeId)

  if (!challenge) throw '🤭'

  const testResults = await runTestCases(func, challenge.testCases);
  res.json(testResults);
});

export default router;
