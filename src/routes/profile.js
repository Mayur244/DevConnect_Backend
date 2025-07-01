const express = require("express");
const { userAuth } = require("../middleware/Auth");
const { validateEditProfileData } = require("../utils/validation");


const profileRouter = express.Router()


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    res.send(loggedInUser);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

profileRouter.patch("/profile/edit",userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit fields");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save()
    res.json({
      message : `${loggedInUser.firstName} your profile is updated successfully!`,
      data : loggedInUser
    })

  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
})

module.exports = {profileRouter}