const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body); // destructure to get error property of result in above line
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["username", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  console.log(user);
  //insert into mongodb
  await user.save();

  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  const token = user.generateAuthToken();
  // uses lodash to select properties to return in response
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/", (req, res) => {
  console.log("here i am");
  res.send({ hello: "world" });
});

module.exports = router;
