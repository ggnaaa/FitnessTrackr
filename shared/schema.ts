import { pgTable, text, serial, integer, boolean, date, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
  age: integer("age"),
  gender: text("gender"),
  height: real("height"), // in cm
  activityLevel: text("activity_level"), // sedentary, light, moderate, active, very active
  goal: text("goal"), // weight loss, maintenance, muscle gain
  createdAt: timestamp("created_at").defaultNow(),
});

// Health metrics model
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  weight: real("weight"), // in kg
  bmi: real("bmi"),
  bodyFat: real("body_fat"), // in percentage
  waterIntake: real("water_intake"), // in liters
  caloriesConsumed: integer("calories_consumed"),
  caloriesBurned: integer("calories_burned"),
  steps: integer("steps"),
  notes: text("notes"),
});

// Meal model
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  calories: integer("calories"),
  protein: real("protein"), // in grams
  carbs: real("carbs"), // in grams
  fat: real("fat"), // in grams
  description: text("description"),
  time: text("time"), // e.g. "7:00 AM - 8:00 AM"
  items: text("items").array(),
});

// Workout model
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  date: date("date"),
});

// Exercise model
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").notNull(),
  name: text("name").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  duration: integer("duration"), // in seconds (for exercises like planks)
  notes: text("notes"),
});

// Article model for educational content
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // Nutrition, Workout, Tips, etc.
  readTime: integer("read_time"), // in minutes
  imageUrl: text("image_url"),
});

// Define insert schemas with validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

// Define types for using throughout the application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;

export type Meal = typeof meals.$inferSelect;
export type InsertMeal = z.infer<typeof insertMealSchema>;

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
