export const ERROR_DICTIONARY = Object.freeze({
  USER_NOT_FOUND: {
    statusCode: 404,
    message: "Usuario no encontrado",
  },

  PRODUCT_NOT_FOUND: {
    statusCode: 404,
    message: "Producto no encontrado",
  },

  ORDER_NOT_FOUND: {
    statusCode: 404,
    message: "Pedido no encontrado",
  },

  ROUTE_NOT_FOUND: {
    statusCode: 404,
    message: "Ruta no encontrada",
  },

  INVALID_PRODUCT_STATUS: {
    statusCode: 400,
    message: "Estado de producto inválido",
  },

  INVALID_MOCK_QUANTITY: {
    statusCode: 400,
    message: "La cantidad debe ser un entero entre 1 y 100",
  },

  INVALID_USER_ID: {
    statusCode: 400,
    message: "El ID del usuario no es válido",
  },

  INVALID_USER_ID: {
    statusCode: 400,
    message: "El ID del usuario no es válido",
  },

  INVALID_USER_NAME: {
    statusCode: 400,
    message: "El nombre es obligatorio",
  },

  INVALID_USER_EMAIL: {
    statusCode: 400,
    message: "El email no es válido",
  },

  INVALID_PRODUCT_ID: {
    statusCode: 400,
    message: "El ID del producto no es válido",
  },

  INVALID_PRODUCT_NAME: {
    statusCode: 400,
    message: "El nombre del producto es obligatorio",
  },

  INVALID_PRODUCT_PRICE: {
    statusCode: 400,
    message: "El precio del producto debe ser un número mayor o igual a cero",
  },

  INVALID_PRODUCT_STOCK: {
    statusCode: 400,
    message: "El stock debe ser un número entero mayor o igual a cero",
  },

  INVALID_JSON: {
    statusCode: 400,
    message: "El cuerpo de la petición contiene un JSON inválido",
  },

  DUPLICATE_EMAIL: {
    statusCode: 409,
    message: "El email ya está registrado",
  },

  SEED_FORBIDDEN: {
    statusCode: 403,
    message: "La carga de prueba solo está permitida en desarrollo",
  },

  SEED_FAILED: {
    statusCode: 500,
    message: "No se pudo completar la carga de datos",
  },

  INTERNAL_ERROR: {
    statusCode: 500,
    message: "Error interno del servidor",
  },
});
