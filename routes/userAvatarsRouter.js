import express from "express";
import controllers from "../controllers/usersControllers.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";


const usersAvatarRouter = express.Router();

usersAvatarRouter.patch("/avatar", auth , upload.single("avatar"), controllers.uploadAvatar);

export default usersAvatarRouter;
