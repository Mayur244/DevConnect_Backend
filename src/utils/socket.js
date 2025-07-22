const socket = require("socket.io");
const crypto = require("crypto");
const Message = require("../models/message");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, textMessage }) => {
        const roomId = getSecretRoomId(userId, targetUserId);

        const newMsg = new Message({
            roomId : roomId,
            from: userId,
            to: targetUserId,
            firstName : firstName,
            message : textMessage,
        });
        await newMsg.save();
        
        io.to(roomId).emit("messageReceived", newMsg );
      }
    );
  });
};

module.exports = { initializeSocket };
