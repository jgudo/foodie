"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../helpers/utils");
const { DUPLICATE_FIELDS, VALIDATION_ERROR } = require('../constants/error-types');
function handleDuplicateKeyError(err, res) {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `An account with that ${field} already exists.`;
    res.status(code).send(utils_1.makeErrorJson({ type: DUPLICATE_FIELDS, message: error }));
}
//handle field formatting, empty fields, and mismatched passwords
function handleValidationError(err, res) {
    const errors = Object.values(err.errors).map((el) => el.message);
    const fields = Object.values(err.errors).map((el) => el.path);
    const code = 400;
    const formattedErrors = errors.join('');
    if (errors.length > 1) {
        res.status(code).send(utils_1.makeErrorJson({ type: VALIDATION_ERROR, message: formattedErrors }));
    }
    else {
        res.status(code).send(utils_1.makeErrorJson({ type: VALIDATION_ERROR, message: formattedErrors }));
    }
}
function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    try {
        if (err.name === 'ValidationError')
            return err = handleValidationError(err, res);
        if (err.code && err.code == 11000)
            return err = handleDuplicateKeyError(err, res);
    }
    catch (err) {
        res.status(500).send('An unknown error occurred.');
    }
}
exports.default = errorHandler;
//# sourceMappingURL=error.middleware.js.map