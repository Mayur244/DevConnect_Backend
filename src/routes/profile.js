const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    res.send(loggedInUser);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit fields");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile is updated successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    const allowedFields = ["password"];
    const isOnlyPasswordProvided = Object.keys(req.body).every(field =>
      allowedFields.includes(field)
    );

    if (!isOnlyPasswordProvided) {
      throw new Error("Only 'password' field is allowed");
    }

    if (!validator.isStrongPassword(password)) {
      throw new Error("Enter strong password");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const loggedInUser = req.user;
    loggedInUser.password = hashPassword;

    await loggedInUser.save();

    res.send("Password updated successfully");
    
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});


module.exports = { profileRouter };
