const Joi = require('joi');

const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required();
const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required();
const username = Joi.string();

module.exports = {
    schemas: {
        loginSchema: Joi.object().keys({
            email,
            password
        }).options({ abortEarly: false }),
        registerSchema: Joi.object().keys({
            email,
            password,
            username
        }).options({ abortEarly: false }),
    },
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);

            if (result.error) {
                return res.status(400).json({
                    message: result.error.details
                })
            } else {
                if (!req.value) {
                    req.value = {}
                }
                req.value['body'] = result.value;
                next();
            }
        }
    }
};
