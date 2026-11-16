import express from "express"
import cors from "cors"
import usersRouter from "./routes/users.router.js"
import productRouter from "./routes/product.router.js"
import mockRouter from "./routes/mock.router.js"
import AppError from "./utils/AppError.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import loggerRouter from "./routes/logger.router.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import orderRouter from "./routes/order.router.js";
import fileRouter from "./routes/file.router.js";

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use("/api/products", productRouter)
app.use("/api/mocks", mockRouter)
app.use("/api/loggerTest", loggerRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/orders", orderRouter);
app.use("/api", fileRouter);

app.use((req, res, next) => {
    next(new AppError("ROUTE_NOT_FOUND"));
});

app.use(errorHandler);

export default app