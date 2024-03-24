import User from "../models/user.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import gravatar from "gravatar"
import Jimp from "jimp";
import nodemailer from "nodemailer";
import crypto from "node:crypto";


import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import bcrypt, { hash } from "bcrypt";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  }
});

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (user !== null) {
    throw HttpError(409, "Email in use");
  }
  const passwordHash = await bcrypt.hash(password, 10);

///send email
const verifyToken = crypto.randomUUID();

await transport.sendMail({
  to:normalizedEmail,
  from:"super.anzori@gmail.com",
  subject:"Welcome to Phone book",
  html:`To confirm you registration please click on the <a href="http://localhost:3000/api/auth/verify/${verifyToken}">link</a>`,
  text:`To confirm you registration please open the link http://localhost:3000/api/auth/verify/${verifyToken}`
})

  const result = await User.create({
    email: normalizedEmail,
    password: passwordHash,
    verifyToken,
    avatar:gravatar.url(normalizedEmail, {s: '250', r: 'x', d: 'retro'}, false),
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
  if (user.verify === false) {
    return res.status(401).send({ message: "Your account is not verified" });
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

const uploadAvatar = async (req, res, next)=> {
  const { id } = req.user;

  const avatarDir = path.join(process.cwd(),  "public", "avatars");
  const { path: tempUpload, originalname } = req.file;
  console.log(tempUpload)
  const filename = `${id}_${originalname}`;
  await Jimp.read(tempUpload)
      .then((image) => {
          return image
              .resize(250, 250) 
             .write(tempUpload); 
      })
      .catch((err) => {
          console.error(err);
      });
  
  const resultUpload = path.join(avatarDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatar = path.join("avatars", filename);

  await User.findByIdAndUpdate(id, { avatar });

  res.send({
      avatar
  });

}
const verify = async (req, res, next)=> {
  const { verificationtoken } = req.params;

    const user = await User.findOne({ verifyToken: verificationtoken });
    if (user === null) {
      return res.status(404).send({ message: "Not found" });
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verifyToken: null });

    res.send({ message: "Verification successful" });

}
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email:normalizedEmail });

  if (!user) {
      throw HttpError(401, "Email not found");
  };

  if (user.verify) {
      throw HttpError(400, "Verification has already been passed")
  };

await transport.sendMail({
  to:normalizedEmail,
  from:"super.anzori@gmail.com",
  subject:"Welcome to Phone book",
  html:`To confirm you registration please click on the <a href="http://localhost:3000/api/auth/verify/${user.verifyToken}">link</a>`,
  text:`To confirm you registration please open the link http://localhost:3000/api/auth/verify/${user.verifyToken}`
})

  res.send({
      message: "Verification email sent",
  });
  
};

const controllers = { 
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout:ctrlWrapper(logout),
  uploadAvatar:ctrlWrapper(uploadAvatar),
  verify:ctrlWrapper(verify),
  resendVerifyEmail:ctrlWrapper(resendVerifyEmail),
};

export default controllers;
