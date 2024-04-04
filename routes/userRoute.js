const express = require("express");
const router = express.Router();
const verifyJWT = require("../auth/Auth");

const User = require("../models/User");

router.route("/existingUsers").post(async (req, res) => {
  try {
    var users = await User.find({ number: { $in: req.body.numbers } });
    existingUsersNumbers = users.map((user) => user.number);
    res.json(existingUsersNumbers);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.route("/setToken").post(verifyJWT, async (req, res) => {
  try {
    await User.updateOne({_id:req.userId},{expoNotificationToken: req.body.token});
    res.send(true)
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
