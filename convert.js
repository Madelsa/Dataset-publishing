const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the CSV file
const csvPath = path.join(__dirname, 'sample_data.csv');

// Read the CSV file
const workbook = xlsx.readFile(csvPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Write to XLSX file
xlsx.writeFile(workbook, path.join(__dirname, 'sample_data.xlsx')); 