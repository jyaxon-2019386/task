import express from 'express'
import { save, get, update, allFilters, filterByYears, filterByCategory, filterByOrder } from '../company/company.controller.js'

const api = express.Router()

api.post('/save', save)
api.get('/get', get)
api.put('/update/:id', update)
api.post('/allFilters', allFilters)
api.post('/filterByYears', filterByYears)
api.post('/filterByCategory', filterByCategory)
api.post('/filterByOrder', filterByOrder)


export default api