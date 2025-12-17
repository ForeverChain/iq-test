import { mysqlTable, int, varchar, text, decimal, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";

// Users table
export const users = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
    role: mysqlEnum("role", ["user", "admin"]).default("user"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Questions table
export const questions = mysqlTable("questions", {
    id: int("id").primaryKey().autoincrement(),
    questionText: text("question_text").notNull(),
    optionA: varchar("option_a", { length: 500 }).notNull(),
    optionB: varchar("option_b", { length: 500 }).notNull(),
    optionC: varchar("option_c", { length: 500 }).notNull(),
    optionD: varchar("option_d", { length: 500 }).notNull(),
    correctAnswer: varchar("correct_answer", { length: 1 }).notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    difficulty: int("difficulty").default(1),
    createdAt: timestamp("created_at").defaultNow(),
});

// Test results table
export const testResults = mysqlTable("test_results", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => users.id),
    score: int("score").notNull(),
    totalQuestions: int("total_questions").notNull(),
    testId: int("test_id").references(() => tests.id),
    iqScore: int("iq_score").notNull(),
    completedAt: timestamp("completed_at").defaultNow(),
});

// User answers table
export const userAnswers = mysqlTable("user_answers", {
    id: int("id").primaryKey().autoincrement(),
    testResultId: int("test_result_id")
        .notNull()
        .references(() => testResults.id),
    questionId: int("question_id")
        .notNull()
        .references(() => questions.id),
    selectedAnswer: varchar("selected_answer", { length: 1 }).notNull(),
    isCorrect: int("is_correct").notNull(),
});

// Transactions table
export const transactions = mysqlTable("transactions", {
    id: int("id").primaryKey().autoincrement(),
    senderId: int("sender_id")
        .notNull()
        .references(() => users.id),
    receiverId: int("receiver_id")
        .notNull()
        .references(() => users.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
});

// Tests metadata (supports multiple different tests)
export const tests = mysqlTable("tests", {
    id: int("id").primaryKey().autoincrement(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    durationMinutes: int("duration_minutes").default(null),
    totalQuestions: int("total_questions").default(null),
    published: int("published").default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

// Junction table linking tests to questions and ordering
export const testQuestions = mysqlTable("test_questions", {
    id: int("id").primaryKey().autoincrement(),
    testId: int("test_id")
        .notNull()
        .references(() => tests.id),
    questionId: int("question_id")
        .notNull()
        .references(() => questions.id),
    questionOrder: int("question_order").default(0),
    points: int("points").default(1),
});
