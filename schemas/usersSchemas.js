import Joi from "joi";

export const registerUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
})

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
})