import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";
import config from "./config/env.js"
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import cartRoute from "./routes/cartRoute.js"
import orderRoute from "./routes/orderRoute.js"

dotenv.config()

const app = express();

app.use(cors())


// Middleware
app.use(express.json());

app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/category", categoryRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)

const startServer = async (): Promise<void> => {
    try {
        await connectDB();

        const PORT = config.PORT || 2000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Server failed to start: ", error.message)
        } else {
            console.error("Unknown server error");
        }

        process.exit(1);
    }
}

startServer();