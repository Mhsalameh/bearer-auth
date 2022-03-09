"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;

const UsersModel = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.VIRTUAL,
    },
    // loginAt:{
    //   type: DataTypes.VIRTUAL,
    // }
  });
  Users.authenticate = async function (username, password) {
    try {
      const user = await this.findOne({ where: { username: username } });
      // console.log(password);
      const valid = await bcrypt.compare(password, user.password); //true or false
      // console.log("22", valid);
      // console.log(user.password)
      if (valid) {
        let token = jwt.sign(
          { exp: Math.floor(Date.now() / 1000) + 900, username: user.username },
          SECRET
        );
        // console.log('time',Date.now())
        // console.log("33", token);
        user.token = token;
        // console.log("44", user.token);
        return user;
      } else {
        throw new Error("invalid password");
      }
    } catch (error) {
      throw new Error("invalid username");
    }
  };
  Users.verifyToken = async function (token) {
    let validToken = jwt.verify(token, SECRET);
    // console.log(validToken)
    try {
      let user = await this.findOne({
        where: { username: validToken.username },
      });
      // console.log(user)
      return user;
    } catch (e) {
      throw new Error(`invalid token ${e}`);
    }
  };
  return Users;
};
module.exports = UsersModel
