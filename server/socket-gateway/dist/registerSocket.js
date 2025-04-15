"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const registrationDatabase_1 = require("./registrationDatabase");
const socket_1 = require("./socket");
const socket_gateway_1 = require("shared-types/dist/socket-gateway");
const chalk_1 = __importDefault(require("chalk"));
const register = (socket) => socket.on(socket_gateway_1.SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, async ({ playerId }, ack) => {
    await (0, registrationDatabase_1.addPlayerIdSocketIdMapping)({
        playerId,
        socketId: socket.id
    });
    // maybe add some match lookup logic and create socket rooms matching
    // match id
    const mappings = await (0, registrationDatabase_1.getAllMappings)();
    (0, socket_1.socketLogger)(socket_gateway_1.SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    (0, socket_1.socketLogger)(`Registered ${chalk_1.default.bold.green(playerId)} to ${chalk_1.default.bold.yellow(socket.id)}`);
    ack();
});
const unregister = (socket) => socket.on('disconnect', async () => {
    const playerId = await (0, registrationDatabase_1.removePlayerIdSocketIdMapping)({
        socketId: socket.id
    });
    const mappings = await (0, registrationDatabase_1.getAllMappings)();
    (0, socket_1.socketLogger)(socket_gateway_1.SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    (0, socket_1.socketLogger)(`Unregistered ${chalk_1.default.bold.green(playerId)} from ${chalk_1.default.bold.yellow(socket.id)}`);
});
exports.default = [register, unregister];
