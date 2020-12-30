const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');

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

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('CHECK MIDDLEWARE: IS AUTH: ', req.isAuthenticated());
        return next();
    }

    console.log('UNAUTHORIZED')
    return res.sendStatus(401);
}

function validateObjectID(...ObjectIDs) {
    return function (req, res, next) {
        ObjectIDs.forEach((id) => {
            if (!isValidObjectId(req.params[id])) {
                return res.sendStatus(400);
            } else {
                next();
            }
        });
    }
}

module.exports = { isAuthenticated, validateObjectID };
