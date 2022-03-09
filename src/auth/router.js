"use strict";
const express = require("express");
const router = express.Router();
const { Users } = require("../models/index.js");
const bcrypt = require("bcrypt");
const basicAuth = require("./middleware/basic.js");
const bearerAuth = require("./middleware/bearer-auth.js");

router.post("/signup", signUpHandler);
router.post("/signin", basicAuth, signInHandler);
router.get("/user", bearerAuth, userHandler);

async function signUpHandler(req, res) {
  // console.log(Users);
  const reqBody = req.body;
  const userName = reqBody.username;
  const password = reqBody.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await Users.create({
      username: userName,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(`input cannot be null`);
  }
}

async function signInHandler(req, res) {
  res.status(200).json(req.user);
}
async function userHandler(req, res) {
  res.status(200).json(req.user);
}

module.exports = router;
