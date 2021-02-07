const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const config = require('../config/config');

export default class CloudStorage {
    public bucket;

    public initialize() {
        const storage = new Storage(config.gCloudStorage);

        this.bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET_URL);
    }
}

export const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // no larger than 2mb
    }
});