const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
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
                return done(e);
            })
    })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, username, password, done) => {
            try {
                const user = await User.findOne({ username });

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

    passport.use(
        'facebook-auth',
        new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: `/api/v1/auth/facebook/callback`,
            profileFields: ['id', 'profileUrl', 'email', 'displayName', 'name', 'gender', 'picture']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const fbProfile = profile._json;
                const user = await User.findOne({ provider_id: fbProfile.id });

                if (user) {
                    return done(null, user);
                } else {
                    const randomString = Math.random().toString(36).substring(2);

                    const newUser = new User({
                        username: fbProfile.email.split('@')[0],
                        email: fbProfile.email,
                        password: randomString,
                        firstname: fbProfile.first_name,
                        lastname: fbProfile.last_name,
                        profilePicture: fbProfile.picture ? fbProfile.picture.data.url : '',
                        provider_id: fbProfile.id,
                        provider: 'facebook',
                        provider_access_token: accessToken,
                        provider_refresh_token: refreshToken
                    });

                    newUser.save(function (err) {
                        if (err) {
                            done(null, false, err);  // handle errors!
                        } else {
                            console.log('SUCCESSFULL CREATED', newUser);
                            done(null, newUser);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
                return done(err);
            }
        }
        )
    );

    passport.use(
        'github-auth',
        new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `/api/v1/auth/github/callback`,
            scope: 'user:email'
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const githubProfile = profile._json;
                const user = await User.findOne({ provider_id: githubProfile.id });

                console.log(githubProfile)
                console.log(githubProfile.login)
                if (user) {
                    return done(null, user);
                } else {
                    const randomString = Math.random().toString(36).substring(2);

                    const newUser = new User({
                        username: githubProfile.login,
                        email: githubProfile.email,
                        password: randomString,
                        firstname: githubProfile.name.split(' ')[0],
                        lastname: githubProfile.name.split(' ')[1],
                        profilePicture: githubProfile.avatar_url,
                        provider_id: githubProfile.id,
                        provider: 'github',
                        'info.bio': githubProfile.bio,
                        provider_access_token: accessToken,
                        provider_refresh_token: refreshToken
                    });

                    newUser.save(function (err) {
                        if (err) {
                            console.log(err)
                            done(null, false, err);  // handle errors!
                        } else {
                            console.log('SUCCESSFULL CREATED', newUser);
                            done(null, newUser);
                        }
                    });
                }
            } catch (err) {
                console.log(err);
                return done(err);
            }
        }
        )
    );
};
