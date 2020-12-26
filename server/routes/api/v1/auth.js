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
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    console.log('REGISTRATION SUCCESS, IS AUTH: ', req.isAuthenticated())
                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson(userData));
                });
            } else {
                return res
                    .status(401)
                    .send(makeErrorJson({ type: EMAIL_TAKEN, status_code: 401, message: info.error }));
            }
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
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    console.log('LOGIN SUCCESS, IS AUTH: ', req.isAuthenticated())
                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson(userData));
                });
            }
        })(req, res, next);
    });

//@route DELETE /api/v1/logout
router.delete('/v1/logout', (req, res) => {
    try {
        req.logOut();

        res.sendStatus(200);
    } catch (e) {
        res.status(422).send(makeErrorJson({ status_code: 422, message: 'Unable to logout. Please try again.' }));
    }
});

//@route GET /api/v1/checkSession
// Check if user session exists
router.get('/v1/check-session', (req, res) => {
    console.log('SESSION: ', req.session.passport)
    console.log('USER ', req.user);
    console.log('IS AUTH:', req.isAuthenticated())
    if (req.isAuthenticated()) {
        const user = sessionizeUser(req.user);
        res.status(200).send(makeResponseJson(user));
    } else {
        res.sendStatus(404);
    }
});


module.exports = router;
