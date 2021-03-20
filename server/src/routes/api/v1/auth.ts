//@ts-ignore
import { makeResponseJson, sessionizeUser } from '@/helpers/utils';
import { ErrorHandler } from '@/middlewares/error.middleware';
import { IUser } from '@/schemas/UserSchema';
import { schemas, validateBody } from '@/validations/validations';
import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';

const router = Router({ mergeParams: true });

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
                next(new ErrorHandler(409, info.message));
            }
        })(req, res, next);
    }
);

//@route POST /api/v1/authenticate
router.post(
    '/v1/authenticate',
    validateBody(schemas.loginSchema),
    (req: Request, res: Response, next: NextFunction) => {
        console.log('FIREED')
        passport.authenticate('local-login', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(new ErrorHandler(400, info.message))
            } else {
                req.logIn(user, function (err) { // <-- Log user in
                    if (err) {
                        return next(err);
                    }

                    const userData = sessionizeUser(user);
                    return res.status(200).send(makeResponseJson({ auth: userData, user: (req.user as IUser).toUserJSON() }));
                });
            }
        })(req, res, next);
    }
);

//@route GET /api/v1/auth/facebook FACEBOOK AUTH
router.get(
    '/v1/auth/facebook',
    passport.authenticate('facebook-auth', { scope: ['email', 'public_profile'] })
);

//@route GET /api/v1/auth/facebook/callback FACEBOOK AUTH CALLBACK
router.get(
    '/v1/auth/facebook/callback',
    passport.authenticate('facebook-auth', {
        failureRedirect: `${process.env.CLIENT_URL}/auth/facebook/failed`,
        successRedirect: `${process.env.CLIENT_URL}`
    })
);

//@route GET /api/v1/auth/github GITHUB AUTH
router.get(
    '/v1/auth/github',
    passport.authenticate('github-auth')
);

//@route GET /api/v1/auth/github/callback GITHUB AUTH
router.get(
    '/v1/auth/github/callback',
    passport.authenticate('github-auth', {
        failureRedirect: `${process.env.CLIENT_URL}/auth/github/failed`,
        successRedirect: `${process.env.CLIENT_URL}`
    })
);

//@route GET /api/v1/auth/github GITHUB AUTH
router.get(
    '/v1/auth/google',
    passport.authenticate('google-auth', { scope: ['email', 'profile'] })
);

//@route GET /api/v1/auth/github/callback GITHUB AUTH
router.get(
    '/v1/auth/google/callback',
    passport.authenticate('google-auth', {
        failureRedirect: `${process.env.CLIENT_URL}/auth/google/failed`,
        successRedirect: `${process.env.CLIENT_URL}`
    })
);

//@route DELETE /api/v1/logout
router.delete('/v1/logout', (req, res, next) => {
    try {
        req.logOut();

        res.sendStatus(200);
    } catch (e) {
        next(new ErrorHandler(422, 'Unable to logout. Please try again.'))
    }
});

//@route GET /api/v1/checkSession
// Check if user session exists
router.get('/v1/check-session', (req, res, next) => {
    if (req.isAuthenticated()) {
        const user = sessionizeUser(req.user);
        res.status(200).send(makeResponseJson({ auth: user, user: (req.user as IUser).toUserJSON() }));
    } else {
        next(new ErrorHandler(404, 'Session invalid/expired.'));
    }
});


export default router;
