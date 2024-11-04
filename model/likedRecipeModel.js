import mongoose from "mongoose";

const likedSchema = new mongoose.Schema({
    itemId: {
        type: String, 
        required: true
    },
    userId: {
        type: String, 
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Liked = mongoose.model("Liked", likedSchema);

export default Liked;
