const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim: true,
    },
    description: {
         type:String,
        required: true,
        trim: true,

    },
    image: {
         type:String,
        required: true,
        trim: true,
    },
    region: {
        type: String,
        enum: ["Western", "Indian"],
        default: "Western"
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,

    },
}, { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);