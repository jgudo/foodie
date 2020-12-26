const Joi = require('joi');
const { INVALID_INPUT } = require('../constants/error-types');
const { makeErrorJson } = require('../helpers/utils');

const email = Joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
        'string.base': `"email" should be a type of 'text'`,
        'string.empty': `"email" cannot be an empty field`,
        'string.min': `"email" should have a minimum length of {#limit}`,
        'any.required': `"email" is a required field`
    });
const password = Joi
    .string()
    .min(8)
    .max(50)
    .required()
    .messages({
        'string.base': `"password" should be a type of 'text'`,
        'string.empty': `"password" cannot be an empty field`,
        'string.min': `"password" should have a minimum length of {#limit}`,
        'any.required': `"password" is a required field`
    });
const username = Joi
    .string()
    .required()
    .messages({
        'string.base': '"username" should be of type "text"',
        'string.empty': `"username" cannot be an empty field`,
        'string.min': `"username" should have a minimum length of {#limit}`,
        'any.required': '"username" field is required'
    });

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
                console.log(result.error);
                return res.status(400).send(
                    makeErrorJson({
                        type: INVALID_INPUT,
                        status_code: 400,
                        message: result.error.details[0].message
                    })
                )
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
