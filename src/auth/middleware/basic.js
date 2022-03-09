"use strict";
const base64 = require("base-64");
const { Users } = require("../../models/index.js");
// const bcrypt = require("bcrypt");

module.exports = async (req, res, next) => {
  if (req.headers.authorization) {
    // console.log(req.headers.authorization)
    let headerSplit = req.headers.authorization.split(" ");
    // console.log({headerSplit});
    let encoded = headerSplit[1];
    //  console.log({encoded})
    let decoded = base64.decode(encoded);
    // console.log("0000000000000000",{decoded})
    let [userName, password] = decoded.split(":");
    try {
      let validUser = await Users.authenticate(userName, password);
      // console.log("55", validUser);
      req.user = validUser;
      next();
    } catch (e) {
      res.status(403).send(`invalid username or password ${e}`);
    }
  } else {
    next("not auth");
  }
};
