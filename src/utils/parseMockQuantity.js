
import AppError from "./AppError.js";

export const parseMockQuantity = (rawQty) => {

    // Si no se indica cantidad, se usa 2 por defecto
    if (rawQty === undefined) {
        return 2;
    }

    // Solo se acepta cadenas de dígitos decimales
    if (
        typeof rawQty !== "string" ||
        !/^[0-9]+$/.test(rawQty)
    ) {
        throw new AppError("INVALID_MOCK_QUANTITY");
    }

    const qty = Number(rawQty);

    // Validar que sea un entero entre 1 y 100
    if (
        !Number.isInteger(qty) ||
        qty < 1 ||
        qty > 100
    ) {
        throw new AppError("INVALID_MOCK_QUANTITY");
    }

    return qty;
};
