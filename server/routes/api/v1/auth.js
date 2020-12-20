const express = require('express');
const Joi = require('joi');
const { schemas, validateBody } = require('../../../validations/validations');
const User = require('../../../schemas/UserSchema');
const withAuth = require('../../../middlewares/withAuth');
const { sessionizeUser } = require('../../../helpers/utils');
const router = express.Router({ mergeParams: true });

//@route POST /api/v1/register
router.post('/v1/register', validateBody(schemas.registerSchema), async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        const user = new User({ email, password, username });
        await user.save();
        const sessionUser = sessionizeUser(user);

        req.session.user = sessionUser;
        // res.sendStatus(200);
        res.status(200).send(sessionUser);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

//@route POST /api/v1/authenticate
router.post('/v1/authenticate', validateBody(schemas.loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) { // if user exist based on given email
            try { // try if password matches
                await user.passwordMatch(password);
                const sessionUser = sessionizeUser(user);
                req.session.user = sessionUser;
                res.send(sessionUser);
            } catch (e) {
                res.status(401).send(e);
            }
        } else { // else if no user found
            res
                .status(401)
                .json({ error: 'Incorrect email or password' });
        }
    } catch (e) {
        console.log(e);
        res
            .status(500)
            .json({ error: 'Internal error, please try again.' });
    }
});

//@route DELETE /api/v1/logout
router.delete('/v1/logout', (req, res) => {
    try {
        const user = req.session.user;

        if (user) {
            req.session.destroy((err) => {
                if (err) throw (err);

                res.clearCookie(process.env.SESSION_NAME);
                res.send(user);
            });
        } else {
            throw new Error('Something went wrong.');
        }
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
