"use strict";
const { Users } = require("../../models/index.js");

module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
      console.log("0000000",req.headers.authorization.split(" "));
    const token = req.headers.authorization.split(" ")[1];
    try {
      let user = await Users.verifyToken(token);
      // console.log(token)
      if (user) {
        req.user = user;
        next();
      }
      else{
        res.status(403).send("user not defined")
      }
    } catch (e) {
      res.status(403).send("invalid user");
    }
  }else{
    next('token is not available!')
  }
};
