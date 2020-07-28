import Joi from '@hapi/joi';

export const joiSchema = Joi.object({
    id: Joi
        .string()
        .required(),
    login: Joi
        .string()
        .alphanum()
        .min(3)
        .max(15)
        .required(),
    password: Joi
        .string()
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'))
        .required(),
    age: Joi
        .number()
        .integer()
        .min(4)
        .max(130)
        .required(),
    isDeleted: Joi
        .boolean()
        .required()
});

const errorResponce = (schemaErrors) => {
    const errors = schemaErrors.map(error => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: 'failed',
        errors
    };
};

export const validateSchemaMiddleware = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (!error) {
            next();
            return;
        }
        res.status(400).json(errorResponce(error.details));
    };
};
