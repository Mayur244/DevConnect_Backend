const express = require("express");
require("dotenv").config();
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./utils/socket");

app.use(
  cors({
    origin: "https://pair-up-frontend-six.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
const {chatRouter} = require("./routes/chat")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("DB connection established");
    server.listen(process.env.PORT || 3000, () => {
      console.log("server is listening at PORT 3000...");
    });
  })
  .catch((err) => {
    console.error("DB cannot connected");
  });
