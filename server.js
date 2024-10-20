const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;
module.exports = app;

// Middleware para analizar el cuerpo de las solicitudes1
app.use(express.json());

// Clave secreta para firmar el JWT
const SECRET_KEY = 'tu_clave_secreta'; // Cambia esto por una clave segura en producción

// Lista de usuarios (en memoria, para fines de demostración)
const usuarios = [];
// Lista de tareas (para demostración)
const tareas = [];

// Middleware de autenticación
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token no proporcionado');

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send('Token no válido');
        req.userId = decoded.id;
        next();
    });
}

// Ruta para registrar un nuevo usuario
app.post('/registro', (req, res) => {
    const { nombre, contraseña } = req.body;
    const hashedPassword = bcrypt.hashSync(contraseña, 8); // Encriptar la contraseña

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        contraseña: hashedPassword
    };

    usuarios.push(nuevoUsuario);
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { nombre, contraseña } = req.body;
    const usuario = usuarios.find(u => u.nombre === nombre);

    if (!usuario) return res.status(404).send('Usuario no encontrado');

    // Comparar contraseña
    const contraseñasCoinciden = bcrypt.compareSync(contraseña, usuario.contraseña);
    if (!contraseñasCoinciden) return res.status(401).send('Contraseña incorrecta');

    // Crear un token
    const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 horas
    res.status(200).json({ token });
});

// Ruta protegida para obtener tareas
app.get('/tareas', verificarToken, (req, res) => {
    res.json(tareas);
});

// Ruta protegida para agregar una tarea
app.post('/tareas', verificarToken, (req, res) => {
    const { descripcion } = req.body;
    const nuevaTarea = {
        id: tareas.length + 1,
        descripcion,
        usuarioId: req.userId
    };
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// Ruta para obtener una tarea específica por ID
app.get('/tareas/:id', verificarToken, (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) return res.status(404).send('Tarea no encontrada');
    res.json(tarea);
});

// Ruta para editar una tarea específica por ID
app.put('/tareas/:id', verificarToken, (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));
    if (!tarea) return res.status(404).send('Tarea no encontrada');

    const { descripcion } = req.body;
    tarea.descripcion = descripcion;
    res.json(tarea);
});

// Ruta para eliminar una tarea específica por ID
app.delete('/tareas/:id', verificarToken, (req, res) => {
    const tareaIndex = tareas.findIndex(t => t.id === parseInt(req.params.id));
    if (tareaIndex === -1) return res.status(404).send('Tarea no encontrada');

    tareas.splice(tareaIndex, 1);
    res.status(200).json({ mensaje: 'Tarea eliminada' }); // Mensaje de éxito
});


