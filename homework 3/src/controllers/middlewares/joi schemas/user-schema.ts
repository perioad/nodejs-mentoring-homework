import Joi from "@hapi/joi";

export const joiSchemaUser = Joi.object({
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