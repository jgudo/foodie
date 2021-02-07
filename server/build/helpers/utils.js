"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeErrorJson = exports.makeResponseJson = exports.sessionizeUser = void 0;
const { INVALID_INPUT, INCORRECT_CREDENTIALS, EMAIL_TAKEN, DUPLICATE_FIELDS, VALIDATION_ERROR } = require("../constants/error-types");
const initStatus = {
    status_code: 404,
    success: false,
    data: null,
    error: null,
    timestamp: null
};
const initErrorParam = {
    type: 'REQUEST_ERROR',
    message: 'Unable to process your request.',
    status_code: 404
};
const sessionizeUser = (user) => ({
    id: user._id,
    username: user.username,
    fullname: user.fullname,
    profilePicture: user.profilePicture
});
exports.sessionizeUser = sessionizeUser;
const makeResponseJson = (data, success = true) => {
    return Object.assign(Object.assign({}, initStatus), { status_code: 200, success,
        data, timestamp: new Date() });
};
exports.makeResponseJson = makeResponseJson;
const makeErrorJson = ({ type, message, status_code } = initErrorParam) => {
    switch (type) {
        case INVALID_INPUT:
            return Object.assign(Object.assign({}, initStatus), { status_code: 400, error: {
                    type: INVALID_INPUT,
                    title: 'Invalid Input Provided',
                    message
                }, timestamp: new Date() });
        case INCORRECT_CREDENTIALS:
            return Object.assign(Object.assign({}, initStatus), { status_code: 401, error: {
                    type: INCORRECT_CREDENTIALS,
                    title: 'Incorrect Credentials',
                    message
                }, timestamp: new Date() });
        case EMAIL_TAKEN:
            return Object.assign(Object.assign({}, initStatus), { status_code: 400, error: {
                    type: EMAIL_TAKEN,
                    title: 'Email Taken',
                    message
                }, timestamp: new Date() });
        case DUPLICATE_FIELDS:
            return Object.assign(Object.assign({}, initStatus), { status_code: 409, error: {
                    type: DUPLICATE_FIELDS,
                    title: 'Duplicate Fields',
                    message
                }, timestamp: new Date() });
        case VALIDATION_ERROR:
            return Object.assign(Object.assign({}, initStatus), { status_code: 400, error: {
                    type: VALIDATION_ERROR,
                    title: 'Validation Error',
                    message
                }, timestamp: new Date() });
        default:
            return Object.assign(Object.assign({}, initStatus), { status_code: status_code, error: {
                    type: 'REQUEST_ERROR',
                    title: 'Request Error',
                    message: message
                }, timestamp: new Date() });
    }
};
exports.makeErrorJson = makeErrorJson;
//# sourceMappingURL=utils.js.map