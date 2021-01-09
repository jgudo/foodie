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
    let errors = Object.values(err.errors).map(el => el.message);
    let fields = Object.values(err.errors).map(el => el.path);
    let code = 400;
    if (errors.length > 1) {
        const formattedErrors = errors.join('')
        res.status(code).send(makeErrorJson({ type: VALIDATION_ERROR, messages: formattedErrors }));
    } else {
        res.status(code).send(makeErrorJson({ type: VALIDATION_ERROR, messages: formattedErrors }));
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
                return res.sendStatus(400);
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
