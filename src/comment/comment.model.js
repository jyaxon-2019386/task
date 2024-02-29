import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post', // Referencia al modelo de publicación
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Referencia al modelo de usuario
        required: true
    },
    comms: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
}
);

export default mongoose.model('comment', commentSchema);
