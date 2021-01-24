const { makeErrorJson } = require('../helpers/utils');
const { isValidObjectId } = require('mongoose');
const { DUPLICATE_FIELDS, VALIDATION_ERROR } = require('../constants/error-types');

function handleDuplicateKeyError(err, res) {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `An account with that ${field} already exists.`;
    res.status(code).send(makeErrorJson({ type: DUPLICATE_FIELDS, message: error }));
}
//handle field formatting, empty fields, and mismatched passwords
function handleValidationError(err, res) {
    const errors = Object.values(err.errors).map(el => el.message);
    const fields = Object.values(err.errors).map(el => el.path);
    const code = 400;

    console.log(JSON.stringify(errors, null, 4))
    const formattedErrors = errors.join('')
    if (errors.length > 1) {
        res.status(code).send(makeErrorJson({ type: VALIDATION_ERROR, message: formattedErrors }));
    } else {
        res.status(code).send(makeErrorJson({ type: VALIDATION_ERROR, message: formattedErrors }));
    }
}

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('CHECK MIDDLEWARE: IS AUTH: ', req.isAuthenticated());
        return next();
    }

    console.log('UNAUTHORIZED')
    return res.sendStatus(401);
}

function validateObjectID(...ObjectIDs) {
    return function (req, res, next) {
        ObjectIDs.forEach((id) => {
            if (!isValidObjectId(req.params[id])) {
                return res.status(400).send(makeErrorJson({ status_code: 400, message: 'Something went wrong :(' }));
            } else {
                next();
            }
        });
    }
}

function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    try {
        if (err.name === 'ValidationError') return err = handleValidationError(err, res);
        if (err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
    } catch (err) {
        res.status(500).send('An unknown error occurred.');
    }
}

module.exports = { isAuthenticated, validateObjectID, errorHandler };
