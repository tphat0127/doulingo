const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
  userName: { type: String, required: true },
  passWord: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  avatarUrl: { type: String },
  chapterJoin: [{type: mongoose.Schema.Types.ObjectId, ref: "UserChapter",}],
  status: { type: String, default: true },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: "602b1a324b9eab3104d7d153",
  },
}); 

UserSchema.pre("save", function (next) {
  console.log("pre save", this);
  const user = this;
  if (!user.isModified("passWord")) return next();
  bcrypt
    .genSalt(10)
    .then((salt) => {
      console.log(salt);
      return bcrypt.hash(user.passWord, salt);
    })
    .then((hash) => {
      console.log(hash);
      user.passWord = hash;
      next();
    });
});

const User = mongoose.model("User", UserSchema, "User");
module.exports = {
  UserSchema,
  User,
};
