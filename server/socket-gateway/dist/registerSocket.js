"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterListener = exports.registerSocket = void 0;
const registrationDatabase_1 = require("./registrationDatabase");
const socket_1 = require("./socket");
const constants_1 = require("./constants");
const printRegistrationSuccess = ({ playerId, socketId }) => {
    const p = constants_1.LOG_COLORS.playerId(playerId);
    const s = constants_1.LOG_COLORS.socketId(socketId);
    (0, socket_1.socketLogger)(`Registered ${p} to ${s}`);
};
const printUnregistrationSuccess = ({ playerId, socketId, rooms, }) => {
    const p = constants_1.LOG_COLORS.playerId(playerId);
    const s = constants_1.LOG_COLORS.socketId(socketId);
    let str = `Unregistered ${p} from ${s} `;
    if (rooms.length === 0) {
        str += 'and left no match rooms';
    }
    else if (rooms.length === 1) {
        const room = constants_1.LOG_COLORS.matchId(rooms[0]);
        str += `and left match room ${room}`;
    }
    else {
        const commaSeparatedRooms = constants_1.LOG_COLORS.matchId(rooms.join(', '));
        str += `and left ${rooms.length} match rooms: ${commaSeparatedRooms}`;
    }
    (0, socket_1.socketLogger)(str);
};
const printUnregistrationNoPlayerId = ({ socketId }) => {
    const s = constants_1.LOG_COLORS.socketId(socketId);
    (0, socket_1.socketLogger)(`Unregistered Socket Disconnected with ID ${s}`);
};
const registerSocket = async (idPairing) => {
    if (!idPairing.playerId)
        throw new Error('no player id provided');
    try {
        await (0, registrationDatabase_1.addPlayerIdSocketIdMapping)(idPairing);
        printRegistrationSuccess(idPairing);
    }
    catch (e) {
        throw e;
    }
};
exports.registerSocket = registerSocket;
const unregisterListener = (socket) => socket.on('disconnecting', async () => {
    // slice removes default self socket.id room
    const rooms = Array.from(socket.rooms).slice(1);
    const playerId = await (0, registrationDatabase_1.removePlayerIdSocketIdMapping)({
        socketId: socket.id
    });
    if (!playerId)
        return printUnregistrationNoPlayerId({ socketId: socket.id });
    printUnregistrationSuccess({
        playerId,
        socketId: socket.id,
        rooms
    });
});
exports.unregisterListener = unregisterListener;
