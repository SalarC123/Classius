const Joi = require("joi")

const registerSchema = Joi.object({
    username: Joi.string().min(4).max(30).alphanum().required(),
    password: Joi.string().required().min(8).max(30),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').options({ messages: { 'any.only': '{{#label}} does not match'} })
})

const registrationValidation = (data => {
    return registerSchema.validate(data);
})

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const loginValidation = (data => {
    return loginSchema.validate(data);
})

const groupSchema = Joi.object({
    groupName: Joi.string().required().min(3).max(100),
    courses: Joi.array().items(Joi.string().uri()).unique()
})

const groupValidation = data => {
    return groupSchema.validate(data)
}




module.exports = {
    registrationValidation: registrationValidation,
    loginValidation: loginValidation,
    groupValidation: groupValidation
}