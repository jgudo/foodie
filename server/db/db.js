const mongoose = require('mongoose');
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'foodie';

if (process.env.NODE_ENV === 'dev') {
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

(async function () {
    try {
        await mongoose.connect(mongoUri, options);
        console.log(`MongoDB connected as ${mongoUri}`);
    } catch (e) {
        console.log('Error connecting to mongoose: ', e);
    }
})();
