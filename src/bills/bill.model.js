import mongoose, { Schema } from 'mongoose';

const facturaSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    companyName: {
        type: String,
        default: "Online Shopping"
    },
    companyTel: {
        type: String,
        default: "25263419"
    },
    companyAddress: {
        type: String,
        default: "3ra calle 6-61 zona 7 "
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    

});

facturaSchema.set('toObject', { getters: true });
facturaSchema.set('toJSON', { getters: true });

export default mongoose.model('Factura', facturaSchema);

