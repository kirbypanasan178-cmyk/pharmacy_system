import mongoose from "mongoose"

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables")
    }

    const conn = await mongoose.connect(mongoURI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    } else {
      console.error("Unknown error occurred while connecting to MongoDB")
    }

    process.exit(1) // Exit if DB fails
  }
}

export default connectDB