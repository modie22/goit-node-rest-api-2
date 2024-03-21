import express from "express";
import controllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, updateStatusContactSchema} from "../schemas/contactsSchemas.js";



const contactsRouter = express.Router();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", controllers.getOneContact);

contactsRouter.delete("/:id", controllers.deleteContact);

contactsRouter.post("/",  validateBody(createContactSchema),  controllers.createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), controllers.updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateStatusContactSchema), controllers.updateStatusContact);

export default contactsRouter;
