import express from 'express'
import { createPost, deletePost, updatePost } from './post.controller.js'

const api = express.Router()

api.post('/createPost', createPost)
api.put('/updatePost/:id', updatePost)
api.delete('/deletePost/:id', deletePost)

export default api