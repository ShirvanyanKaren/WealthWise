//post
const router = require("express").Router();
const { User } = require("../../models");
const { Op } = require("sequelize");

// Create a new user
router.post("/signup", async (req, res) => {
  try {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(req.body.email)) {
      res.status(400).json({ message: "Email address is not valid" });
      return;
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
      },
    });

    if (existingUser) {
      res.status(401).json({ message: "Email or username already in use" });
      return;
    }

    if (req.body.password.length < 8) {
      res
        .status(401)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }

    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    if (!userData) {
      res.status(400).json({ message: "Something went wrong!" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const userData = await User.findOne({
      where: {
        [Op.or]: [{ email: req.body.user }, { username: req.body.user }],
      },
    });
    console.log(userData);
    if (!userData) {
      res
        .status(404)
        .json({ message: "Username/Email not found, please try again" });
      return;
    }
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(401).json({ message: "Incorrect password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res
        .status(200)
        .json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;