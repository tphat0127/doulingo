const validator = require("validator");
const _ = require("lodash");
const { User } = require("../../../models/User.model");

module.exports.validateUpdateUser = async (req, res, next) => {
  const email = req.body.email;
  const userName = req.body.userName;
  const phoneNumber = req.body.phoneNumber;
  const fullName = req.body.fullName;
  const error = {};

  if (!email) {
    error.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    error.email = "Email is invalid";
  }
  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }
   // userName
   if (!userName) {
    error.userName = "Phone Number is required";
  }

  // so dt
  if (!phoneNumber) {
    error.phoneNumber = "Phone Number is required";
  } else if (!validator.isMobilePhone(phoneNumber)) {
    error.phoneNumber = "Phone Number is invalid";
  }

  // ho ten
  if (!fullName) {
    error.fullName = "FullName is require";
  }

  return next();
};
