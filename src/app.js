import express from "express"
import cors from "cors"
import usersRouter from "./routes/users.router.js"
import productRouter from "./routes/product.router.js"
import mockRouter from "./routes/mock.router.js"
import AppError from "./utils/AppError.js";
import { errorHandler } from "./middlewares/error.middleware.js";


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use("/api/products", productRouter)
app.use("/api/mocks", mockRouter)

app.use((req, res, next) => {
    next(new AppError("ROUTE_NOT_FOUND"));
});

app.use(errorHandler);

export default app