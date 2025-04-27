import express from "express";
import { runTestCases } from "./utils";

const router = express.Router();

router.post("/", async (req, res) => {
  const { func, challengeId } = req.body;

  if (!func || !challengeId) {
    res.status(400).json({ error: "Function and challenge ID are required" });
    return;
  }

  const { results, error } = await runTestCases(func, challengeId);

  if (error) {
    res.status(500).json({ error });
    return;
  }

  res.json(results);
});

export default router;
