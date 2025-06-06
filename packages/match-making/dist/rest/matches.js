"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matches_1 = require("../db/matches");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const matches = await (0, matches_1.getAllMatches)();
    res.json(matches);
});
router.get('/pairings', async (req, res) => {
    const pairings = await (0, matches_1.getAllPlayerIdMatchIdPairings)();
    res.json(pairings);
});
router.get('/:id', async (req, res) => {
    const match = await (0, matches_1.getMatch)(req.params.id);
    res.json(match ?? `match with id ${req.params.id} not found`);
});
router.get('/player/:playerId', async (req, res) => {
    const matchId = await (0, matches_1.getPlayerMatchId)(req.params.playerId);
    res.json(matchId ?? `player with id ${req.params.playerId} not in match`);
});
exports.default = router;
