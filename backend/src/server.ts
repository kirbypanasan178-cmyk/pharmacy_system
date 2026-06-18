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
import analyticsRoute from "./routes/analyticsRoute.js"
import pharmacyRoute from "./routes/pharmacyRoute.js"

dotenv.config()

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // 👈 exact origin, not wildcard
  credentials: true,               // 👈 required for cookies
}))


// Middleware
app.use(express.json());

app.use("/api/user", userRoute)
app.use("/api/product", productRoute)
app.use("/api/category", categoryRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)
app.use("/api/analytics", analyticsRoute)
app.use("/api/pharmacy", pharmacyRoute)

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