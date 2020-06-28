const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  // validate the incoming request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // get the user from mongo db and make sure exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // compare request password with stored user password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // generate and send the token in header
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send();
});

// validates the incoming request
validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(64).required(),
    password: Joi.string().alphanum().min(3).max(64).required(),
  });
  return schema.validate(req);
};

module.exports = router;
