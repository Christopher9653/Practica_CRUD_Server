require("dotenv").config();
const express = require('express');
const app = express();
const port = 3001;
const mysql = require('mysql');
const cors = require('cors');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});
app.use(cors());
app.use(express.json());

//Post inserta datos de empleados
app.post('/api/empleados', (req, res) => {
  const { nombres, edad, pais, ocupacion, anios } = req.body;
  const query = 'INSERT INTO empleados (nombres, edad, pais, ocupacion, anios) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombres, edad, pais, ocupacion, anios], (err, result) => {
    if (err) {
      console.error('Error al insertar empleado:', err);
      res.status(500).send('Error al insertar empleado');
      return;
    }
    res.status(201).send('Empleado insertado con éxito');
  });
});

//Get obtiene datos de empleados
app.get('/api/empleados', (req, res) => {
  const query = 'SELECT * FROM empleados';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener empleados:', err);
      res.status(500).send('Error al obtener empleados');
      return;
    }
    res.json(results);
  });
});

//Put actualiza datos de empleados
app.put('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, edad, pais, ocupacion, anios } = req.body;
  const query = 'UPDATE empleados SET nombres = ?, edad = ?, pais = ?, ocupacion = ?, anios = ? WHERE id = ?';
  db.query(query, [nombres, edad, pais, ocupacion, anios, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar empleado:', err);
      res.status(500).send('Error al actualizar empleado');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Empleado no encontrado');
      return;
    }
    res.send('Empleado actualizado con éxito');
  });
});

//delete elimina datos de empleados
app.delete('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM empleados WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar empleado:', err);
      res.status(500).send('Error al eliminar empleado');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Empleado no encontrado');
      return;
    }
    res.send('Empleado eliminado con éxito');
  });
});




app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
