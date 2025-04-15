"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// challengeRoutes.ts
const express_1 = __importDefault(require("express"));
const challenges_1 = require("./challenges/challenges");
const router = express_1.default.Router();
// get all challenges
router.get("/all", (req, res) => {
    res.json(challenges_1.challenges);
});
// get a random challenge
router.get("/random", (req, res) => {
    if (challenges_1.challenges.length === 0) {
        res.status(404).json({ error: "No challenges available" });
        return;
    }
    const randomIndex = Math.floor(Math.random() * challenges_1.challenges.length);
    res.json(challenges_1.challenges[randomIndex]);
});
// get a specific challenge by id
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const problem = challenges_1.challenges.find((c) => c.id === id);
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
    const requestedChallenges = challenges_1.challenges.filter((c) => challengeIds.includes(c.id));
    if (requestedChallenges.length === 0) {
        res
            .status(404)
            .json({ error: "No challenges found with the provided IDs" });
        return;
    }
    res.json(requestedChallenges);
});
exports.default = router;
