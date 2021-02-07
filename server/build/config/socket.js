"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socketIO = __importStar(require("socket.io"));
const config_1 = __importDefault(require("../config/config"));
const UserSchema_1 = __importDefault(require("../schemas/UserSchema"));
function default_1(app, server) {
    const io = socketIO(server, {
        cors: {
            origin: config_1.default.cors.origin || 'http://localhost:3000',
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