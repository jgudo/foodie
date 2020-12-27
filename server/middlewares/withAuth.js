const jwt = require('jsonwebtoken');

const withAuth = function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res
            .status(401)
            .send('Unauthorized');
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res
                    .status(401)
                    .send('Unauthorized');
            } else {
                req.email = decoded.email;
                next();
            }
        });
    }
};

const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log('CHECK MIDDLEWARE: IS AUTH: ', req.isAuthenticated());
        return next();
    }

    console.log('UNAUTHORIZED')
    return res.sendStatus(401);
}

module.exports = { isAuthenticated };
