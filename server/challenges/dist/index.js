"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const constants_1 = require("./constants");
const challenges_1 = require("./challenges/challenges");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use(express_1.default.json());
// Get a specific challenge by ID
app.get("/challenge/:id", (req, res) => {
    const { id } = req.params;
    const problem = challenges_1.challenges.find((c) => c.id === id);
    if (!problem) {
        res.status(404).json({ error: "Challenge not found" });
        return;
    }
    res.json(problem);
});
// Get multiple challenges by IDs
app.get("/challenges", (req, res) => {
    const { ids } = req.query;
    if (!ids) {
        res.status(400).json({ error: "No challenge IDs provided" });
        return;
    }
    // Parse the comma-separated IDs
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
// Get a random challenge
app.get("/challenges/random", (req, res) => {
    if (challenges_1.challenges.length === 0) {
        res.status(404).json({ error: "No challenges available" });
        return;
    }
    const randomIndex = Math.floor(Math.random() * challenges_1.challenges.length);
    res.json(challenges_1.challenges[randomIndex]);
});
// Get all challenges
app.get("/challenges/all", (req, res) => {
    res.json(challenges_1.challenges);
});
// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(__dirname + "/public/"));
    app.get("*", (req, res) => {
        res.sendFile(__dirname + "/public/index.html");
    });
}
const PORT = Number(process.env.PORT) || constants_1.LOCALHOST_PORT;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Available challenges: ${challenges_1.challenges.length}`);
});
