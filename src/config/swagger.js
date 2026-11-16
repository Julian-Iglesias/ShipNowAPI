
const ref = (name) => ({
  $ref: `#/components/schemas/${name}`,
});

const arr = (name) => ({
  type: "array",
  items: ref(name),
});

const ok = (schema, description = "Operación exitosa") => ({
  description,
  content: {
    "application/json": { schema },
  },
});

const fail = (description) =>
  ok(ref("ErrorResponse"), description);

const qtyParam = {
  name: "qty",
  in: "query",
  required: false,
  description: "Cantidad de registros (1 a 100). Por defecto: 2.",
  schema: {
    type: "integer",
    minimum: 1,
    maximum: 100,
    default: 2,
  },
};

const idParam = {
  name: "id",
  in: "path",
  required: true,
  description: "ID de MongoDB (24 caracteres hexadecimales)",
  schema: { type: "string" },
};

const body = (name) => ({
  required: true,
  content: {
    "application/json": {
      schema: ref(name),
    },
  },
});

const swaggerSpec = {
  openapi: "3.0.3",

  info: {
    title: "ShipNow API",
    version: "1.0.0",
    description:
      "API REST de ShipNow desarrollada con Node.js, Express y MongoDB. Incluye usuarios, productos, pedidos y entregas simuladas, generación de datos de prueba y logging.",
  },

  servers: [
    {
      url: "http://localhost:8080",
      description: "Servidor local",
    },
  ],

  tags: [
    { name: "Users", description: "Gestión de usuarios" },
    { name: "Products", description: "Gestión de productos" },
    { name: "Orders", description: "Pedidos simulados" },
    { name: "Deliveries", description: "Entregas simuladas" },
    { name: "Mocks", description: "Generación y carga de datos ficticios" },
    { name: "Logger", description: "Herramientas internas de logging" },
  ],

  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string", example: "Juan Pérez" },
          email: { type: "string", format: "email" },
          role: {
            type: "string",
            enum: ["USER", "ADMIN", "COURIER"],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      CreateUser: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name: { type: "string", example: "Juan Pérez" },
          email: {
            type: "string",
            format: "email",
            example: "juan@example.com",
          },
        },
        description: "Los usuarios nuevos reciben el rol USER.",
      },

      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number", minimum: 0 },
          stock: { type: "integer", minimum: 0 },
          status: {
            type: "string",
            enum: ["AVAILABLE", "OUT_OF_STOCK"],
          },
        },
      },

      CreateProduct: {
        type: "object",
        required: ["name", "price", "stock"],
        properties: {
          name: { type: "string", example: "Notebook" },
          description: { type: "string", example: "Notebook de prueba" },
          price: { type: "number", minimum: 0, example: 150000 },
          stock: { type: "integer", minimum: 0, example: 10 },
        },
      },

      OrderItem: {
        type: "object",
        description:
          "Esquema de referencia para futuros ítems de pedido. No se utiliza todavía en el modelo Order.",
        properties: {
          product: { type: "string" },
          quantity: { type: "integer", minimum: 1 },
          unitPrice: { type: "number", minimum: 0 },
        },
      },

      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user: { type: "string", description: "ID del usuario" },
          description: { type: "string" },
          total: { type: "number", minimum: 0 },
          status: {
            type: "string",
            enum: ["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"],
          },
          priority: {
            type: "string",
            enum: ["LOW", "MEDIUM", "HIGH"],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      Delivery: {
        type: "object",
        properties: {
          _id: { type: "string" },
          order: { type: "string", description: "ID del pedido" },
          courier: {
            type: "string",
            nullable: true,
            description: "ID del repartidor",
          },
          status: {
            type: "string",
            enum: ["ASSIGNED", "IN_TRANSIT", "DELIVERED"],
          },
          deliveredAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      ErrorResponse: {
        type: "object",
        required: ["status", "code", "message"],
        properties: {
          status: { type: "string", example: "error" },
          code: {
            type: "string",
            example: "INVALID_MOCK_QUANTITY",
          },
          message: {
            type: "string",
            example: "La cantidad debe ser un entero entre 1 y 100",
          },
        },
      },

      SuccessResponse: {
        type: "object",
        required: ["status", "message"],
        properties: {
          status: { type: "string", example: "success" },
          message: { type: "string" },
          data: { type: "object", additionalProperties: true },
        },
      },

      MockOrders: {
        type: "object",
        properties: {
          users: arr("User"),
          orders: arr("Order"),
        },
      },

      MockDeliveries: {
        type: "object",
        properties: {
          users: arr("User"),
          couriers: arr("User"),
          orders: arr("Order"),
          deliveries: arr("Delivery"),
        },
      },

      SeedResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "success" },
          message: {
            type: "string",
            example: "Datos de prueba insertados correctamente",
          },
          data: {
            type: "object",
            properties: {
              inserted: {
                type: "object",
                properties: {
                  users: { type: "integer", example: 2 },
                  couriers: { type: "integer", example: 2 },
                  orders: { type: "integer", example: 2 },
                  deliveries: { type: "integer", example: 2 },
                },
              },
            },
          },
        },
      },
    },
  },

  paths: {},
};

// USERS

swaggerSpec.paths["/api/users"] = {
  get: {
    tags: ["Users"],
    summary: "Listar usuarios",
    responses: {
      200: ok(arr("User")),
      500: fail("INTERNAL_ERROR"),
    },
  },

  post: {
    tags: ["Users"],
    summary: "Crear usuario",
    requestBody: body("CreateUser"),
    responses: {
      201: ok(ref("User"), "Usuario creado"),
      400: fail("INVALID_USER_NAME, INVALID_USER_EMAIL o INVALID_JSON"),
      409: fail("DUPLICATE_EMAIL"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

swaggerSpec.paths["/api/users/{id}"] = {
  get: {
    tags: ["Users"],
    summary: "Obtener usuario por ID",
    parameters: [idParam],
    responses: {
      200: ok(ref("User")),
      400: fail("INVALID_USER_ID"),
      404: fail("USER_NOT_FOUND"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

// PRODUCTS

swaggerSpec.paths["/api/products"] = {
  get: {
    tags: ["Products"],
    summary: "Listar productos",
    parameters: [
      {
        name: "status",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: ["AVAILABLE", "OUT_OF_STOCK"],
        },
      },
    ],
    responses: {
      200: ok(arr("Product")),
      400: fail("INVALID_PRODUCT_STATUS"),
      500: fail("INTERNAL_ERROR"),
    },
  },

  post: {
    tags: ["Products"],
    summary: "Crear producto",
    requestBody: body("CreateProduct"),
    responses: {
      201: ok(ref("Product"), "Producto creado"),
      400: fail(
        "INVALID_PRODUCT_NAME, INVALID_PRODUCT_PRICE, INVALID_PRODUCT_STOCK o INVALID_JSON"
      ),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

swaggerSpec.paths["/api/products/{id}"] = {
  get: {
    tags: ["Products"],
    summary: "Obtener producto por ID",
    parameters: [idParam],
    responses: {
      200: ok(ref("Product")),
      400: fail("INVALID_PRODUCT_ID"),
      404: fail("PRODUCT_NOT_FOUND"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

// MOCKS

swaggerSpec.paths["/api/mocks/users"] = {
  get: {
    tags: ["Mocks", "Users"],
    summary: "Generar usuarios ficticios sin guardar",
    parameters: [qtyParam],
    responses: {
      200: ok(arr("User")),
      400: fail("INVALID_MOCK_QUANTITY"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

swaggerSpec.paths["/api/mocks/couriers"] = {
  get: {
    tags: ["Mocks", "Deliveries"],
    summary: "Generar repartidores ficticios sin guardar",
    parameters: [qtyParam],
    responses: {
      200: ok(arr("User")),
      400: fail("INVALID_MOCK_QUANTITY"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

swaggerSpec.paths["/api/mocks/orders"] = {
  get: {
    tags: ["Orders", "Mocks"],
    summary: "Generar pedidos y usuarios relacionados",
    description: "Genera datos ficticios sin guardarlos en MongoDB.",
    parameters: [qtyParam],
    responses: {
      200: ok(ref("MockOrders")),
      400: fail("INVALID_MOCK_QUANTITY"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

swaggerSpec.paths["/api/mocks/deliveries"] = {
  get: {
    tags: ["Deliveries", "Mocks"],
    summary: "Generar entregas, pedidos, usuarios y repartidores",
    description: "Genera datos ficticios sin guardarlos en MongoDB.",
    parameters: [qtyParam],
    responses: {
      200: ok(ref("MockDeliveries")),
      400: fail("INVALID_MOCK_QUANTITY"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

swaggerSpec.paths["/api/mocks/seed"] = {
  post: {
    tags: ["Mocks"],
    summary: "Insertar datos de prueba en MongoDB",
    description:
      "Solo disponible con NODE_ENV=development. No recibe body: la cantidad se envía mediante el parámetro query qty. Inserta clientes, repartidores, pedidos y entregas. Una falla puede dejar inserciones parciales.",
    parameters: [qtyParam],
    responses: {
      201: ok(ref("SeedResponse"), "Datos insertados"),
      400: fail("INVALID_MOCK_QUANTITY"),
      403: fail("SEED_FORBIDDEN"),
      500: fail("SEED_FAILED o INTERNAL_ERROR"),
    },
  },
};

// LOGGER

swaggerSpec.paths["/api/loggerTest"] = {
  get: {
    tags: ["Logger"],
    summary: "Probar los seis niveles de Winston",
    description:
      "Herramienta interna de validación, no es una funcionalidad de negocio. Solo disponible en desarrollo. Genera logs debug, http, info, warning, error y fatal.",
    responses: {
      200: ok(ref("SuccessResponse"), "Prueba de logger ejecutada"),
      404: fail("ROUTE_NOT_FOUND: entorno distinto de development"),
      500: fail("INTERNAL_ERROR"),
    },
  },
};

export default swaggerSpec;
