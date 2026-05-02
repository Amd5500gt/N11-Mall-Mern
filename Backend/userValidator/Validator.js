const { body } = require("express-validator");

// 🔐 Register Validation
const newUserValidation = [

  body('name')
    .notEmpty().withMessage("Name is required")
    .trim()
    .toLowerCase(),

  body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email!"),

  body('number')
    .notEmpty().withMessage("Number is required")
    .isLength({ min: 10, max: 10 }).withMessage("Number must be 10 digits")
    .isNumeric().withMessage("Use numbers only"),

  body('password')
    .notEmpty().withMessage("Password is required")
    .isStrongPassword().withMessage("Password must be strong (Ex: @User123)")

];

// 🔓 Login Validation
const loginUserValidation = [

  body('email')
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email!"),

  body('password')
    .notEmpty().withMessage("Password is required")

];

module.exports = { newUserValidation, loginUserValidation };