"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const constants_1 = require("./constants");
const router_1 = __importDefault(require("./router"));
require("./pub-sub/subscribers");
const redis_1 = require("./redis");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use(express_1.default.json());
app.use("/test", router_1.default);
app.get("/health", (req, res) => {
    const { pub, sub } = redis_1.RedisClient.getInstance();
    res.status(200).json({
        status: "ok",
        redisPub: pub.isReady,
        redisSub: sub.isReady,
    });
});
const PORT = process.env.PORT || constants_1.LOCALHOST_PORT;
server.listen(PORT, () => {
    console.log(`📈 Scoring Live on Port ${PORT}`);
});
