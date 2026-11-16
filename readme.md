# ShipNow API

API REST desarrollada con **Node.js, Express, MongoDB y Mongoose** para la gestión de usuarios y productos.

## Tecnologías
- Node.js
- Express
- MongoDB y Mongoose
- Dotenv

## Arquitectura

El proyecto utiliza una arquitectura de tres capas:

- **Controller:** recibe las peticiones HTTP y devuelve las respuestas.
- **Service:** contiene las validaciones y la lógica de negocio.
- **Repository:** realiza las consultas y operaciones sobre MongoDB.

Esta separación permite mantener el código organizado, reutilizable y fácil de mantener.

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias:

   `npm install`

3. Crear un archivo `.env` tomando como referencia `.env.example`:

   ```env
   PORT=8080
   MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
   NODE_ENV=development
   ```

4. Asegurarse de que MongoDB esté funcionando.
5. Iniciar el servidor:

   `node src/server.js`

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos |
| GET | `/api/products/:id` | Buscar producto por ID |
| POST | `/api/products` | Crear producto |
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Buscar usuario por ID |
| POST | `/api/users` | Crear usuario |

## Configuración y validaciones

Las variables de entorno se validan al iniciar la aplicación. Se utilizan constantes para los roles de usuarios y estados de productos.

La API incluye validaciones de datos, control de correos duplicados y manejo de errores HTTP.