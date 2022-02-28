const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Users } = require("../models");
const { confirmToken } = require("../middleware/AuthMiddleware");
require("dotenv").config();

const { sign } = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("this is a message");
});

router.post("/login", async (req, res) => {
  const userCheck = await Users.findOne({
    where: { username: req.body.username },
  });

  if (userCheck == null) {
    res.json({ error: "User doesn't exist" });
  }
  bcrypt.compare(req.body.password, userCheck.password, function (err, result) {
    if (result) {
      const accessToken = sign(
        { username: req.body.username },
        process.env.HASH
      );
      res.json(accessToken);
    } else {
      res.json({ error: "Wrong credentials, please try again" });
    }
  });
});

router.post("/register", async (req, res) => {
  const userInfo = req.body;
  const userCheck = await Users.findOne({
    where: { username: userInfo.username },
  });
  const emailCheck = await Users.findOne({
    where: { email: userInfo.email },
  });
  if (userCheck == null && emailCheck == null) {
    bcrypt.hash(userInfo.password, saltRounds, (err, hash) => {
      userInfo.password = hash;
      Users.create(userInfo);
      const accessToken = sign(
        { username: userInfo.username },
        process.env.HASH
      );
      res.json(accessToken);
    });
  } else {
    if (userCheck != null) {
      res.json({ error: "Username already in use" });
    } else {
      res.json({ error: "Email already in use" });
    }
  }
});

router.get("/getFollowers", confirmToken, async (req, res) => {
  let username = req.token.username;

  const data = await Users.findAll({
    where: { username: username },
  });
  console.log(data);
  res.json(data);
});

module.exports = router;
