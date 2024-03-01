import express from 'express'
import { addCommentToPost, deleteComment, editComment } from './comment.controller.js'

const api = express.Router()

api.post('/addCommentToPost/:id', addCommentToPost)
api.put('/editComment/:id', editComment)
api.delete('/deleteComment/:id', deleteComment)

export default api