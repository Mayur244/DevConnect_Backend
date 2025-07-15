const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");

const authRouter = express.Router();

const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "about",
  "gender",
  "skills",
];

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypt the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Createing a new instance of a user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.json({ message: "User added successfully", data: savedUser });
  } catch (error) {
    // Handle unique email errors
    if (error.code === 11000 && error.keyPattern?.emailId) {
      return res.status(400).json({ message: "Email already exists" });
    }

    return res
      .status(400)
      .json({ message: error.message || "Something went wrong" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //validate the email id and password
    if (!validator.isEmail(emailId)) {
      throw new Error("Enter valid Email id");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password must be at least 8 characters long, start with an uppercase letter, and include a lowercase letter, number, and special character");
    }

    // check user present or not
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    //validate the password
    const isPasswordValid = await user.validatePassword(password);

    // generate and send cookie/token from server to the browser
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successfully");
});

module.exports = { authRouter };
