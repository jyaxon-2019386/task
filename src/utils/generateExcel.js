import ExcelJS from 'exceljs';
import Company from '../company/company.model.js';

export const generateExcelReport = async () => {
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet('Companies');

    // Obtener todas las empresas registradas desde la base de datos
    let companies = await Company.find();

    // Definir las columnas del reporte
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Category', key: 'categoryBusiness', width: 20 },
        { header: 'Years Carrer', key: 'yearsCareer', width: 20 },
    ];

    // Agregar los datos de las empresas al reporte
    companies.forEach(company => {
        worksheet.addRow({
            name: company.name,
            categoryBusiness: company.categoryBusiness,
            yearsCareer: company.yearsCareer,
        });
    });

    // Guardar el archivo Excel
    await workbook.xlsx.writeFile('Reports/companies_report.xlsx');
};
