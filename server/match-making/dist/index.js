"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("./constants");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const redisPub = (0, redis_1.createClient)({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});
const redisSub = redisPub.duplicate();
redisPub.on('error', (err) => console.error('Redis Client Error', err));
redisPub.connect();
redisSub.connect();
redisPub.on('connect', () => {
    console.log('🐮 Redis Publisher Connected');
});
redisSub.on('connect', () => {
    console.log('🐱 Redis Subscriber Connected');
});
redisSub.subscribe('matchMaking.requestJoin', async (message) => {
    const data = JSON.parse(message); // add zod validation
    console.log(`Join request received: ${data}`);
    await new Promise((r) => setTimeout(r, 1000));
    console.log('Ok cool, figured stuff out. Now sending response back to client');
    const match = {
        id: data.matchId,
        teams: {
            team1: [data.player],
            team2: [],
        },
        host: data.player.id,
    };
    const willReject = Math.random() < 0.5; // 50% chance to reject
    if (willReject) {
        const response = {
            playerId: data.player.id,
            error: 'Match is full',
        };
        console.log(`Join request rejected: ${data}`);
        await redisPub.publish('matchMaking.responseJoin', JSON.stringify(response));
        return;
    }
    await redisPub.publish('matchMaking.responseJoin', JSON.stringify({ match, playerId: data.player.id }));
});
redisSub.subscribe('matchMaking.leave', (message) => {
    console.log(`Message received: ${message}`);
});
app.get('/', (req, res) => {
    res.send('Match Making is running');
});
app.listen(constants_1.PORT, () => {
    console.log(`👩‍❤️‍💋‍👩 Match Making Live on Port ${constants_1.PORT}`);
});
