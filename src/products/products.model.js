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
    price: {
        type: Number,
        required: [true, "The price products is required"]
    },
    brand: {
        type: String,
        required: [true, "The brand products is required"]
    },
    stock:{
        type: Number,
        required: [true, "The stock products is required"]
    },
    dateOfExpiry: {
        trype: Date,
        required: [false, "The Date of Expiry products is required"]
    },
    state:{
        type: String,
        default: "EXISTENT",
        enum: ["EXISTENT", "DISCONTINUED", "OUT_OF_EXISTENCE"],
    },
    kindOfPerson: {
        type: String,
        enum:["ADULT", "CHILD"]
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
    ProductBestSeller: {
        type: Number
    }
});

export default mongoose.model('Products', ProductsSchema);