import Redis from "ioredis";

// use Redis from ioredis library for connection backend node js to the redis cloud server
export const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
})

// runs for seeing the redis connection to the server if its connected or failed 
redisClient.on("connect", () => console.log("Redis connected"))
redisClient.on("error", (err) => console.error("Redis error: ", err))

