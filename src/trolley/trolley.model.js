import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [CartItemSchema],
    state: {
        type: String,
        enum: ['continued', 'finaliced'],
        default: 'continued',
    },
    subTotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Cart', CartSchema);
