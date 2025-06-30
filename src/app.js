const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validate } = require("./utils/validate");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth} = require("./middleware/Auth")

// middleware
app.use(express.json());
app.use(cookieParser());

// // post --> creates a user
app.post("/signup", async (req, res) => {
  try {
    // validate the data
    validate(req);

    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    //save the data into DB
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    // Handle unique email errors
    res.status(400).send("ERROR : " + error.message);
  }
});

// post --> login the valid user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //validate the email id and password
    if (!validator.isEmail(emailId)) {
      throw new Error("Enter valid Email id");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Enter strong password");
    }

    // check user present or not
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    
    //validate the password 
    const isPasswordValid = await user.validatePassword(password);

    // generate and send cookie/token from server to the browser
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Logged In Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

//get --> profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

app.use("/", (req, res) => {
  res.send("Go Back");
});

// DB Connection
connectDB()
  .then(() => {
    console.log("DB connection established");
    app.listen(3000, () => {
      console.log("server is running at PORT 3000");
    });
  })
  .catch((err) => {
    console.error("DB not connected");
  });
