"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const codeSubmissions_1 = require("../db/codeSubmissions");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const matches = Array.from(codeSubmissions_1.codeSubmissions.entries());
    res.json(matches);
});
router.get('/:matchId', async (req, res) => {
    const submissions = codeSubmissions_1.codeSubmissions.get(req.params.matchId);
    res.json(submissions);
});
exports.default = router;
