"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playerToTeam_1 = require("../db/playerToTeam");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const matches = Array.from(playerToTeam_1.playerToTeam.entries());
    res.json(matches);
});
router.get('/:playerId', async (req, res) => {
    const team = playerToTeam_1.playerToTeam.get(req.params.playerId);
    res.json(team);
});
exports.default = router;
