const Joi = require('joi');
const { INVALID_INPUT } = require('../constants/error-types');
const { makeErrorJson } = require('../helpers/utils');


const email = Joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
        'string.base': `Email should be a type of 'text'`,
        'string.empty': `Email cannot be an empty field`,
        'string.min': `Email should have a minimum length of {#limit}`,
        'any.required': `Email is a required field.`
    });

const password = Joi
    .string()
    .min(8)
    .max(50)
    .required()
    .messages({
        'string.base': `Password should be a type of 'text'`,
        'string.empty': `Password cannot be an empty field`,
        'string.min': `Password should have a minimum length of {#limit}`,
        'any.required': `Password is a required field`
    });
const username = Joi
    .string()
    .required()
    .messages({
        'string.base': 'Username should be of type "text"',
        'string.empty': `Username cannot be an empty field`,
        'string.min': `Username should have a minimum length of {#limit}`,
        'any.required': 'Username field is required'
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
        createPostSchema: Joi.object().keys({
            description: Joi.string(),
            photos: Joi.array(),
            privacy: Joi.string()
        }),
        commentSchema: Joi.object().keys({
            body: Joi
                .string()
                .required()
                .messages({
                    'string.base': 'Comment body should be of type "string"',
                    'string.empty': `Comment body cannot be an empty field`,
                    'any.required': 'Comment body field is required'
                })
        }),
        editProfileSchema: Joi.object().keys({
            firstname: Joi.string(),
            lastname: Joi.string(),
            bio: Joi.string(),
            gender: Joi.string(),
            birthday: Joi.date()
        })
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
