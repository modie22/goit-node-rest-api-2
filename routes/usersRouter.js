import express from "express";
import controllers from "../controllers/usersControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema,loginUserSchema,verifyEmailSchema} from "../schemas/usersSchemas.js";
import auth from "../middleware/auth.js";

const usersRouter = express.Router();
const usersAvatarRouter = express.Router();

usersRouter.post("/register",  validateBody(registerUserSchema),  controllers.register);
usersRouter.post("/login",  validateBody(loginUserSchema),  controllers.login);
usersRouter.get("/logout", auth, controllers.logout);
usersRouter.get("/verify/:verificationtoken", controllers.verify);
usersRouter.post("/verify", validateBody(verifyEmailSchema), controllers.resendVerifyEmail)


export default usersRouter;
