import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type:String,
    },
    phone: {
        type:String,
    },
    favorite: {
        type:Boolean,
        default: false,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      }, 
});

export default mongoose.model("Contact",contactSchema);