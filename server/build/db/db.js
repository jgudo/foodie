"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const config_1 = __importDefault(require("../config/config"));
const mongoUri = config_1.default.mongodb.uri || 'mongodb://localhost:27017';
const dbName = config_1.default.mongodb.dbName || 'foodie';
if (config_1.default.server.env === 'dev') {
    mongoose.set("debug", true);
}
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    serverSelectionTimeoutMS: 5000,
    dbName
};
async function default_1() {
    try {
        await mongoose.connect(mongoUri, options);
        console.log(`MongoDB connected as ${mongoUri}`);
    }
    catch (e) {
        console.log('Error connecting to mongoose: ', e);
    }
}
exports.default = default_1;
;
//# sourceMappingURL=db.js.map