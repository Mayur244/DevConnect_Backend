const mongoose = require("mongoose");
const User = require("../models/user")

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required : true,
      ref : "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required : true,
      ref : "User"
    },
    status: {
      type: String,
      lowercase: true,
      required : true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({fromUserId : 1, toUserId : 1})

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
})

module.exports = new mongoose.model("ConnectionRequest", connectionRequestSchema);