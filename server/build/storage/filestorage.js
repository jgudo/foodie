"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multer = exports.deleteImageFromStorage = exports.uploadImageToStorage = void 0;
const storage_1 = require("@google-cloud/storage");
const multer_1 = __importDefault(require("multer"));
const util_1 = require("util");
const config_1 = __importDefault(require("../config/config"));
const storage = new storage_1.Storage(config_1.default.gCloudStorage);
const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET_URL);
const multer = multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // no larger than 2mb
    }
});
exports.multer = multer;
const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${file.originalname}`;
        let fileUpload = bucket.file(newFileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        blobStream.on('error', (err) => {
            console.log(err);
            reject('Something is wrong! Unable to upload at the moment.');
        });
        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = util_1.format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            resolve(url);
        });
        blobStream.end(file.buffer);
    });
};
exports.uploadImageToStorage = uploadImageToStorage;
const deleteImageFromStorage = (...images) => {
    return new Promise(async (resolve, reject) => {
        if (images.length === 0) {
            return reject('Images to delete not provided.');
        }
        try {
            images.map(async (image) => {
                const spl = image.split('/');
                const filename = spl[spl.length - 1];
                await bucket.file(filename).delete();
            });
            resolve('Successfully deleted.');
        }
        catch (e) {
            console.log(e);
            reject('Cannot delete images.');
        }
    });
};
exports.deleteImageFromStorage = deleteImageFromStorage;
//# sourceMappingURL=filestorage.js.map