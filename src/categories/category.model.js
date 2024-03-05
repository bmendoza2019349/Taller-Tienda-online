import mongoose from 'mongoose';

const CategorySchema = mongoose.Schema({
    nameCategory: {
        type: String,
        require: [true, "the name is required"],
    },
    descriptCategory: {
        type: String,
        require: [true, "the descript is required"],
    },
    state: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Category', CategorySchema);