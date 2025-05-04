"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// challengeRoutes.ts
const express_1 = __importDefault(require("express"));
const challenges_1 = require("./challenges/challenges");
const router = express_1.default.Router();
function getRandomElements(array, count) {
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
    res.json(challenges_1.challenges);
});
// get random challenges, query param count determines how many
router.get("/random", (req, res) => {
    if (challenges_1.challenges.length === 0) {
        res.status(404).json({ error: "No challenges available" });
        return;
    }
    const { count } = req.query;
    const parsedCount = count ? Number(count) : 1;
    if (isNaN(parsedCount)) {
        res.status(400).json({ error: "Could not parse query param: count" });
        return;
    }
    if (parsedCount <= 0 || !Number.isInteger(parsedCount)) {
        res.status(422).json({ error: "Query param count must be a positive integer" });
        return;
    }
    if (parsedCount >= challenges_1.challenges.length) {
        res.status(422).json({ error: "Not enough challenges available" });
        return;
    }
    res.json(getRandomElements(challenges_1.challenges, parsedCount));
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
exports.default = router;
