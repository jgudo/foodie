const { INVALID_INPUT, INCORRECT_CREDENTIALS, EMAIL_TAKEN } = require("../constants/error-types");

const initStatus = {
    status_code: 404,
    success: false,
    data: null,
    error: null,
    timestamp: null
};

module.exports = {
    sessionizeUser: (user) => ({
        id: user._id,
        username: user.username
    }),
    makeResponseJson: (data) => {
        return {
            ...initStatus,
            status_code: 200,
            success: true,
            data,
            timestamp: new Date()
        };
    },
    makeErrorJson: ({ type, status_code, message }) => {
        switch (type) {
            case INVALID_INPUT:
                return {
                    ...initStatus,
                    status_code,
                    error: {
                        type: INVALID_INPUT,
                        title: 'Invalid Input Provided',
                        message
                    },
                    timestamp: new Date()
                }
            case INCORRECT_CREDENTIALS:
                return {
                    ...initStatus,
                    status_code,
                    error: {
                        type: INCORRECT_CREDENTIALS,
                        title: 'Incorrect Credentials',
                        message
                    },
                    timestamp: new Date()
                }
            case EMAIL_TAKEN:
                return {
                    ...initStatus,
                    status_code,
                    error: {
                        type: EMAIL_TAKEN,
                        title: 'Email Taken',
                        message
                    },
                    timestamp: new Date()
                }
            default:
                return {
                    ...initStatus,
                    error: {
                        type: 'REQUEST_ERROR',
                        title: 'Request Error',
                        message: 'Unable to process your request.'
                    },
                    timestamp: new Date()
                }
        }
    }
}
