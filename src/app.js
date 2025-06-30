const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validate } = require("./utils/validate");
const bcrypt = require("bcrypt");
const validator = require("validator")

// middleware
app.use(express.json());


// // post --> creates a user
app.post("/signup", async (req, res) => {
  try {
    // validate the data
    validate(req);

    //encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

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
    const {emailId, password} = req.body;

    //validate the email id and password
    if(!validator.isEmail(emailId)){
      throw new Error("Enter valid Email id");
    }
    else if(!validator.isStrongPassword(password)){
      throw new Error("Enter strong password");
      
    }

    // check user present or not
    const user = await User.findOne({emailId : emailId});
    if(!user){
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid){
      res.send("Logged In Successfully");
    }else{
      throw new Error("Invalid Credentials");
      
    }

  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
})

// get --> gets all users/feed
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user) {
      res.send(user);
    } else {
      res.send("User not found");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// get --> gets a single user
app.get("/user", async (req, res) => {
  const userLastName = req.body.lastName;
  try {
    const user = await User.findOne({ lastName: userLastName });
    if (user) {
      res.send(user);
    } else {
      res.status(400).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// // patch --> updating some fields from the user documents
app.patch("/update/:userId", async (req, res) => {
  const userId = req.params.userId;
  const Userdata = req.body;
  // //console.log("param:", userId)

  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "age",
      "password",
      "userId",
    ];

    const isUpdateAllowed = Object.keys(Userdata).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed");
    } else {
      const user = await User.findByIdAndUpdate(userId, Userdata, {
        runValidators: true,
      });
      res.send("User Updated successfully");
    }
  } catch (error) {
    res.status(400).send("Something went wrong, " + error.message);
  }
});

// // delete --> deleting a user using UserId
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
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
