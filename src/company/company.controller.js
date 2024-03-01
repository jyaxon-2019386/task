'use strict'

import Company from '../company/company.model.js'
import { generateExcelReport } from '../utils/generateExcel.js';


// Save a new company
export const save = async(req, res)=>{
    try{
        let data = req.body
        let company = new Company(data)
        await company.save()
        return res.send({message: `Registered successfully ${company.name}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering company', err: err})
    }
}

// View companies
export const get = async (req, res) => {
    try {
        let companies = await Company.find()
        return res.send({ companies })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting companies' })
    }
}

// Update company
export const update = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
    let updatedCompany = await Company.findOneAndUpdate(
        {_id: id},
        data,
        {new: true}
        )
        if(!updatedCompany) return res.status(404).send({message: 'Company not found and not updated'})
        return res.send({message: 'Company updated successfully!', updatedCompany})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating company' })
    }
}

// Filter for years carrer
export const filterByYears = async (req, res) => {
    try {
        const { minYears, maxYears } = req.body // Obtener los años mínimos y máximos del cuerpo de la solicitud

        // Realizar la consulta a la base de datos para encontrar empresas dentro del rango de años
        const companies = await Company.find({ yearsCareer: { $gte: minYears, $lte: maxYears } })

        return res.send(companies) // Devolver las empresas que cumplen con el filtro de años de trayectoria
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error filtering companies by years', error: err })
    }
};

// Filter by business category
export const filterByCategory = async (req, res) => {
    try {
        const { category } = req.body; // Obtener la categoría del cuerpo de la solicitud

        // Realizar la consulta a la base de datos para encontrar empresas con la categoría especificada
        const companies = await Company.find({ categoryBusiness: category });

        return res.send(companies); // Devolver las empresas que cumplen con el filtro de categoría
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error filtering companies by category', error: err });
    }
}

// Filter by A-Z and Z-A 
export const filterByOrder = async (req, res) => {
    try {
        const { order } = req.body; // Obtener la ordenación del cuerpo de la solicitud

        let sortCriteria = {};
        if (order === 'A-Z') {
            sortCriteria.name = 1; // Ordenar en orden ascendente por el campo 'name'
        } else if (order === 'Z-A') {
            sortCriteria.name = -1; // Ordenar en orden descendente por el campo 'name'
        }

        // Realizar la consulta a la base de datos para encontrar empresas ordenadas según la ordenación deseada
        const companies = await Company.find().sort(sortCriteria);

        return res.send(companies); // Devolver las empresas que cumplen con el filtro de ordenación
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error filtering companies by order', error: err });
    }
}

// All filters in one
export const allFilters = async (req, res) => {
    try {
        const { minYears, maxYears, category, order } = req.body; // Obtener los años mínimos, máximos, categoría y ordenación del cuerpo de la solicitud

        let sortCriteria = {};
        if (order === 'A-Z') {
            sortCriteria.name = 1; // Ordenar en orden ascendente por el campo 'name'
        } else if (order === 'Z-A') {
            sortCriteria.name = -1; // Ordenar en orden descendente por el campo 'name'
        }

        // Realizar la consulta a la base de datos para encontrar empresas dentro del rango de años, con la categoría especificada y ordenadas según la ordenación deseada
        const companies = await Company.find({ 
            yearsCareer: { $gte: minYears, $lte: maxYears },
            categoryBusiness: category
        }).sort(sortCriteria);

        return res.send(companies); // Devolver las empresas que cumplen con los filtros y ordenación
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error filtering companies by years, category and order', error: err });
    }
}

// Llamada a la función para generar el reporte
generateExcelReport()
    .then(() => console.log('Report generated successfully'))
    .catch(error => console.error('Error generating the report:', error));





