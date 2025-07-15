const validator = require("validator");

const validateSignUpData = (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error(
      "All fields are required"
    );
  }

  if (!firstName) {
    throw new Error("First Name is required");
  } else if (!lastName) {
    throw new Error("Last Name is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long, start with an uppercase letter, and include a lowercase letter, number, and special character"
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "photoUrl",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
