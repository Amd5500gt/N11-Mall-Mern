const Joi = require("joi");

const RegisterUserValidation = (req, res, next) => {

  const schema = Joi.object({

    name: Joi.string()
      .min(4)
      .max(50)
      .required(),

    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
      .min(6)
      .max(50)
      .required()

  });

  const { error } = schema.validate(req.body);

  if (error) {

    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });

  }

  next();

};

const LoginUserValidation = (req, res, next) => {

  const schema = Joi.object({

    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
      .min(6)
      .max(50)
      .required()

  });

  const { error } = schema.validate(req.body);

  if (error) {

    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });

  }

  next();

};

module.exports = {
  RegisterUserValidation,
  LoginUserValidation
};