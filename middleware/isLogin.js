const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const isLogin = async (req, res, next) => {
  //console.log("hello midlewere")

  const { token } = req.cookies;
  // console.log(token)

  if (token) {
    res.redirect("/dashboard");
  }
  next();
};

module.exports = isLogin;
