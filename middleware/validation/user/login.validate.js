const validator = require("validator");
const _ = require("lodash");
const { User } = require("../../../models/User.model");

module.exports.validateLogin = async (req, res, next) => {
  const email = req.body.email;
  const passWord = req.body.passWord;

  const error = {};
  //email
  if (!email) {
    error.email = "email is required";
  } else {
    const user = await User.findOne({ email });
    if (!user) error.email = "email not exists";
  }
  // mat khau
  if (!passWord) {
    error.passWord = "password is required";
  }
  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }
  return next();
};
