"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateObjectID = exports.isAuthenticated = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../helpers/utils");
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('CHECK MIDDLEWARE: IS AUTH: ', req.isAuthenticated());
        return next();
    }
    console.log('UNAUTHORIZED');
    return res.sendStatus(401);
}
exports.isAuthenticated = isAuthenticated;
function validateObjectID(...ObjectIDs) {
    return function (req, res, next) {
        ObjectIDs.forEach((id) => {
            if (!mongoose_1.isValidObjectId(req.params[id])) {
                return res.status(400).send(utils_1.makeErrorJson({ status_code: 400, message: 'Something went wrong :(' }));
            }
            else {
                next();
            }
        });
    };
}
exports.validateObjectID = validateObjectID;
//# sourceMappingURL=middlewares.js.map