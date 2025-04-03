"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sockets = void 0;
const socket_io_1 = require("socket.io");
const sockets = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
        },
    });
    io.on('connection', (socket) => {
        socket.on('joinRoom', async (joinRoomOptions, callback) => {
        });
        socket.on('leaveRoom', (confirmationCallback) => {
        });
        socket.on('nodeAdded', (node) => {
        });
        socket.on('nodeRemoved', (nodeId) => {
        });
        socket.on('nodeMoved', (node) => {
        });
        socket.on('edgeAdded', (edge) => {
        });
        socket.on('edgeRemoved', (edgeId) => {
        });
        socket.on('edgeLabelEdited', (edgeId, newLabel) => {
        });
        socket.on('collaboratorMoved', ({ x, y }) => {
        });
        socket.on('disconnect', () => {
        });
        socket.on('error', (error) => {
            console.error(error);
        });
    });
    return io;
};
exports.sockets = sockets;
