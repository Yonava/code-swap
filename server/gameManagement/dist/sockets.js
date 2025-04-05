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
    const userToCodeEditorState = {};
    io.on('connection', (socket) => {
        console.log('socket connected', socket.id);
        console.log('number of sockets connected', io.engine.clientsCount);
        socket.on('join', async (userId, ack) => {
            console.log(`User ${userId} joined`);
            ack();
        });
        socket.on('userCodeEditorStateUpdate', (userId, codeEditorState) => {
            userToCodeEditorState[userId] = codeEditorState;
            console.log(`User ${userId} updated code editor state`, userToCodeEditorState);
        });
        socket.on('disconnect', () => {
            console.log('socket disconnected', socket.id);
            console.log('number of sockets connected', io.engine.clientsCount);
        });
        socket.on('error', (error) => {
            console.error(error);
        });
    });
    return io;
};
exports.sockets = sockets;
