import express from "express";
import { db } from "../db/index.js";
import { questions, testResults, userAnswers } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get random questions for test (20 questions)
router.get("/questions", authMiddleware, async (req, res) => {
    try {
        const allQuestions = await db
            .select({
                id: questions.id,
                questionText: questions.questionText,
                optionA: questions.optionA,
                optionB: questions.optionB,
                optionC: questions.optionC,
                optionD: questions.optionD,
                imageUrl: questions.imageUrl,
                difficulty: questions.difficulty,
            })
            .from(questions);

        // Shuffle and take 20 questions
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, 20);

        res.json(selectedQuestions);
    } catch (error) {
        console.error("Get questions error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

// Submit test answers
router.post("/submit", authMiddleware, async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionId, selectedAnswer }

        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: "Хариултууд шаардлагатай" });
        }

        let correctCount = 0;
        const totalQuestions = answers.length;

        // Get correct answers for all questions
        const questionIds = answers.map((a) => a.questionId);
        const questionsData = await db.select().from(questions);
        const questionsMap = new Map(questionsData.map((q) => [q.id, q.correctAnswer]));

        // Calculate score
        const answerResults = answers.map((answer) => {
            const correctAnswer = questionsMap.get(answer.questionId);
            const isCorrect = answer.selectedAnswer === correctAnswer;
            if (isCorrect) correctCount++;
            return {
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                isCorrect: isCorrect ? 1 : 0,
            };
        });

        // Calculate IQ score (simplified formula)
        // Base IQ is 100, each correct answer adds/subtracts from this
        const percentage = (correctCount / totalQuestions) * 100;
        let iqScore;
        if (percentage >= 90) iqScore = 130 + Math.floor((percentage - 90) * 2);
        else if (percentage >= 75) iqScore = 115 + Math.floor((percentage - 75) * 1);
        else if (percentage >= 50) iqScore = 100 + Math.floor((percentage - 50) * 0.6);
        else if (percentage >= 25) iqScore = 85 + Math.floor((percentage - 25) * 0.6);
        else iqScore = 70 + Math.floor(percentage * 0.6);

        // Save test result
        const testResultInsert = await db.insert(testResults).values({
            userId: req.user.id,
            score: correctCount,
            totalQuestions,
            iqScore,
        });

        const testResultId = testResultInsert[0].insertId;

        // Save individual answers
        for (const answer of answerResults) {
            await db.insert(userAnswers).values({
                testResultId,
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                isCorrect: answer.isCorrect,
            });
        }

        res.json({
            message: "Тест амжилттай илгээгдлээ",
            result: {
                id: testResultId,
                score: correctCount,
                totalQuestions,
                iqScore,
                percentage: Math.round(percentage),
            },
        });
    } catch (error) {
        console.error("Submit test error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

// Get user's test history
router.get("/history", authMiddleware, async (req, res) => {
    try {
        const results = await db.select().from(testResults).where(eq(testResults.userId, req.user.id)).orderBy(desc(testResults.completedAt));

        res.json(results);
    } catch (error) {
        console.error("Get history error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

// Get specific test result with answers
router.get("/result/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db
            .select()
            .from(testResults)
            .where(eq(testResults.id, parseInt(id)));

        if (result.length === 0) {
            return res.status(404).json({ error: "Тест олдсонгүй" });
        }

        if (result[0].userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ error: "Хандах эрхгүй" });
        }

        const answers = await db
            .select({
                questionId: userAnswers.questionId,
                selectedAnswer: userAnswers.selectedAnswer,
                isCorrect: userAnswers.isCorrect,
                questionText: questions.questionText,
                optionA: questions.optionA,
                optionB: questions.optionB,
                optionC: questions.optionC,
                optionD: questions.optionD,
                correctAnswer: questions.correctAnswer,
            })
            .from(userAnswers)
            .innerJoin(questions, eq(userAnswers.questionId, questions.id))
            .where(eq(userAnswers.testResultId, parseInt(id)));

        res.json({
            ...result[0],
            answers,
        });
    } catch (error) {
        console.error("Get result error:", error);
        res.status(500).json({ error: "Серверийн алдаа" });
    }
});

export default router;
