import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./db/index.js";
import authRoutes from "./routes/auth.js";
import testRoutes from "./routes/test.js";
import transactionRoutes from "./routes/transactions.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Серверийн алдаа" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Хуудас олдсонгүй" });
});

// Start server
async function start() {
    await testConnection();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

start();
