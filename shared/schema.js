"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertGoalSchema = exports.goals = exports.insertArticleSchema = exports.articles = exports.insertExerciseSchema = exports.exercises = exports.insertWorkoutSchema = exports.workouts = exports.insertMealSchema = exports.meals = exports.insertDietPlanSchema = exports.dietPlans = exports.insertHealthMetricsSchema = exports.healthMetrics = exports.insertUserSchema = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
// User table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    avatar: (0, pg_core_1.text)("avatar"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({
    id: true,
    createdAt: true,
});
// Health metrics table
exports.healthMetrics = (0, pg_core_1.pgTable)("health_metrics", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id),
    weight: (0, pg_core_1.real)("weight").notNull(), // in kg
    height: (0, pg_core_1.real)("height").notNull(), // in cm
    bmi: (0, pg_core_1.real)("bmi").notNull(),
    recordedDate: (0, pg_core_1.date)("recorded_date").defaultNow().notNull(),
    calories: (0, pg_core_1.integer)("daily_calories"),
    activeMinutes: (0, pg_core_1.integer)("active_minutes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertHealthMetricsSchema = (0, drizzle_zod_1.createInsertSchema)(exports.healthMetrics).omit({
    id: true,
    bmi: true,
    createdAt: true,
});
// Diet plans table
exports.dietPlans = (0, pg_core_1.pgTable)("diet_plans", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    totalCalories: (0, pg_core_1.integer)("total_calories").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertDietPlanSchema = (0, drizzle_zod_1.createInsertSchema)(exports.dietPlans).omit({
    id: true,
    createdAt: true,
});
// Meals table
exports.meals = (0, pg_core_1.pgTable)("meals", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    dietPlanId: (0, pg_core_1.integer)("diet_plan_id").notNull().references(() => exports.dietPlans.id),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    calories: (0, pg_core_1.integer)("calories").notNull(),
    mealTime: (0, pg_core_1.text)("meal_time").notNull(), // breakfast, lunch, dinner, snack
    icon: (0, pg_core_1.text)("icon").notNull().default("restaurant"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertMealSchema = (0, drizzle_zod_1.createInsertSchema)(exports.meals).omit({
    id: true,
    createdAt: true,
});
// Workouts table
exports.workouts = (0, pg_core_1.pgTable)("workouts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    duration: (0, pg_core_1.integer)("duration").notNull(), // in minutes
    icon: (0, pg_core_1.text)("icon").notNull().default("fitness_center"),
    scheduledDate: (0, pg_core_1.date)("scheduled_date"),
    scheduledTime: (0, pg_core_1.text)("scheduled_time"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertWorkoutSchema = (0, drizzle_zod_1.createInsertSchema)(exports.workouts).omit({
    id: true,
    createdAt: true,
});
// Exercises table
exports.exercises = (0, pg_core_1.pgTable)("exercises", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    workoutId: (0, pg_core_1.integer)("workout_id").notNull().references(() => exports.workouts.id),
    name: (0, pg_core_1.text)("name").notNull(),
    sets: (0, pg_core_1.integer)("sets"),
    reps: (0, pg_core_1.integer)("reps"),
    icon: (0, pg_core_1.text)("icon").notNull().default("fitness_center"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertExerciseSchema = (0, drizzle_zod_1.createInsertSchema)(exports.exercises).omit({
    id: true,
    createdAt: true,
});
// Articles (educational content)
exports.articles = (0, pg_core_1.pgTable)("articles", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    summary: (0, pg_core_1.text)("summary").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url"),
    category: (0, pg_core_1.text)("category").notNull(), // nutrition, exercise, health, etc.
    readTime: (0, pg_core_1.integer)("read_time").notNull(), // in minutes
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertArticleSchema = (0, drizzle_zod_1.createInsertSchema)(exports.articles).omit({
    id: true,
    createdAt: true,
});
// Goals table
exports.goals = (0, pg_core_1.pgTable)("goals", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id),
    name: (0, pg_core_1.text)("name").notNull(),
    targetValue: (0, pg_core_1.real)("target_value"), // e.g. target weight
    currentValue: (0, pg_core_1.real)("current_value"), // current progress
    startDate: (0, pg_core_1.date)("start_date").defaultNow().notNull(),
    targetDate: (0, pg_core_1.date)("target_date"),
    completed: (0, pg_core_1.boolean)("completed").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.insertGoalSchema = (0, drizzle_zod_1.createInsertSchema)(exports.goals).omit({
    id: true,
    createdAt: true,
});
