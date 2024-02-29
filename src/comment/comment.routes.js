import express from 'express'
import { addCommentToPost } from './comment.controller.js'

const api = express.Router()

api.post('/addCommentToPost/:id', addCommentToPost)

export default api