import config from '@/config/config';
import { Storage } from '@google-cloud/storage';
import { format } from 'util';

const storage = new Storage(config.gCloudStorage);

const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET_URL);

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
            const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}

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
        } catch (e) {
            console.log(e);
            reject('Cannot delete images.');
        }
    });
}

export { uploadImageToStorage, deleteImageFromStorage };

