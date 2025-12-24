import { Schema } from "mongoose";

const attachmentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    originalName: {
        type: String,
        trim: true,
        required: true
    },
    extension: {
        type: String,
        trim: true,
        required: false
    },
    mimetype: {
        type: String,
        trim: true,
        required: false
    },
    path: {
        type: String,
        trim: true,
        required: true
    },
    destination: {
        type: String,
        trim: true,
        required: true
    },
    size: {
        type: Number,
        trim: true,
        required: false
    }
});

export { attachmentSchema };
