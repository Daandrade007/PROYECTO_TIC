const express = require('express');
const xlsx = require('xlsx');
const path = require('path');
const app = express();
const port = 5001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Función para convertir números de fecha de Excel a formato Date
const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);  // Excel's base date is 1900-01-01
    const utc_value = utc_days * 86400;  // seconds in a day
    const date = new Date(utc_value * 1000);  // Convert to milliseconds
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    const seconds = Math.floor(86400 * fractional_day);  // seconds in the fractional day
    date.setSeconds(seconds);
    return date;
};

// Ruta para obtener datos de sensores
app.get('/api/data', (req, res) => {
    const filePath = path.join(__dirname, 'datos.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let jsonData = xlsx.utils.sheet_to_json(worksheet);

    jsonData = jsonData.map(item => ({
        ...item,
        massPM2_5Max: parseFloat(item.massPM2_5Max.toString().replace(',', '.')),
        massPM2_5Min: parseFloat(item.massPM2_5Min.toString().replace(',', '.')),
        massPM2_5Avg: parseFloat(item.massPM2_5Avg.toString().replace(',', '.')),
        massPM10_0Max: parseFloat(item.massPM10_0Max.toString().replace(',', '.')),
        massPM10_0Min: parseFloat(item.massPM10_0Min.toString().replace(',', '.')),
        massPM10_0Avg: parseFloat(item.massPM10_0Avg.toString().replace(',', '.')),
        timestamp: excelDateToJSDate(item.timestamp),  // Convertir el número Excel a una fecha
    }));

    res.setHeader('Content-Type', 'application/json');
    res.json(jsonData);
});

// Ruta para agregar datos al archivo Excel
app.post('/api/add', (req, res) => {
    const newData = req.body;
    const filePath = path.join(__dirname, 'datos.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    jsonData.push(newData);

    const newWorksheet = xlsx.utils.json_to_sheet(jsonData);
    workbook.Sheets[sheetName] = newWorksheet;
    xlsx.writeFile(workbook, filePath);

    res.json({ success: true, message: 'Dato agregado correctamente' });
});

// Ruta para el login de usuarios
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const filePath = path.join(__dirname, 'datos.xlsx');
    const workbook = xlsx.readFile(filePath);

    // Leer la hoja 'usuarios'
    const sheetName = 'usuarios';
    if (!workbook.Sheets[sheetName]) {
        return res.status(400).json({ success: false, message: 'La hoja de usuarios no existe en el archivo Excel' });
    }

    const worksheet = workbook.Sheets[sheetName];
    const users = xlsx.utils.sheet_to_json(worksheet);

    // Verificar si el usuario existe
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, message: 'Login exitoso' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
