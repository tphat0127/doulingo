const { Schema } = require("mongoose");
const { User } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");
const jwtSign = util.promisify(jwt.sign);
const config = require("../config/index");
const PAGE_SIZE = 2;

module.exports.createUser = (req, res, next) => {
  const { userName, passWord, email, phoneNumber, fullName } = req.body;
  User.create({ userName, passWord, email, phoneNumber, fullName })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, passWord } = req.body;
  let _user;
  User.findOne({ email })
    .then((user) => {
      if (!user)
        return Promise.reject({ status: 404, message: "User Not Found" });
      _user = user;
      return bcrypt.compare(passWord, user.passWord);
    })
    .then((isMatched) => {
      if (!isMatched)
        return Promise.reject({
          status: 400,
          message: "Password is incorrect",
        });
      const payload = {
        _id: _user._id,
        userName: _user.userName,
        email: _user.email,
        fullName: _user.fullName,
        phoneNumber: _user.phoneNumber,
        email: _user.email,
        role: _user.role,
      };
      return jwtSign(payload, config.JWT_SECRET_KEY, {
        expiresIn: "1h",
      }).then((token) => {
        return res.status(200).json({ message: "login successfully", token });
      });
    })
    .catch((err) => res.status(err.status).json(err));
};

module.exports.updatePassword = (req, res, next) => {
  const { email, oldPassword, newPassword } = req.body;
  let _user;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: "User Not Found",
        });
      }
      _user = user;
      return bcrypt.compare(oldPassword, _user.passWord);
    })
    .then((isMatched) => {
      if (!isMatched) {
        return Promise.reject({
          status: 400,
          message: "Password is incorrect",
        });
      }
      _user.passWord = newPassword;
      return _user.save();
    })
    .then(() => {
      return res.status(200).json({ message: "Update Password Successfully" });
    })
    .catch((err) => res.status(500).json(err));
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .populate({
      path: "role",
      select: "name_Role"
    })
    .populate("chapterPass")
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json(err));

};

module.exports.uploadAvatar = (req, res, next) => {
  console.log("token", req.user);
  console.log("req.user._id", req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) return Promise.reject({ message: "User not found" });
      user.avatarUrl = `${req.file.fieldname}s/${req.file.filename}`;
      return user.save();
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => res.json(err));
};

module.exports.paginationUser = (req, res, next) => {
  var page = req.query.page;
  if (page) {
    page = parseInt(page);
    if (page < 1) {
      page = 1;
    }
    var soLuongBoQua = (page - 1) * PAGE_SIZE;
    User.find({})
      .populate({
        path: "role",
      })
      .skip(soLuongBoQua)
      .limit(PAGE_SIZE)
      .then((users) => {
        return res.status(200).json(users);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } else {
    return User.find()
      .populate({
        path: "role",
        select: "name_Role"
      })
      .then((users) => {
        return res.status(200).json(users);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
};
// can fix
module.exports.AddUser = (req, res, next) => {
  const { userName, passWord, email, fullName, phoneNumber } = req.body;
  User.find({ userName });
  return User.create({
    userName,
    passWord,
    email,
    fullName,
    phoneNumber
  })
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { id } = req.params;
  console.log("user", id);
  console.log("object", req.user);
  const { email, fullName, phoneNumber, userName } = req.body;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, message: "User Not Found" });
      }
      user.email = email;
      user.phoneNumber = phoneNumber;
      user.fullName = fullName;
      user.userName = userName;

      return user.save();
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      return res.status(500).json(err);
    });
};

//delete by id

module.exports.deleteUser = (req, res, next) => {
  const { id } = req.params;
  let _user;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return Promise.reject({
          status: 404,
          message: "User Not Found",
        });
      }
      _user = user;
      return user.deleteOne();
    })
    .then(() => res.status(200).json({ message: "delete successfully" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports.searchUser = (req, res, next) => {
  var user = req.query.user;
  if (user) {
    console.log("user", user);
    User.find({
      fullName: new RegExp(".*" + user + ".*", "i"),
    })
      .populate({
        path: "role",
        select: "name_Role"
      })
      .then((users) => {
        return res.status(200).json(users);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } else {
    return User.find()

      .then((users) => {
        return res.status(200).json(users);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
};

module.exports.getAccountInfo = (req, res, next) => {
  const { userName } = req.query;
  console.log("account", userName);
  return User.find({ userName })
    .populate({
      path: "role",
      select: "name_Role"
    })
    .then((user) => {
      if(!user) return Promise.reject({
        status: 404,
        message: "User not found"
    })
      return res.status(200).json(user);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
module.exports.getAllUsers = (req, res, next) => {
  return User.find()
    .populate({
      path: "role",
      select: "name_Role"
    })
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
