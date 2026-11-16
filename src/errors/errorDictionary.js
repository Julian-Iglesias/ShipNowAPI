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

  DELIVERY_NOT_FOUND: {
    statusCode: 404,
    message: "Entrega no encontrada",
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

  INVALID_ORDER_ID: {
    statusCode: 400,
    message: "El ID del pedido no es válido",
  },

  INVALID_ORDER_DATA: {
    statusCode: 400,
    message: "Los datos del pedido no son válidos",
  },

  INVALID_ORDER_STATUS: {
    statusCode: 400,
    message: "El estado del pedido no es válido",
  },

  DUPLICATE_EMAIL: {
    statusCode: 409,
    message: "El email ya está registrado",
  },

  FILE_REQUIRED: {
    statusCode: 400,
    message: "Debe adjuntar un archivo",
  },

  INVALID_FILE_TYPE: {
    statusCode: 400,
    message: "Solo se permiten archivos PDF, JPG y PNG",
  },

  INVALID_FILE_FIELD: {
    statusCode: 400,
    message: "El archivo debe enviarse en el campo file",
  },

  INVALID_UPLOAD_DATA: {
    statusCode: 400,
    message: "Los datos de carga no son válidos",
  },

  INVALID_DOCUMENT_TYPE: {
    statusCode: 400,
    message: "Tipo de documento inválido: DNI, PASSPORT o LICENSE",
  },

  INVALID_DELIVERY_ID: {
    statusCode: 400,
    message: "El ID de la entrega no es válido",
  },

  SEED_FORBIDDEN: {
    statusCode: 403,
    message: "La carga de prueba solo está permitida en desarrollo",
  },

  FILE_TOO_LARGE: {
    statusCode: 413,
    message: "El archivo supera el tamaño máximo de 5 MB",
  },

  SEED_FAILED: {
    statusCode: 500,
    message: "No se pudo completar la carga de datos",
  },

  INTERNAL_ERROR: {
    statusCode: 500,
    message: "Error interno del servidor",
  },

  FILE_SAVE_FAILED: {
    statusCode: 500,
    message: "No se pudo guardar el archivo",
  },
});
