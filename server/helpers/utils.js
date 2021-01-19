const {
    INVALID_INPUT,
    INCORRECT_CREDENTIALS,
    EMAIL_TAKEN,
    DUPLICATE_FIELDS,
    VALIDATION_ERROR
} = require("../constants/error-types");

const initStatus = {
    status_code: 404,
    success: false,
    data: null,
    error: null,
    timestamp: null
};

module.exports = {
    /**
     * 
     * @param {{_id: string, username: string, [prop: string]: any}} user 
     */
    sessionizeUser: (user) => ({
        id: user._id,
        username: user.username,
        fullname: user.fullname,
        profilePicture: user.profilePicture
    }),
    /**
     * 
     * @param {object} data 
     */
    makeResponseJson: (data, success = true) => {
        return {
            ...initStatus,
            status_code: 200,
            success,
            data,
            timestamp: new Date()
        };
    },
    /**
     * 
     * @param {{type?: string, status_code: number, message: string}} param0 
     */
    makeErrorJson: ({ type, message, status_code } = {}) => {
        switch (type) {
            case INVALID_INPUT:
                return {
                    ...initStatus,
                    status_code: 400,
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
                    status_code: 401,
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
                    status_code: 400,
                    error: {
                        type: EMAIL_TAKEN,
                        title: 'Email Taken',
                        message
                    },
                    timestamp: new Date()
                }
            case DUPLICATE_FIELDS:
                return {
                    ...initStatus,
                    status_code: 409,
                    error: {
                        type: DUPLICATE_FIELDS,
                        title: 'Duplicate Fields',
                        message
                    },
                    timestamp: new Date()
                }
            case VALIDATION_ERROR:
                return {
                    ...initStatus,
                    status_code: 400,
                    error: {
                        type: VALIDATION_ERROR,
                        title: 'Validation Error',
                        message
                    },
                    timestamp: new Date()
                }
            default:
                return {
                    ...initStatus,
                    status_code: status_code || initStatus.status_code,
                    error: {
                        type: 'REQUEST_ERROR',
                        title: 'Request Error',
                        message: typeof message !== undefined ? message : 'Unable to process your request.'
                    },
                    timestamp: new Date()
                }
        }
    },

}
