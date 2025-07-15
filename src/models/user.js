const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required : true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      trim: true,
    },
    gender: {
      type: String,
      lowercase: true,
      enum : {
        values : ["male", "female", "other"],
        message : `{VALUE} is not a valid gender type`
      }
    },
    skills: {
      type: [String],
      validate: [
    {
      validator: function (arr) {
        if (!arr || arr.length === 0) return true;
        return arr.length >= 2 && arr.length <= 10;
      },
      message: "Skills must be between 2 and 10 items.",
    },
    {
      validator: function (arr) {
        if (!arr || arr.length === 0) return true;
        return arr.every(skill => typeof skill === "string" && skill.trim().length > 0);
      },
      message: "Each skill must be a non-empty string.",
    }
  ]
    },
    about: {
      type: String,
      default: "Just getting started. Exploring the world one post at a time. Say hi and let’s connect!",
      maxLength: 200,
    },
    photoUrl: {
      type: String,
      default: "https://img.freepik.com/free-photo/headshot-serious-bearded-man-with-mustache-beard-wears-round-spectacles_273609-8955.jpg?semt=ais_hybrid&w=740",
      trim: true,
      validate(value){
        if(!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      }
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashPassword
  );
  return isPasswordValid;
};

userSchema.pre('save', function (next) {
  if (this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  }

  if (this.lastName) {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
  }

  next();
});


module.exports = mongoose.model("User", userSchema);


