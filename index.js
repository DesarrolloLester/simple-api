const app = require('./server.js');  // Importa la aplicación de Express desde `server.js`

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});