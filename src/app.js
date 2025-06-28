const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
// const { connectDB } = require("./config/database");
// const User = require("./models/user");

// middleware
// app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "daduuu",
    lastName: "patil",
    emailId: "dadu12@gmail.com",
    password: "dadueyash@123",
  });

  await user.save();
  res.send("User saved");
});

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



// // patch --> updating some fields from the user documents
// app.patch("/update", async (req,res) => {
//   const userId = req.body.userId;
//   const Userdata = req.body;
//   try {
//     const user = await User.findByIdAndUpdate(userId, Userdata, { runValidators : true});
//     res.send("User Updated successfully");
//   } catch (error) {
//     res.status(400).send("Something went wrong" + error.message);
//   }
// })

// // delete --> deleting a user using UserId
app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong");
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

// // post --> creates a user
app.post("/signup", async (req, res) => {
  try {
    // console.log(req.body);
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    // Handle unique email errors
    if (error.code === 11000) {
      res.status(400).send("Email is already registered.");
    } else {
      res.status(500).send("Failed to add user: " + error.message);
    }
  }
});

//connecting to database
// connectDB()
//   .then(() => {
//     app.listen(3000, () => {
//       console.log("Server is running at port 3000...");
//     });
//   })
//   .catch((err) => {
//     console.log("DB not connected:", err);
//   });

app.use("/", (req, res) => {
  res.send("Server Running");
});