"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateSocketServer = exports.io = exports.socketLogger = void 0;
const socket_io_1 = require("socket.io");
const registerSocket_1 = __importDefault(require("./registerSocket"));
const incomingFromClient_1 = __importDefault(require("./match-making/incomingFromClient"));
const redis_1 = require("./redis");
const { pub } = redis_1.RedisClient.getInstance();
const SOCKET_LOG_PREFIX = '[Socket Server]';
const socketLogger = (...msg) => console.log(`${SOCKET_LOG_PREFIX}`, ...msg);
exports.socketLogger = socketLogger;
const disconnectListener = (socket) => socket.on('disconnect', () => {
    (0, exports.socketLogger)(`Player Disconnected with Socket ID: ${socket.id}`);
});
const activateSocketServer = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    const socketListeners = [
        registerSocket_1.default,
        incomingFromClient_1.default,
        disconnectListener,
    ].flat();
    exports.io.on('connection', (socket) => {
        (0, exports.socketLogger)(`Player Connected with Socket ID: ${socket.id}`);
        socketListeners.forEach(listener => listener(socket));
    });
    return exports.io;
};
exports.activateSocketServer = activateSocketServer;
