//@ts-ignore
const express = require('express');
const passport = require('passport');
const { schemas, validateBody } = require('../../../validations/validations');
const { sessionizeUser, makeErrorJson, makeResponseJson } = require('../../../helpers/utils');
const { INCORRECT_CREDENTIALS, EMAIL_TAKEN } = require('../../../constants/error-types');
const router = express.Router({ mergeParams: true });

//@route POST /api/v1/register
router.post(
    '/v1/register',
    validateBody(schemas.registerSchema),
    (req, res, next) => {
        passport.authenticate('local-register', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (user) { // if user has been successfully created
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson(userData));
                });
            } else {
                return res
                    .status(401)
                    .send(makeErrorJson({ type: EMAIL_TAKEN, message: info.error }));
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
                    .send(makeErrorJson({ type: INCORRECT_CREDENTIALS, message: info.error }));
            } else {
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson({ auth: userData, user: req.user.toUserJSON() }));
                });
            }
        })(req, res, next);
    });

router.get(
    '/v1/auth/facebook',
    (req, res, next) => {
        passport.authenticate('facebook-auth', { scope: ['email', 'public_profile'] }, (err, info, user) => {
            if (err) {
                res.redirect(`${process.env.CLIENT_URL}/login`);
                return next(err);
            }

            if (user) {
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson({ auth: userData, user: req.user.toUserJSON() }));
                });
            }
        })(req, res, next)
    }
);

router.get(
    '/v1/auth/facebook/callback',
    passport.authenticate('facebook-auth', {
        failureRedirect: '/login',
        successRedirect: `${process.env.CLIENT_URL}`,
    })
);

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
    if (req.isAuthenticated()) {
        const user = sessionizeUser(req.user);
        res.status(200).send(makeResponseJson({ auth: user, user: req.user.toUserJSON() }));
    } else {
        res.status(404).send(makeErrorJson({ message: 'Session invalid/expired.' }));
    }
});


module.exports = router;
