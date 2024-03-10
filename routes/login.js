const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.route("/").post(async (req, res) => {
  const user = await User.findOne({ number: req.body.number });
  if (!user) {
    res.status(404).send("User does not exist");
  } else {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(
        { _id: user._id, number: user.number, userName: user.userName },
        process.env.JWT_SECRET
      );
      res.json({ token, user });
    } else {
      res.status(401).send("Wrong password");
    }
  }
});

router.route("/signup").post(async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    number: req.body.number,
    userName: req.body.userName,
    password: password,
  });
  try {
    const user = await User.findOne({ number: newUser.number });
    if (user) {
      res.status(400).send("User already exists");
    } else {
      await newUser.save();
      res.json({ status: true });
    }
  } catch (error) {
    // console.log(error)
    res.status(400).send("Fill all fields");
  }
});

module.exports = router;
