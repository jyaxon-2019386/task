import express from 'express'
import { login, register, update } from './user.controller.js';

const api = express.Router();

api.post('/register', register)
api.post('/login', login)
api.put('/update/:id',  update)

export default api  