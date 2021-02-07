"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserSchema_1 = __importDefault(require("../schemas/UserSchema"));
function default_1(app, server) {
    const io = require("socket.io")(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    app.set('io', io);
    io.on("connection", (socket) => {
        socket.on("userConnect", (id) => {
            UserSchema_1.default
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
exports.default = default_1;
//# sourceMappingURL=socket.js.map