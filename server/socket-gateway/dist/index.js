"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("./constants");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
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
    console.log('👨‍⚖️ Redis Publisher Connected');
});
redisSub.on('connect', () => {
    console.log('🐱 Redis Subscriber Connected');
});
app.get('/', (req, res) => {
    res.send('Socket Gateway is running');
});
const playerToSocketIdMap = new Map();
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('requestJoin', (data) => {
        console.log(`Join request received: ${data}`);
        playerToSocketIdMap.set(data.player.id, socket.id);
        redisPub.publish('matchMaking.requestJoin', JSON.stringify(data));
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
redisSub.subscribe('matchMaking.responseJoin', (message) => {
    const data = JSON.parse(message);
    const socketId = playerToSocketIdMap.get(data.playerId);
    if (!socketId) {
        console.error(`Socket ID not found for player ID: ${data.playerId}`);
        return;
    }
    io.to(socketId).emit('responseJoin', data);
});
server.listen(constants_1.PORT, () => {
    console.log(`🔌 Socket Gateway Live on Port ${constants_1.PORT}`);
});
