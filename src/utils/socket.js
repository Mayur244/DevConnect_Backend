const socket = require("socket.io");
const crypto = require("crypto")


const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("$")).digest("hex");
}

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({firstName, userId, targetUserId}) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        socket.join(roomId)

        // console.log(firstName + " join " + roomId);
    })

    socket.on("sendMessage", ({firstName, userId, targetUserId, textMessage}) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        io.to(roomId).emit("messageReceived", {firstName, textMessage})
    })
  })
}; 

module.exports = {initializeSocket};
