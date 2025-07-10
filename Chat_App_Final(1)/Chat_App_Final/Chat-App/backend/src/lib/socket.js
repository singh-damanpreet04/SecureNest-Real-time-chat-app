import { Server } from "socket.io";
import http from "http";
import express from "express";
import { create } from "domain";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// to store online users
const userSocketMap = {}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    
    // Listen for addUser event
    socket.on("addUser", (userId) => {
        if (userId) {
            console.log(`User ${userId} connected with socket ${socket.id}`);
            userSocketMap[userId] = socket.id;
            // Emit to all clients when a new user connects
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected (socket: ${socket.id})`);
        // Find and remove the user from userSocketMap
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                console.log(`Removing user ${userId} on disconnect`);
                delete userSocketMap[userId];
                // Emit updated online users list to all clients
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
                break;
            }
        }
    });

    // Handle manual disconnection
    socket.on("disconnectUser", (userId) => {
        console.log(`Manual disconnection for user ${userId}`);
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});
export { io, app, server};