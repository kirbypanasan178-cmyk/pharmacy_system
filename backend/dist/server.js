"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = __importDefault(require("./config/env"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
const startServer = async () => {
    try {
        await (0, db_1.default)();
        const PORT = env_1.default.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Server failed to start: ", error.message);
        }
        else {
            console.error("Unknown server error");
        }
        process.exit(1);
    }
};
startServer();
