"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
const redis_1 = require("./redis");
const matches_1 = __importDefault(require("./rest/matches"));
require("./pub-sub/subscribers");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/matches', matches_1.default);
app.get('/health', (req, res) => {
    const { pub, sub } = redis_1.RedisClient.getInstance();
    res.status(200).json({
        status: 'ok',
        redisPub: pub.isReady,
        redisSub: sub.isReady,
    });
});
app.listen(constants_1.PORT, () => {
    console.log(`💫 Match Making Live on Port ${constants_1.PORT}`);
});
