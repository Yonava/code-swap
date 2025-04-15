"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationDatabase_1 = require("./registrationDatabase");
const socket_1 = require("./socket");
const socket_gateway_1 = require("shared-types/dist/socket-gateway");
const constants_1 = require("./constants");
const printRegistrationSuccess = ({ playerId, socketId }) => {
    const p = constants_1.LOG_COLORS.playerId(playerId);
    const s = constants_1.LOG_COLORS.socketId(socketId);
    (0, socket_1.socketLogger)(`Registered ${p} to ${s}`);
};
const printUnregistrationSuccess = ({ playerId, socketId }) => {
    const p = constants_1.LOG_COLORS.playerId(playerId);
    const s = constants_1.LOG_COLORS.socketId(socketId);
    (0, socket_1.socketLogger)(`Unregistered ${p} from ${s}`);
};
const printUnregistrationNoPlayerId = ({ socketId }) => {
    const s = constants_1.LOG_COLORS.socketId(socketId);
    (0, socket_1.socketLogger)(`Unregistered Socket Disconnected with ID ${s}`);
};
const printRegistrationError = ({ socketId }) => {
    const s = constants_1.LOG_COLORS.socketId(socketId);
    const c = constants_1.LOG_COLORS.channel(socket_gateway_1.SOCKET_GATEWAY_REGISTRATION_EVENT_NAME);
    const e = constants_1.LOG_COLORS.error('Error!');
    (0, socket_1.socketLogger)(`${e} On inbound request to ${c}: No Player ID Provided - Registration For Socket ID ${s} Failed :(`);
};
const register = (socket) => socket.on(socket_gateway_1.SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, async ({ playerId }, ack) => {
    if (!playerId)
        return printRegistrationError({ socketId: socket.id });
    await (0, registrationDatabase_1.addPlayerIdSocketIdMapping)({
        playerId,
        socketId: socket.id
    });
    // maybe add some match lookup logic and create socket rooms matching
    // match id
    // const mappings = await getAllMappings();
    // socketLogger(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    printRegistrationSuccess({
        playerId,
        socketId: socket.id
    });
    ack();
});
const unregister = (socket) => socket.on('disconnect', async () => {
    const playerId = await (0, registrationDatabase_1.removePlayerIdSocketIdMapping)({
        socketId: socket.id
    });
    if (!playerId)
        return printUnregistrationNoPlayerId({ socketId: socket.id });
    // const mappings = await getAllMappings();
    // socketLogger(SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, mappings);
    printUnregistrationSuccess({
        playerId,
        socketId: socket.id
    });
});
exports.default = [register, unregister];
