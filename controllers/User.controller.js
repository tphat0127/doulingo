const express = require("express");
const { uploadImages } = require("../middleware/img/index");
const {
  AddUser,
  createUser,
  deleteUser,
  getAccountInfo,
  getMe,
  login,
  paginationUser,
  searchUser,
  updatePassword,
  updateUser,
  uploadAvatar,
  getAllUsers
} = require("../services/User.service");
const {
  validateCreateUser,
} = require("../middleware/validation/user/create-user.validate");
const {
  validateChangePassword,
} = require("../middleware/validation/user/change-password.validate");

const {
  validateLogin,
} = require("../middleware/validation/user/login.validate");
const {
  validateAddUser,
} = require("../middleware/validation/user/add-user.validate");

const {
  validateUpdateUser,
} = require("../middleware/validation/user/update-user.validate");
const { authenticate, authorization } = require("../middleware/auth/index");
const router = express.Router();

router.get(
  "/users",
  //authenticate,
  //authorization(["602b1b874b9eab3104d7d154"]),
  getAllUsers
);
router.get(
  "/users/search",
  authenticate,
  authorization(["602b1b874b9eab3104d7d154"]),
  searchUser
);
router.get(
  "/me",
  authenticate,
  authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]),
  getMe
);
router.get("/users/searchByUserName", getAccountInfo);
router.post("/users", validateCreateUser, createUser);
router.post(
  "/users/add",
  validateAddUser,
  authenticate,
  authorization(["602b1b874b9eab3104d7d154"]),
  AddUser
);
router.post("/login", validateLogin, login);
router.post(
  "/users/upload",
  authenticate,
  authorization(["602b1b874b9eab3104d7d154"]),
  uploadImages("avatar"),
  uploadAvatar
);
router.get(
  "/paginationUser",
  authenticate,
  authorization(["602b1b874b9eab3104d7d154"]),
  paginationUser
);
router.patch(
  "/users",
  validateChangePassword,
  authenticate,
  authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]),
  updatePassword
);
router.put(
  "/users/:id",
  authenticate,
  validateUpdateUser,
  authorization(["602b1a324b9eab3104d7d153", "602b1b874b9eab3104d7d154"]),
  updateUser
);
router.delete(
  "/users/:id",
  authenticate,
  authorization(["602b1b874b9eab3104d7d154"]),
  deleteUser
);

module.exports = router;
