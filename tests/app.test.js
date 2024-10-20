const request = require('supertest');
const app = require('../server.js'); // Asegúrate de que la ruta sea correcta a tu archivo principal de la app

describe('API Tests', () => {
  let token; // Variable para almacenar el token

  // Prueba para el registro de un usuario
  it('Debe registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/registro')
      .send({
        nombre: 'usuarioTest',
        contraseña: 'contraseñaSegura123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('mensaje', 'Usuario registrado exitosamente');
  });
  
 // Prueba para iniciar sesión
 it('Debe iniciar sesión correctamente y devolver un token', async () => {
  const res = await request(app)
    .post('/login')
    .send({
      nombre: 'usuarioTest',
      contraseña: 'contraseñaSegura123'
    });
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty('token');
  token = res.body.token; // Almacena el token para las pruebas posteriores
});

});
