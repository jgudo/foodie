"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const error_types_1 = require("../../../constants/error-types");
const utils_1 = require("../../../helpers/utils");
const validations_1 = require("../../../validations/validations");
const router = express_1.default.Router({ mergeParams: true });
//@route POST /api/v1/register
router.post('/v1/register', validations_1.validateBody(validations_1.schemas.registerSchema), (req, res, next) => {
    passport_1.default.authenticate('local-register', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) { // if user has been successfully created
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                const userData = utils_1.sessionizeUser(user);
                return res.status(200).send(utils_1.makeResponseJson(userData));
            });
        }
        else {
            return res
                .status(401)
                .send(utils_1.makeErrorJson({ type: error_types_1.EMAIL_TAKEN, message: info.message }));
        }
    })(req, res, next);
});
//@route POST /api/v1/authenticate
router.post('/v1/authenticate', validations_1.validateBody(validations_1.schemas.loginSchema), (req, res, next) => {
    console.log('FIREED');
    passport_1.default.authenticate('local-login', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res
                .status(401)
                .send(utils_1.makeErrorJson({ type: error_types_1.INCORRECT_CREDENTIALS, message: info.message }));
        }
        else {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                const userData = utils_1.sessionizeUser(user);
                return res.status(200).send(utils_1.makeResponseJson({ auth: userData, user: req.user.toUserJSON() }));
            });
        }
    })(req, res, next);
});
//@route GET /api/v1/auth/facebook FACEBOOK AUTH
router.get('/v1/auth/facebook', passport_1.default.authenticate('facebook-auth', { scope: ['email', 'public_profile'] }));
//@route GET /api/v1/auth/facebook/callback FACEBOOK AUTH CALLBACK
router.get('/v1/auth/facebook/callback', passport_1.default.authenticate('facebook-auth', {
    failureRedirect: `${process.env.CLIENT_URL}/auth/facebook/failed`,
    successRedirect: `${process.env.CLIENT_URL}`
}));
//@route GET /api/v1/auth/github GITHUB AUTH
router.get('/v1/auth/github', passport_1.default.authenticate('github-auth'));
//@route GET /api/v1/auth/github/callback GITHUB AUTH
router.get('/v1/auth/github/callback', passport_1.default.authenticate('github-auth', {
    failureRedirect: `${process.env.CLIENT_URL}/auth/github/failed`,
    successRedirect: `${process.env.CLIENT_URL}`
}));
//@route DELETE /api/v1/logout
router.delete('/v1/logout', (req, res) => {
    try {
        req.logOut();
        res.sendStatus(200);
    }
    catch (e) {
        res.status(422).send(utils_1.makeErrorJson({ status_code: 422, message: 'Unable to logout. Please try again.' }));
    }
});
//@route GET /api/v1/checkSession
// Check if user session exists
router.get('/v1/check-session', (req, res) => {
    if (req.isAuthenticated()) {
        const user = utils_1.sessionizeUser(req.user);
        res.status(200).send(utils_1.makeResponseJson({ auth: user, user: req.user.toUserJSON() }));
    }
    else {
        res.status(404).send(utils_1.makeErrorJson({ message: 'Session invalid/expired.' }));
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map