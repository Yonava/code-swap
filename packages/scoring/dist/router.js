"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    const { func, challengeId } = req.body;
    if (!func || !challengeId) {
        res.status(400).json({ error: "Function and challenge ID are required" });
        return;
    }
    const { challenge } = await (0, utils_1.fetchChallenge)(challengeId);
    if (!challenge)
        throw '🤭';
    const testResults = await (0, utils_1.runTestCases)(func, challenge.testCases);
    res.json(testResults);
});
exports.default = router;
