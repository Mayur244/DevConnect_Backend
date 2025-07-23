const { userAuth } = require("../middleware/auth"); 
const express = require("express");
const chatRouter = express.Router();
const Message = require("../models/message");

// Use userAuth here:
chatRouter.get("/chat/:roomId/messages", userAuth, async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  const messages = await Message.find({ roomId }).sort("createdAt");

   if (messages.length > 0) {
    const { from, to } = messages[0];

    if (![from.toString(), to.toString()].includes(userId.toString())) {
      return res.status(403).json({ error: "Not authorized" });
    }

    return res.json(messages);

  } else {
    return res.json([]); 
  }
});

module.exports = {chatRouter}