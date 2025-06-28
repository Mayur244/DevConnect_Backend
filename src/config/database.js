const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mayurghodaskar44:yCkCvsd8GQ5QcySX@information.zsqpi.mongodb.net/devConnect"
  );
};

module.exports = {connectDB};



// const mongoose = require("mongoose");

// const MONGO_URI =
//   "mongodb+srv://mayurghodaskar44:yCkCvsd8GQ5QcySX@information.zsqpi.mongodb.net/devConnect";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       autoIndex: true,
//     });
//     console.log("MongoDB connected successfully");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     throw err;
//   }
// };

// module.exports = { connectDB };
