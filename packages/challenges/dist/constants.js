"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG_COLORS = exports.PORT = exports.LOCALHOST_PORT = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.LOCALHOST_PORT = 3003;
exports.PORT = process.env.PORT || exports.LOCALHOST_PORT;
exports.LOG_COLORS = {
    error: chalk_1.default.bold.red,
    success: chalk_1.default.bold.green,
    info: chalk_1.default.bold.blue,
    warning: chalk_1.default.bold.yellow,
    debug: chalk_1.default.bold.cyan,
    socketId: chalk_1.default.bold.yellow,
    playerId: chalk_1.default.bold.green,
    matchId: chalk_1.default.bold.magenta,
    channel: chalk_1.default.bold.blue,
};
