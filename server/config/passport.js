const LocalStrategy = require('passport-local').Strategy;
const User = require('../schemas/UserSchema');

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (err) {
                return done(err);
            }

            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-register', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, (req, email, password, done) => {
        User.findOne({ email })
            .then((user) => {
                if (user) {
                    return done(null, false, { error: 'Email already has been already used by other user.' });
                } else {
                    const newUser = new User({ email, password, username: req.body.username });

                    newUser.save(function (err) {
                        if (err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
            })
            .catch((e) => {
                return done(err);
            })
    })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (user) {
                    user.passwordMatch(password, function (err, match) {
                        if (err) {
                            return done();
                        }
                        if (match) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                error: 'Incorrect credentials.'
                            });
                        }
                    });
                } else {
                    return done(null, false, { error: 'Incorrect credentials.' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );
};
