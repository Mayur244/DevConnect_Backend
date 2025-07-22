const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: {   
    type: String,
    required: true 
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  to: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  message : {
    type : String,
    required : true
  },
  firstName : {
    type : String,
    required : true
  },
  createdAt : {
    type : Date,
    default : Date.now()
  }
});

module.exports = mongoose.model("Message", messageSchema);

// models/Message.js
// const mongoose = require("mongoose");
// const MessageSchema = new mongoose.Schema({
//   from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   message: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });
// module.exports = mongoose.model("Message", MessageSchema);
