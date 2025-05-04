"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const constants_1 = require("./constants");
const socket_1 = require("./socket");
require("./match-making/outboundToClient");
require("./game-management/outboundToClient");
require("./scoring/outboundToClient");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
(0, socket_1.activateSocketServer)(server);
app.use(express_1.default.json());
server.listen(constants_1.PORT, () => {
    console.log(`🔌 Socket Gateway Live on Port ${constants_1.PORT}`);
});
