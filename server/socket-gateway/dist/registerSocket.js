"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registrationDatabase_1 = require("./registrationDatabase");
const socket_gateway_1 = require("shared-types/dist/socket-gateway");
const register = (socket) => socket.on(socket_gateway_1.SOCKET_GATEWAY_REGISTRATION_EVENT_NAME, async ({ playerId }, ack) => {
    await (0, registrationDatabase_1.addPlayerIdSocketIdMapping)({
        playerId,
        socketId: socket.id
    });
    // maybe add some match lookup logic and create socket rooms matching
    // match id
    ack();
});
exports.default = [register];
