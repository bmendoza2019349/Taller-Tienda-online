import mongoose, { Schema } from 'mongoose';

const ProductsSchema = mongoose.Schema({
    nameProduct: {
        type: String,
        required: [true, "The name products is required"]
    },
    characteristics: {
        type: String,
        required: [true, "The characteristics products is required"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'The category is required']
    },
    price: {
        type: Number,
        required: [true, "The price products is required"]
    },
    brand: {
        type: String,
        required: [true, "The brand products is required"]
    },
    state:{
        type: String,
        default: "EXISTENT",
        enum: ["EXISTENT", "DISCONTINUED", "OUT_OF_EXISTENCE"],
    },
    kindOfPerson: {
        type: String,
        enum:["ADULT", "CHILD"],
        required: [true, "The kind Of Person products is required"]
    },
    sizes: {
        type: String,
        required: [false, "The sizes products is required"]
    },
    presentation: {
        type: String,
        required: [false, "The presentation products is required"]
    },
    material:{
        type: String,
        required: [false, "The material products is required"]
    },
    dateOfExpiry: {
        trype: Date,
        required: [false, "The Date of Expiry products is required"]
    }
});

export default mongoose.model('Products', ProductsSchema);