import express from "express"
import cors from "cors"
import usersRouter from "./routes/users.router.js"
import productRouter from "./routes/product.router.js"
import mockRouter from "./routes/mock.router.js"
//import storesRouter from "./routes/stores.router.js"
//import orderRouter from "./routes/order.router.js"

const app = express()

app.use(cors())
app.use(express.json())


app.use('/api/users', usersRouter)
app.use("/api/products", productRouter)
app.use("/api/mocks", mockRouter)
//app.use('/api/stores', storesRouter)
//app.use('/api/orders', orderRouter)

app.use((req,res)=>{
    res.status(404).json({
        status:'error',
        message: 'Ruta no encontrada'
    })
})

export default app