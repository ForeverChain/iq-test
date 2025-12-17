import { db } from "./index.js"; // таны db холболт
import { users, questions } from "./schema.js"; // таны schema файл
import bcrypt from "bcryptjs";

// IQ тестийн асуултууд
const iqQuestions = [
    {
        questionText: "Хэрэв 2 + 3 = 10, 7 + 2 = 63, 6 + 5 = 66, 8 + 4 = ?",
        optionA: "96",
        optionB: "32",
        optionC: "12",
        optionD: "108",
        correctAnswer: "A",
        difficulty: 2,
    },
    {
        questionText: "Дараах дарааллын дараагийн тоо юу вэ? 2, 6, 12, 20, 30, ?",
        optionA: "40",
        optionB: "42",
        optionC: "38",
        optionD: "44",
        correctAnswer: "B",
        difficulty: 2,
    },
];

async function seed() {
    try {
        console.log("🌱 Seeding database...");

        // Admin хэрэглэгч үүсгэх
        const adminPassword = await bcrypt.hash("admin123", 10);
        await db.insert(users).values({
            username: "admin",
            email: "admin@iqtest.com",
            password: adminPassword,
            role: "admin",
            balance: 1000.0,
        });
        console.log("✅ Admin user created");

        // Тест хэрэглэгч үүсгэх
        const userPassword = await bcrypt.hash("user123", 10);
        await db.insert(users).values({
            username: "testuser",
            email: "user@iqtest.com",
            password: userPassword,
            role: "user",
            balance: 100.0,
        });
        console.log("✅ Test user created");

        // Асуултуудыг суулгах (drizzle schema uses camelCase property names)
        for (const question of iqQuestions) {
            await db.insert(questions).values(question);
        }
        console.log(`✅ ${iqQuestions.length} questions inserted`);

        console.log("🎉 Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
