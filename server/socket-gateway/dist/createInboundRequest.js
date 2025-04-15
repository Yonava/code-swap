"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInboundRequest = void 0;
const socket_1 = require("./socket");
const redis_1 = require("./redis");
const registrationDatabase_1 = require("./registrationDatabase");
const chalk_1 = __importDefault(require("chalk"));
const { pub } = redis_1.RedisClient.getInstance();
const prettyPrint = ({ channel, socketId, playerId, payload }) => {
    (0, socket_1.socketLogger)(`----------------------
    Inbound Request to ${channel} from Socket ID: ${socketId}\n
    Payload: ${JSON.stringify(payload, null, 2)}\n
    Registered to Player ID: ${playerId}\n
    ----------------------`);
};
const createInboundRequest = (channel) => (socket) => socket.on(channel, async (req) => {
    const playerId = await (0, registrationDatabase_1.getPlayerIdFromSocketId)(socket.id);
    if (!playerId) {
        (0, socket_1.socketLogger)(`${chalk_1.default.bold.red('Error!')} On inbound request to ${chalk_1.default.bold.blue(channel)}:
 Registration Not Found For Socket ID: ${socket.id}`);
        return;
    }
    prettyPrint({
        channel,
        socketId: socket.id,
        playerId,
        payload: req
    });
    pub.publish(channel, JSON.stringify(req));
});
exports.createInboundRequest = createInboundRequest;
