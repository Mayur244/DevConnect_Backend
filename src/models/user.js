const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required : true,
    minLength : 2,
    maxLength : 20,
    trim : true
  },
  lastName: {
    type: String,
    minLength : 2,
    maxLength : 30,
    trim : true
  },
  emailId: {
    type: String,
    lowercase : true,
    required : true,
    unique : true,
    trim : true,
    validate(value){
      if (!validator.isEmail(value)) {
        throw new Error("Email not valid")
      }
    }
  },
  password: {
    type: String,
    required : true,
  },
  age: {
    type: Number,
    min : 18,
    trim : true
  },
}, 
{
  timestamps : true
})  

module.exports = mongoose.model("User", userSchema);



// const userSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required : true,
//     minLength : 2,
//     maxLength : 20,
//     trim : true
//   },
//   lastName: {
//     type: String,
//     minLength : 2,
//     maxLength : 30,
//     trim : true
//   },
//   emailId: {
//     type: String,
//     lowercase : true,
//     required : true,
//     unique : true,
//     trim : true
//   },
//   password: {
//     type: String,
//     required : true,
//   },
//   age: {
//     type: Number,
//     min : 18,
//     trim : true
//   },
//   gender: {
//     type: String,
//     validate(value){
//         if(!["male", "female", "other"].includes(value)){
//             throw new Error("Gender data is not valid");
//         }
//     },
//     lowercase : true
//   },
//   skills : {
//     type : [String],
//     trim : true
//   },
//   about : {
//     type : String,
//     default : "This is default info for the user",
//     maxLength : 200,
//   },
//   photoUrl : {
//     type : String,
//     default : "jhscjhjhc.jpeg",
//     trim : true
//   }
// },
// {
//     timestamps : true,
//     autoIndex: true 
// });

// const User = mongoose.model("User", userSchema);

// // Ensure unique indexes are created
// User.init()
//   .then(() => console.log("Indexes for User created successfully!"))
//   .catch((err) => console.error("Error creating User indexes:", err));

// module.exports = User;