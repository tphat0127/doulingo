const validator = require("validator");
const _ = require("lodash");
const { User } = require("../../../models/User.model");

module.exports.validateCreateUser = async (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const passWord = req.body.passWord;
  const passWord2 = req.body.passWord2;
  const phoneNumber = req.body.phoneNumber;
  const fullName = req.body.fullName;

  const error = {};

  if (!userName) {
    error.userName = "User name is required";
  }
  if (!email) {
    error.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    error.email = "Email is invalid";
  } else {
    const user = await User.findOne({ email });
    if (user) error.email = "Email exists";
  }
  if (!passWord) {
    error.passWord = "Password is required";
  }
  if (!passWord2) {
    error.passWord2 = "Password2 is required";
  }
  if (passWord!==passWord2) {
    error.passWord2 = "Password not match";
  }
  if (!phoneNumber) {
    error.phoneNumber = "Phone Number is required";
  } else if (!validator.isMobilePhone(phoneNumber)) {
    error.phoneNumber = "Phone Number is invalid";
  }

  if (!fullName) {
    error.fullName = "FullName is require";
  }

  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }

  return next();
};
