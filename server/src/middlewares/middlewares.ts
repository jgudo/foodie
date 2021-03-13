import { NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { ErrorHandler } from './error.middleware';

function isAuthenticated(req: any, res: any, next: NextFunction) {
    if (req.isAuthenticated()) {
        console.log('CHECK MIDDLEWARE: IS AUTH: ', req.isAuthenticated());
        return next();
    }

    return next(new ErrorHandler(401));
}

function validateObjectID(...ObjectIDs) {
    return function (req: any, res: any, next: NextFunction) {
        ObjectIDs.forEach((id) => {
            if (!isValidObjectId(req.params[id])) {
                return next(new ErrorHandler(400, `ObjectID ${id} supplied is not valid`));
            } else {
                next();
            }
        });
    }
}

export { isAuthenticated, validateObjectID };

