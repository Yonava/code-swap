"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printRegistrationNotFoundError = exports.printReceivedSuccess = void 0;
const socket_1 = require("./socket");
const constants_1 = require("./constants");
const json_colorizer_1 = require("json-colorizer");
const printReceivedSuccess = ({ channel, playerId, payload }) => {
    const p = constants_1.LOG_COLORS.playerId(playerId);
    const c = constants_1.LOG_COLORS.channel(channel);
    let str = `Inbound request from ${p} to ${c}`;
    if (payload) {
        const blob = (0, json_colorizer_1.colorize)(JSON.stringify(payload, null, 2));
        str += `\n${blob}`;
    }
    (0, socket_1.socketLogger)(str);
};
exports.printReceivedSuccess = printReceivedSuccess;
const printRegistrationNotFoundError = ({ channel, socketId }) => {
    const s = constants_1.LOG_COLORS.socketId(socketId);
    const c = constants_1.LOG_COLORS.channel(channel);
    const e = constants_1.LOG_COLORS.error('Error!');
    (0, socket_1.socketLogger)(`${e} On inbound request to ${c}: Registration Not Found For Socket ID ${s}`);
};
exports.printRegistrationNotFoundError = printRegistrationNotFoundError;
