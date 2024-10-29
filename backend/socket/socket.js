// socket.js
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import exp from 'constants';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

const userSocketMap = {}; 

export const getReceiverSocketId =(receiverId)=>userSocketMap[receiverId]

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User connected: userID = ${userId}, SocketID = ${socket.id}`);

        // Emit online users after a new user connects
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }

    socket.on('disconnect', () => {
        if (userId) {
            console.log(`User disconnected: userID = ${userId}, SocketID = ${socket.id}`);
            delete userSocketMap[userId];

            // Emit online users after a user disconnects
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });
});

export { app, server, io };
