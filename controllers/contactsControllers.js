import Contact from "../models/contact.js"
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllContacts = async(req, res) => {
    const contacts = await Contact.find({ownerId: req.user.id});
    res.send(contacts)
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
        throw HttpError(404)
    }
    if(contact.ownerId.toString()!== req.user.id){
        throw HttpError(404);
    }
    res.send(contact);
};

const deleteContact = async(req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404)
    }
    if(result.ownerId.toString()!== req.user.id){
        throw HttpError(404);
    }
    res.send({
        message: "Delete success",
    })
};

const createContact = async (req, res) => {
    const result = await Contact.create({...req.body,ownerId: req.user.id});

    res.send(result);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body,{new: true});
    if (!result) {
        throw HttpError(404) 
    }
    if(result.ownerId.toString()!== req.user.id){
        throw HttpError(404);
    }
    res.json(result);
};
const updateStatusContact = async(req,res)=>{
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body,{new: true});
    if (!result) {
        throw HttpError(404) 
    }
    if(result.ownerId.toString()!== req.user.id){
        throw HttpError(404);
    }
    res.json(result);
}

const controllers = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact:ctrlWrapper(updateStatusContact),
};

export default controllers;