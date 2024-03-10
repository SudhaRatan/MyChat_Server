const express = require("express");
const router = express.Router();

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

module.exports = router;
