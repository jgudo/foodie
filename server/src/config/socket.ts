import { Application } from "express";
import { Server } from "http";
import config from '../config/config';
import User from '../schemas/UserSchema';

export default function (app: Application, server: Server) {
    const io = require('socket.io')(server, {
        cors: {
            origin: config.cors.origin || 'http://localhost:3000',
            methods: ["GET", "POST", "PATCH"],
            credentials: true
        }
    });

    app.set('io', io);

    io.on("connection", (socket: SocketIO.Socket) => {
        socket.on("userConnect", (id) => {
            User
                .findById(id)
                .then((user) => {
                    if (user) {
                        socket.join(user._id.toString());
                        console.log('Client connected.');
                    }
                })
                .catch((e) => {
                    console.log('Invalid user ID, cannot join Socket.');
                });
        });

        socket.on("userDisconnect", (userID) => {
            socket.leave(userID);
            console.log('Client Disconnected.');
        });

        socket.on("onFollowUser", (data) => {
            console.log(data);
        });

        socket.on("disconnect", () => {
            console.log('Client disconnected');
        });
    });
}