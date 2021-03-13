import { NextFunction, Request, Response } from "express";

class ErrorHandler extends Error {
    statusCode: number | undefined;
    message: string | undefined;
    constructor(statusCode?: number, message?: string) {
        super()
        this.statusCode = statusCode;
        this.message = message;
    }
}

interface IErrorResponseJSON {
    statusCode: number;
    title?: string;
    type?: string;
    message?: string;
    errors?: any[];
}

const errorResponseJSON = ({ statusCode, title, type, message, errors = null }: IErrorResponseJSON) => ({
    status_code: statusCode,
    success: false,
    data: null,
    error: { type, title, message, errors },
    timestamp: new Date().getTime()
})

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500, message = 'Internal Server Error' } = err;

    if (err.name === 'MongoError' && err.code === 11000) { // Mongo error
        const field = Object.keys(err.keyValue);

        return res.status(409).json(errorResponseJSON({
            statusCode: 409,
            title: 'Conflict',
            type: 'CONFLICT_ERROR',
            message: `An account with that ${field} already exists.`
        }));
    }

    if (err.name === 'ValidationError') { // For mongoose validation error handler
        const errors = Object.values(err.errors).map((el: any) => ({ message: el.message, path: el.path }));

        return res.status(400).json(errorResponseJSON({
            statusCode: 400,
            title: 'Invalid Input',
            type: 'INVALID_INPUT_ERROR',
            message: err?.message || 'Invalid input.',
            errors
        }));
    }

    if (err.statusCode === 400) { // BadRequestError
        return res.status(400).json(errorResponseJSON({
            statusCode: 400,
            title: 'Bad Request.',
            type: 'BAD_REQUEST_ERROR',
            message: err?.message || 'Bad request.'
        }));
    }

    if (err.statusCode === 401) { // UnathorizeError
        return res.status(401).json(errorResponseJSON({
            statusCode: 401,
            title: 'Unauthorize Error',
            type: 'UNAUTHORIZE_ERROR',
            message: err?.message || "You're not authorized to perform your request."
        }));
    }

    if (err.statusCode === 403) { // Forbidden
        return res.status(403).json(errorResponseJSON({
            statusCode: 403,
            title: 'Forbidden Error',
            type: 'FORBIDDEN_ERROR',
            message: err?.message || 'Forbidden request.'
        }));
    }

    if (err.statusCode === 404) { // NotFoundError
        return res.status(404).json(errorResponseJSON({
            statusCode: 404,
            title: 'Resource Not Found',
            type: 'NOT_FOUND_ERROR',
            message: err?.message || 'Requested resource not found.'
        }));
    }

    if (err.statusCode === 422) { // UnprocessableEntity
        // return res.status(422).json(errorResponseJSON(422, err?.message || 'Unable to process your request.'));
        return res.status(422).json(errorResponseJSON({
            statusCode: 422,
            title: 'Unprocessable Entity',
            type: 'UNPROCESSABLE_ENTITY_ERROR',
            message: err?.message || 'Unable to process your request.'
        }));
    }

    console.log('FROM MIDDLEWARE ------------------------', err)
    res.status(statusCode).json(errorResponseJSON({
        statusCode,
        title: 'Server Error',
        type: 'SERVER_ERROR',
        message
    }));
}

export { errorMiddleware as default, ErrorHandler };

