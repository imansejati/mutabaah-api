const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username harus minimal 3 karakter")
    .isAlphanumeric()
    .withMessage("Username hanya boleh mengandung huruf dan angka"),
  body("email").isEmail().withMessage("Email harus valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password harus minimal 6 karakter"),
  handleValidationErrors,
];

const loginValidation = [
  body("username").notEmpty().withMessage("Username diperlukan"),
  body("password").notEmpty().withMessage("Password diperlukan"),
  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
};
