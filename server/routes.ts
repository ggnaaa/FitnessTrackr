import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertHealthMetricSchema, 
  insertMealSchema, 
  insertWorkoutSchema,
  insertExerciseSchema,
  insertArticleSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes with /api prefix
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Health Metrics routes
  app.post("/api/health-metrics", async (req, res) => {
    try {
      const metricData = insertHealthMetricSchema.parse(req.body);
      const metric = await storage.createHealthMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create health metric" });
      }
    }
  });

  app.get("/api/health-metrics/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const metrics = await storage.getHealthMetricsByUserId(userId);
      res.json(metrics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get health metrics" });
    }
  });

  app.get("/api/health-metrics/latest/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const metric = await storage.getLatestHealthMetric(userId);
      if (!metric) {
        return res.status(404).json({ message: "No health metrics found for user" });
      }
      res.json(metric);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get latest health metric" });
    }
  });

  // Meals routes
  app.post("/api/meals", async (req, res) => {
    try {
      const mealData = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(mealData);
      res.status(201).json(meal);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create meal" });
      }
    }
  });

  app.get("/api/meals/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const meals = await storage.getMealsByUserId(userId);
      res.json(meals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get meals" });
    }
  });

  app.get("/api/meals/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = await storage.getMealRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get meal recommendations" });
    }
  });

  // Workouts routes
  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.status(201).json(workout);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create workout" });
      }
    }
  });

  app.get("/api/workouts/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const workouts = await storage.getWorkoutsByUserId(userId);
      res.json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get workouts" });
    }
  });

  app.get("/api/workouts/recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const recommendations = await storage.getWorkoutRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get workout recommendations" });
    }
  });

  // Exercises routes
  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to create exercise" });
      }
    }
  });

  app.get("/api/exercises/workout/:workoutId", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.workoutId);
      const exercises = await storage.getExercisesByWorkoutId(workoutId);
      res.json(exercises);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get exercises" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await storage.getArticle(articleId);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get article" });
    }
  });

  app.get("/api/articles/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const articles = await storage.getArticlesByCategory(category);
      res.json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to get articles by category" });
    }
  });

  // Calculation endpoint for BMI and other metrics
  app.post("/api/calculate/bmi", (req, res) => {
    try {
      const { height, weight } = z.object({
        height: z.number().positive(),
        weight: z.number().positive()
      }).parse(req.body);
      
      // Calculate BMI: weight (kg) / (height (m))^2
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      
      // Round to 1 decimal place
      const roundedBmi = Math.round(bmi * 10) / 10;
      
      // Determine BMI category
      let category = "";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi >= 18.5 && bmi < 25) category = "Healthy";
      else if (bmi >= 25 && bmi < 30) category = "Overweight";
      else category = "Obese";
      
      res.json({ bmi: roundedBmi, category });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to calculate BMI" });
      }
    }
  });

  app.post("/api/calculate/dailyCalories", (req, res) => {
    try {
      const { weight, height, age, gender, activityLevel, goal } = z.object({
        weight: z.number().positive(),
        height: z.number().positive(),
        age: z.number().positive(),
        gender: z.enum(["male", "female"]),
        activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very active"]),
        goal: z.enum(["weight loss", "maintenance", "muscle gain"])
      }).parse(req.body);
      
      // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
      let bmr;
      if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      
      // Apply activity multiplier
      let tdee; // Total Daily Energy Expenditure
      switch (activityLevel) {
        case "sedentary":
          tdee = bmr * 1.2;
          break;
        case "light":
          tdee = bmr * 1.375;
          break;
        case "moderate":
          tdee = bmr * 1.55;
          break;
        case "active":
          tdee = bmr * 1.725;
          break;
        case "very active":
          tdee = bmr * 1.9;
          break;
        default:
          tdee = bmr * 1.2;
      }
      
      // Adjust based on goal
      let dailyCalories;
      switch (goal) {
        case "weight loss":
          dailyCalories = tdee - 500; // Deficit of 500 calories
          break;
        case "maintenance":
          dailyCalories = tdee;
          break;
        case "muscle gain":
          dailyCalories = tdee + 300; // Surplus of 300 calories
          break;
        default:
          dailyCalories = tdee;
      }
      
      // Round to nearest 10
      dailyCalories = Math.round(dailyCalories / 10) * 10;
      
      res.json({ 
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        dailyCalories,
        goal
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: "Failed to calculate daily calories" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
