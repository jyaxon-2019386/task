import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Corrige el nombre del modelo de usuario a 'User'
        required: true
    },
    comments: [
        {
            user: String,
            comms: String
        }
    ]
    
}, {
    timestamps: true,
    versionKey: false
}
);

export default mongoose.model('post', postSchema); // Corrige el nombre del modelo a 'Post'
