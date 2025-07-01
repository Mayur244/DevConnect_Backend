const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

// middleware
app.use(express.json());
app.use(cookieParser());


const {authRouter} = require("./routes/auth")
const {profileRouter} = require("./routes/profile")
const {requestRouter} = require("./routes/request")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
 

// DB Connection
connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, () => {
      console.log("server is listening at PORT 3000...");
    });
  })
  .catch((err) => {
    console.error("DB cannot connected");
  });
