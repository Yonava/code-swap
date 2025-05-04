"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateSocketServer = exports.io = exports.socketLogger = void 0;
const socket_io_1 = require("socket.io");
const registerSocket_1 = require("./registerSocket");
const inboundFromClient_1 = __importDefault(require("./match-making/inboundFromClient"));
const inboundFromClient_2 = __importDefault(require("./game-management/inboundFromClient"));
const constants_1 = require("./constants");
const SOCKET_LOG_PREFIX = '[Socket Server]';
const socketLogger = (...msg) => console.log(`${SOCKET_LOG_PREFIX}`, ...msg);
exports.socketLogger = socketLogger;
const activateSocketServer = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    const socketListeners = [
        registerSocket_1.unregisterListener,
        inboundFromClient_1.default,
        inboundFromClient_2.default,
    ].flat();
    exports.io.on('connection', (socket) => {
        (0, exports.socketLogger)(`New Socket Connected with ID ${constants_1.LOG_COLORS.socketId(socket.id)}`);
        socketListeners.forEach(listener => listener(socket));
    });
    return exports.io;
};
exports.activateSocketServer = activateSocketServer;
