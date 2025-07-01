const express = require("express")
const { userAuth } = require("../middleware/Auth")

const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;

    //sending a connection request
    res.send(user.firstName + " sent the connection request!")
})

module.exports = {requestRouter}