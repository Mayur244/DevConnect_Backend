const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mayurghodaskar44:yCkCvsd8GQ5QcySX@information.zsqpi.mongodb.net/devConnect"
  );
};

module.exports = {connectDB};


