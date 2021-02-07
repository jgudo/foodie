import { isValidObjectId } from 'mongoose';
import { makeErrorJson } from '../helpers/utils';

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

export { isAuthenticated, validateObjectID };

