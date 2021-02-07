"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multer = void 0;
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const config = require('../config/config');
class CloudStorage {
    initialize() {
        const storage = new Storage(config.gCloudStorage);
        this.bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET_URL);
    }
}
exports.default = CloudStorage;
exports.multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // no larger than 2mb
    }
});
//# sourceMappingURL=storage.utils.js.map