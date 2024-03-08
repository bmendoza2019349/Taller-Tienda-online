import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = mongoose.Schema({
    nameCategory: {
        type: String,
        require: [true, "the name is required"],
    },
    descriptCategory: {
        type: String,
        require: [true, "the descript is required"],
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: [true, 'The category is required']
    }],
    state: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Category', CategorySchema);