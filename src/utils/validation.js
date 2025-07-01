const validator = require("validator")

const validateSignUpData = (req, res) => {
    const {firstName, lastName, emailId, password} = req.body;
   
    if(!firstName || !lastName){
        throw new Error("Name is required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter Strong Passowrd");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "skills", "photoURL", "about"];
   
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports = {validateSignUpData, validateEditProfileData}