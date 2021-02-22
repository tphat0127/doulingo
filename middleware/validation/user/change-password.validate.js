const validator = require("validator");
const _ = require("lodash");
const { User } = require("../../../models/User.model");

module.exports.validateChangePassword = async (req, res, next) => {
  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const reNewPassword = req.body.reNewPassword;
  const error = {};
  //email
  if (!email) {
    error.email = "email is required";
  } else {
    const user = await User.findOne({ email });
    if (!user) error.email = "email is not exists";
  }

  //password
  if (!oldPassword) {
    error.oldPassword = "password is required";
  }
  //password 2
  if (!newPassword) {
    error.newPassword = "Confirmed password is required";
  } else if (!reNewPassword) {
    error.reNewPassword = "Please type again new password";
  } else if (validator.equals(oldPassword, newPassword)) {
    error.oldPassword = "Old password and NewPassword not must match";
  } else if (!validator.equals(newPassword, reNewPassword)) {
    error.newPassword = "New password and reNewPassword must match";
  }

  console.log(validator.equals(oldPassword, newPassword));
  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }
  return next();
};
