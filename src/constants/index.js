export const USER_ROLES = Object.freeze({
  ADMIN: "ADMIN",
  USER: "USER",
  COURIER: "COURIER",
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "AVAILABLE",
  OUT_OF_STOCK: "OUT_OF_STOCK",
});

export const ORDER_STATUS = Object.freeze({
  PENDING: "PENDING",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
});

export const ORDER_PRIORITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
});

export const DELIVERY_STATUS = Object.freeze({
  ASSIGNED: "ASSIGNED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
});
