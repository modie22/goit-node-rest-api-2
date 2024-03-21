import User from "../models/user.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import bcrypt, { hash } from "bcrypt";

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (user !== null) {
    throw HttpError(409, "Email in use");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await User.create({
    email: normalizedEmail,
    password: passwordHash,
    subscription,
  });
  console.log(result);
  res.status(201).send({ message: "Registration succsessfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (user === null) {
    throw HttpError(401, "error email");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw HttpError(401, "error pass");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 }
  );

  await User.findByIdAndUpdate(user._id, { token });

  res.send({ token });
};

const logout = async (req, res, next) => {

    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();

};

const controllers = { 
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout:ctrlWrapper(logout),
};

export default controllers;
