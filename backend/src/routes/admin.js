import express from "express";
import { db } from "../db/index.js";
import { users, testResults, transactions } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get all users
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const allUsers = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                balance: users.balance,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(desc(users.createdAt));

        res.json(allUsers);
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

// Get user details with stats
router.get("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await db
            .select({
                id: users.id,
                username: users.username,
                email: users.email,
                balance: users.balance,
                role: users.role,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.id, parseInt(id)));

        if (user.length === 0) {
            return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
        }

        // Get test count
        const tests = await db
            .select()
            .from(testResults)
            .where(eq(testResults.userId, parseInt(id)));

        res.json({
            ...user[0],
            testCount: tests.length,
            averageIQ: tests.length > 0 ? Math.round(tests.reduce((acc, t) => acc + t.iqScore, 0) / tests.length) : null,
        });
    } catch (error) {
        console.error("Get user details error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

// Update user balance (admin only)
router.patch("/users/:id/balance", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        if (typeof amount !== "number") {
            return res.status(400).json({ error: "Дүн буруу" });
        }

        await db
            .update(users)
            .set({ balance: amount.toString() })
            .where(eq(users.id, parseInt(id)));

        res.json({ message: "Баланс шинэчлэгдлээ" });
    } catch (error) {
        console.error("Update balance error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

// Get dashboard stats
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const totalUsers = await db.select({ count: sql`COUNT(*)` }).from(users);

        const totalTests = await db.select({ count: sql`COUNT(*)` }).from(testResults);

        const pendingTransactions = await db
            .select({ count: sql`COUNT(*)` })
            .from(transactions)
            .where(eq(transactions.status, "pending"));

        const totalTransactionVolume = await db
            .select({
                total: sql`COALESCE(SUM(amount), 0)`,
            })
            .from(transactions)
            .where(eq(transactions.status, "completed"));

        res.json({
            totalUsers: totalUsers[0].count,
            totalTests: totalTests[0].count,
            pendingTransactions: pendingTransactions[0].count,
            totalTransactionVolume: totalTransactionVolume[0].total,
        });
    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

export default router;
