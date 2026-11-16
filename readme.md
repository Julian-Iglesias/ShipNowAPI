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

## Mocking y carga de datos

Se implementó un sistema de mocking utilizando **Faker.js**, que permite generar usuarios, repartidores, pedidos y entregas ficticias, respetando las relaciones entre las entidades.

### Endpoints de Mocking

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/mocks/users?qty=5` | Generar usuarios ficticios |
| GET | `/api/mocks/couriers?qty=5` | Generar repartidores |
| GET | `/api/mocks/orders?qty=5` | Generar pedidos y usuarios relacionados |
| GET | `/api/mocks/deliveries?qty=5` | Generar usuarios, repartidores, pedidos y entregas |
| POST | `/api/mocks/seed?qty=5` | Insertar datos ficticios en MongoDB |

El parámetro `qty` indica la cantidad de registros a generar, entre 1 y 100.

Los endpoints GET solamente generan datos en memoria, sin almacenarlos.

### Carga de datos de prueba

Para insertar datos en MongoDB, configurar `NODE_ENV=development` en el archivo `.env` y ejecutar desde Postman:

`POST http://localhost:8080/api/mocks/seed?qty=2`

Esto inserta 2 clientes, 2 repartidores, 2 pedidos y 2 entregas.

La respuesta incluye la cantidad de registros insertados en cada categoría.

### Arquitectura

- **MockService:** genera los datos ficticios utilizando Faker.
- **SeedService:** coordina la generación y persistencia de los datos.
- **Repositories:** realizan las inserciones en MongoDB.
- **MockController:** recibe las peticiones HTTP y devuelve las respuestas.

Se utilizan constantes para los roles, estados y prioridades.

**Nota:** el seed está restringido al entorno de desarrollo. La configuración local de MongoDB standalone no admite transacciones multidocumento, por lo que una falla durante la carga podría dejar registros parciales.