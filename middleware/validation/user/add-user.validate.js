const validator = require("validator");
const _ = require("lodash");
const { User } = require("../../../models/User.model");

module.exports.validateAddUser = async (req, res, next) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const passWord = req.body.passWord;
  const phoneNumber = req.body.phoneNumber;
  const fullName = req.body.fullName;

  const error = {};

  //userName
  if (!userName) {
    error.email = "userName is required";
  }
  //email
  if (!email) {
    error.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    error.email = "Email is invalid";
  } else {
    const user = await User.findOne({ email });
    if (user) error.email = "Email exists";
  }
  // mat khau
  if (!passWord) {
    error.passWord = "Password is required";
  }
  // soDt
  if (!phoneNumber) {
    error.phoneNumber = "Phone Number is required";
  } else if (!validator.isMobilePhone(phoneNumber)) {
    error.soDt = "Phone Number is invalid";
  }
  // hoTen
  if (!fullName) {
    error.fullName = "FullName is require";
  }
  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }
  return next();
};
