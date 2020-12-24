const express = require('express');
const passport = require('passport');
const { schemas, validateBody } = require('../../../validations/validations');
const { sessionizeUser, makeErrorJson, makeResponseJson } = require('../../../helpers/utils');
const { INVALID_INPUT, INCORRECT_CREDENTIALS, EMAIL_TAKEN } = require('../../../constants/error-types');
const router = express.Router({ mergeParams: true });

//@route POST /api/v1/register
router.post(
    '/v1/register',
    validateBody(schemas.registerSchema),
    (req, res, next) => {
        passport.authenticate('local-register', (err, user, info) => {
            if (err) {
                return next();
            }

            if (user) { // if user has been successfully created
                const userData = sessionizeUser(user);
                res.status(200).send(makeResponseJson(userData));
            } else {
                return res
                    .status(401)
                    .send(makeErrorJson({ type: EMAIL_TAKEN, status_code: 401, message: info.error }));
            }

            next();
        })(req, res, next);
    }
);

//@route POST /api/v1/authenticate
router.post(
    '/v1/authenticate',
    validateBody(schemas.loginSchema),
    (req, res, next) => {
        passport.authenticate('local-login', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res
                    .status(401)
                    .send(makeErrorJson({ type: INCORRECT_CREDENTIALS, status_code: 401, message: info.error }));
            } else {
                const userData = sessionizeUser(user);
                return res.status(200).send(userData);
            }
        })(req, res, next);
    });

//@route DELETE /api/v1/logout
router.delete('/v1/logout', (req, res) => {
    try {
        req.logOut();

        res.sendStatus(200);
    } catch (e) {
        res.status(422).send(e);
    }
});

//@route GET /api/v1/checkSession
// Check if user session exists
router.get('/v1/checkSession', (req, res) => {
    if (req.session.user) {
        res.status(200).send(req.session.user);
    } else {
        res.sendStatus(404);
    }
});


module.exports = router;
