import { users, type User, type InsertUser, healthMetrics, type HealthMetric, type InsertHealthMetric, meals, type Meal, type InsertMeal, workouts, type Workout, type InsertWorkout, exercises, type Exercise, type InsertExercise, articles, type Article, type InsertArticle } from "@shared/schema";
import { Calculator } from "../client/src/lib/fitness";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Health metrics operations
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getHealthMetric(id: number): Promise<HealthMetric | undefined>;
  getHealthMetricsByUserId(userId: number): Promise<HealthMetric[]>;
  getLatestHealthMetric(userId: number): Promise<HealthMetric | undefined>;
  
  // Meal operations
  createMeal(meal: InsertMeal): Promise<Meal>;
  getMeal(id: number): Promise<Meal | undefined>;
  getMealsByUserId(userId: number): Promise<Meal[]>;
  getMealRecommendations(userId: number): Promise<Meal[]>;
  
  // Workout operations
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  getWorkout(id: number): Promise<Workout | undefined>;
  getWorkoutsByUserId(userId: number): Promise<Workout[]>;
  getWorkoutRecommendations(userId: number): Promise<Workout>;
  
  // Exercise operations
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  getExercise(id: number): Promise<Exercise | undefined>;
  getExercisesByWorkoutId(workoutId: number): Promise<Exercise[]>;
  
  // Article operations
  createArticle(article: InsertArticle): Promise<Article>;
  getArticle(id: number): Promise<Article | undefined>;
  getAllArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private healthMetricsData: Map<number, HealthMetric>;
  private mealsData: Map<number, Meal>;
  private workoutsData: Map<number, Workout>;
  private exercisesData: Map<number, Exercise>;
  private articlesData: Map<number, Article>;
  
  private userIdCounter: number;
  private healthMetricIdCounter: number;
  private mealIdCounter: number;
  private workoutIdCounter: number;
  private exerciseIdCounter: number;
  private articleIdCounter: number;
  
  constructor() {
    this.usersData = new Map();
    this.healthMetricsData = new Map();
    this.mealsData = new Map();
    this.workoutsData = new Map();
    this.exercisesData = new Map();
    this.articlesData = new Map();
    
    this.userIdCounter = 1;
    this.healthMetricIdCounter = 1;
    this.mealIdCounter = 1;
    this.workoutIdCounter = 1;
    this.exerciseIdCounter = 1;
    this.articleIdCounter = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...userData, id, createdAt };
    this.usersData.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = this.usersData.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  // Health metrics methods
  async createHealthMetric(metricData: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.healthMetricIdCounter++;
    const metric: HealthMetric = { ...metricData, id };
    this.healthMetricsData.set(id, metric);
    return metric;
  }
  
  async getHealthMetric(id: number): Promise<HealthMetric | undefined> {
    return this.healthMetricsData.get(id);
  }
  
  async getHealthMetricsByUserId(userId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetricsData.values()).filter(
      (metric) => metric.userId === userId
    );
  }
  
  async getLatestHealthMetric(userId: number): Promise<HealthMetric | undefined> {
    const userMetrics = await this.getHealthMetricsByUserId(userId);
    if (userMetrics.length === 0) return undefined;
    
    // Sort by date descending and return the most recent
    return userMetrics.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }
  
  // Meal methods
  async createMeal(mealData: InsertMeal): Promise<Meal> {
    const id = this.mealIdCounter++;
    const meal: Meal = { ...mealData, id };
    this.mealsData.set(id, meal);
    return meal;
  }
  
  async getMeal(id: number): Promise<Meal | undefined> {
    return this.mealsData.get(id);
  }
  
  async getMealsByUserId(userId: number): Promise<Meal[]> {
    return Array.from(this.mealsData.values()).filter(
      (meal) => meal.userId === userId
    );
  }
  
  async getMealRecommendations(userId: number): Promise<Meal[]> {
    // Get user data to personalize recommendations
    const user = await this.getUser(userId);
    if (!user) return [];
    
    // Get latest metrics
    const latestMetric = await this.getLatestHealthMetric(userId);
    
    // Use existing meals if available, otherwise create default recommendations
    const userMeals = await this.getMealsByUserId(userId);
    
    if (userMeals.length > 0) {
      return userMeals.slice(0, 3); // Return up to 3 existing meals
    } else {
      // Create default meal recommendations based on user goal
      const calculator = new Calculator();
      const height = user.height || 170;
      const weight = latestMetric?.weight || 75;
      const age = user.age || 30;
      const gender = user.gender || "male";
      const activityLevel = user.activityLevel || "moderate";
      const goal = user.goal || "maintenance";
      
      // Calculate daily calorie needs
      const bmr = calculator.calculateBMR(weight, height, age, gender);
      const tdee = calculator.calculateTDEE(bmr, activityLevel);
      const dailyCalories = calculator.calculateDailyCalories(tdee, goal);
      
      // Calculate macros
      const macros = calculator.calculateMacros(dailyCalories, goal);
      
      // Create default meal plan
      const breakfast: Meal = {
        id: this.mealIdCounter++,
        userId,
        name: "Breakfast",
        mealType: "breakfast",
        calories: Math.round(dailyCalories * 0.25), // 25% of daily calories
        protein: Math.round(macros.protein * 0.25),
        carbs: Math.round(macros.carbs * 0.25),
        fat: Math.round(macros.fat * 0.25),
        time: "7:00 AM - 8:00 AM",
        description: "Start your day with a nutritious meal",
        items: ["Oatmeal with berries", "2 eggs", "Green tea"]
      };
      
      const lunch: Meal = {
        id: this.mealIdCounter++,
        userId,
        name: "Lunch",
        mealType: "lunch",
        calories: Math.round(dailyCalories * 0.35), // 35% of daily calories
        protein: Math.round(macros.protein * 0.35),
        carbs: Math.round(macros.carbs * 0.35),
        fat: Math.round(macros.fat * 0.35),
        time: "12:30 PM - 1:30 PM",
        description: "Balanced mid-day meal for sustained energy",
        items: ["Grilled chicken salad", "Quinoa", "Avocado"]
      };
      
      const dinner: Meal = {
        id: this.mealIdCounter++,
        userId,
        name: "Dinner",
        mealType: "dinner",
        calories: Math.round(dailyCalories * 0.3), // 30% of daily calories
        protein: Math.round(macros.protein * 0.3),
        carbs: Math.round(macros.carbs * 0.3),
        fat: Math.round(macros.fat * 0.3),
        time: "7:00 PM - 8:00 PM",
        description: "Nutritious evening meal",
        items: ["Salmon fillet", "Steamed vegetables", "Brown rice"]
      };
      
      // Store the generated meals
      this.mealsData.set(breakfast.id, breakfast);
      this.mealsData.set(lunch.id, lunch);
      this.mealsData.set(dinner.id, dinner);
      
      return [breakfast, lunch, dinner];
    }
  }
  
  // Workout methods
  async createWorkout(workoutData: InsertWorkout): Promise<Workout> {
    const id = this.workoutIdCounter++;
    const workout: Workout = { ...workoutData, id };
    this.workoutsData.set(id, workout);
    return workout;
  }
  
  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workoutsData.get(id);
  }
  
  async getWorkoutsByUserId(userId: number): Promise<Workout[]> {
    return Array.from(this.workoutsData.values()).filter(
      (workout) => workout.userId === userId
    );
  }
  
  async getWorkoutRecommendations(userId: number): Promise<Workout> {
    // Get user data to personalize workout
    const user = await this.getUser(userId);
    if (!user) {
      // Default workout if user not found
      const defaultWorkout: Workout = {
        id: this.workoutIdCounter++,
        userId,
        name: "Full Body Strength",
        description: "A balanced full-body workout suitable for all fitness levels",
        duration: 45,
        caloriesBurned: 320,
        date: new Date().toISOString()
      };
      this.workoutsData.set(defaultWorkout.id, defaultWorkout);
      
      // Create default exercises
      this.createDefaultExercises(defaultWorkout.id);
      
      return defaultWorkout;
    }
    
    // Get user's workouts
    const userWorkouts = await this.getWorkoutsByUserId(userId);
    
    if (userWorkouts.length > 0) {
      // Return the most recent workout
      return userWorkouts[userWorkouts.length - 1];
    } else {
      // Create personalized workout based on user's goal and activity level
      let workoutName, workoutDescription, workoutDuration, caloriesBurned;
      
      switch (user.goal) {
        case "weight loss":
          workoutName = "Fat Burning HIIT";
          workoutDescription = "High-intensity interval training designed to maximize calorie burn";
          workoutDuration = 30;
          caloriesBurned = 350;
          break;
        case "muscle gain":
          workoutName = "Hypertrophy Focus";
          workoutDescription = "Targeted resistance training to build muscle mass";
          workoutDuration = 60;
          caloriesBurned = 400;
          break;
        default: // maintenance
          workoutName = "Full Body Strength";
          workoutDescription = "A balanced full-body workout to maintain fitness";
          workoutDuration = 45;
          caloriesBurned = 320;
      }
      
      // Create the workout
      const workout: Workout = {
        id: this.workoutIdCounter++,
        userId,
        name: workoutName,
        description: workoutDescription,
        duration: workoutDuration,
        caloriesBurned,
        date: new Date().toISOString()
      };
      
      this.workoutsData.set(workout.id, workout);
      
      // Create exercises for this workout
      this.createDefaultExercises(workout.id, user.goal);
      
      return workout;
    }
  }
  
  // Exercise methods
  async createExercise(exerciseData: InsertExercise): Promise<Exercise> {
    const id = this.exerciseIdCounter++;
    const exercise: Exercise = { ...exerciseData, id };
    this.exercisesData.set(id, exercise);
    return exercise;
  }
  
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercisesData.get(id);
  }
  
  async getExercisesByWorkoutId(workoutId: number): Promise<Exercise[]> {
    return Array.from(this.exercisesData.values()).filter(
      (exercise) => exercise.workoutId === workoutId
    );
  }
  
  // Article methods
  async createArticle(articleData: InsertArticle): Promise<Article> {
    const id = this.articleIdCounter++;
    const article: Article = { ...articleData, id };
    this.articlesData.set(id, article);
    return article;
  }
  
  async getArticle(id: number): Promise<Article | undefined> {
    return this.articlesData.get(id);
  }
  
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articlesData.values());
  }
  
  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articlesData.values()).filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Helper methods
  private createDefaultExercises(workoutId: number, goal: string = "maintenance"): void {
    if (goal === "weight loss") {
      // High rep, cardio-focused exercises for weight loss
      const exercises = [
        { name: "Jumping Jacks", sets: 3, reps: 30, notes: "Full range of motion, moderate pace" },
        { name: "Mountain Climbers", sets: 3, reps: 20, notes: "Keep core tight, alternate legs quickly" },
        { name: "Burpees", sets: 3, reps: 15, notes: "Full extension at top, chest to floor at bottom" },
        { name: "High Knees", sets: 3, duration: 45, notes: "45 seconds of high knees, drive knees up" }
      ];
      
      exercises.forEach(ex => {
        this.createExercise({
          workoutId,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          notes: ex.notes
        });
      });
    } else if (goal === "muscle gain") {
      // Heavier, strength-focused exercises for muscle gain
      const exercises = [
        { name: "Barbell Squats", sets: 4, reps: 8, notes: "Focus on form, keep chest up" },
        { name: "Bench Press", sets: 4, reps: 8, notes: "Control the weight, full range of motion" },
        { name: "Bent-Over Rows", sets: 4, reps: 10, notes: "Squeeze shoulder blades at top" },
        { name: "Shoulder Press", sets: 3, reps: 10, notes: "Press directly overhead, avoid arching back" }
      ];
      
      exercises.forEach(ex => {
        this.createExercise({
          workoutId,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          notes: ex.notes
        });
      });
    } else {
      // Balanced exercises for maintenance
      const exercises = [
        { name: "Push-ups", sets: 3, reps: 12, notes: "Keep body straight, lower chest to ground" },
        { name: "Squats", sets: 4, reps: 15, notes: "Keep weight in heels, knees track over toes" },
        { name: "Plank", sets: 3, duration: 60, notes: "Hold for 60 seconds, keep body in straight line" }
      ];
      
      exercises.forEach(ex => {
        this.createExercise({
          workoutId,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          notes: ex.notes
        });
      });
    }
  }
  
  private initializeData(): void {
    // Create a default user
    const user: User = {
      id: this.userIdCounter++,
      username: "johnsmith",
      password: "password123", // This would be hashed in a real app
      firstName: "John",
      lastName: "Smith",
      email: "john@example.com",
      age: 32,
      gender: "male",
      height: 178, // cm
      activityLevel: "moderate",
      goal: "weight loss",
      createdAt: new Date()
    };
    this.usersData.set(user.id, user);
    
    // Create health metrics
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const healthMetric1: HealthMetric = {
      id: this.healthMetricIdCounter++,
      userId: user.id,
      date: twoDaysAgo.toISOString(),
      weight: 77,
      bmi: 24.3,
      bodyFat: 22,
      waterIntake: 1.5,
      caloriesConsumed: 2100,
      caloriesBurned: 350,
      steps: 7500
    };
    
    const healthMetric2: HealthMetric = {
      id: this.healthMetricIdCounter++,
      userId: user.id,
      date: yesterday.toISOString(),
      weight: 76.5,
      bmi: 24.1,
      bodyFat: 21.5,
      waterIntake: 1.8,
      caloriesConsumed: 1950,
      caloriesBurned: 420,
      steps: 8200
    };
    
    const healthMetric3: HealthMetric = {
      id: this.healthMetricIdCounter++,
      userId: user.id,
      date: today.toISOString(),
      weight: 75,
      bmi: 23.7,
      bodyFat: 21,
      waterIntake: 2.1,
      caloriesConsumed: 1850,
      caloriesBurned: 380,
      steps: 9100
    };
    
    this.healthMetricsData.set(healthMetric1.id, healthMetric1);
    this.healthMetricsData.set(healthMetric2.id, healthMetric2);
    this.healthMetricsData.set(healthMetric3.id, healthMetric3);
    
    // Create sample articles
    const article1: Article = {
      id: this.articleIdCounter++,
      title: "Balanced Diet Essentials",
      content: "A well-balanced diet is crucial for overall health and fitness. This article explores the fundamentals of nutrition and how various food groups contribute to your well-being.\n\nProtein is essential for muscle repair and growth. Good sources include lean meats, fish, eggs, dairy, and plant-based options like beans and tofu.\n\nCarbohydrates provide energy for daily activities and exercise. Focus on complex carbs from whole grains, fruits, and vegetables rather than simple sugars.\n\nHealthy fats support hormone production and nutrient absorption. Include sources like avocados, nuts, seeds, and olive oil in your diet.\n\nDon't forget about micronutrients! Vitamins and minerals play crucial roles in various bodily functions. Eat a colorful variety of fruits and vegetables to ensure you're getting a wide range of these essential nutrients.",
      category: "Nutrition",
      readTime: 5,
      imageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe"
    };
    
    const article2: Article = {
      id: this.articleIdCounter++,
      title: "Proper Stretching Techniques",
      content: "Stretching is a vital component of any fitness routine, but many people perform stretches incorrectly, limiting their effectiveness or even risking injury.\n\nDynamic stretching involves moving parts of your body through a full range of motion. These stretches are ideal before workouts as they warm up your muscles and prepare them for activity. Examples include arm circles, leg swings, and walking lunges.\n\nStatic stretching involves holding a position for a period of time, typically 15-60 seconds. These stretches are best performed after exercise when your muscles are warm. Focus on breathing deeply and relaxing into each stretch rather than bouncing.\n\nFor optimal flexibility development, stretch regularly—not just before or after workouts. Consistency is key to improving your range of motion over time.\n\nAlways listen to your body. Stretching should create a feeling of tension, not pain. If you feel sharp pain, back off immediately to avoid injury.",
      category: "Workout",
      readTime: 7,
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
    };
    
    const article3: Article = {
      id: this.articleIdCounter++,
      title: "Meal Prep Strategies",
      content: "Meal preparation is one of the most effective strategies for maintaining a healthy diet while saving time and money.\n\nStart by planning your meals for the week, focusing on balanced nutrition with adequate protein, complex carbohydrates, and healthy fats. Create a shopping list based on your meal plan to avoid impulse purchases.\n\nDesignate a specific day or time for meal prep. Many people find Sunday afternoons work well, as it prepares them for the week ahead. Batch cooking proteins like chicken, beef, or beans can save significant time.\n\nInvest in quality food storage containers that are microwave-safe and leak-proof. Consider containers with compartments to keep different foods separated.\n\nNot all foods keep well for the same amount of time. Some meals can be prepared fully in advance, while others may need components stored separately and assembled just before eating. Leafy greens and dressed salads, for instance, are best prepared closer to consumption.\n\nKeep your meal prep interesting by rotating recipes regularly and experimenting with different seasonings and flavors to prevent meal fatigue.",
      category: "Tips",
      readTime: 6,
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
    };
    
    this.articlesData.set(article1.id, article1);
    this.articlesData.set(article2.id, article2);
    this.articlesData.set(article3.id, article3);
    
    // Create a sample workout
    const workout: Workout = {
      id: this.workoutIdCounter++,
      userId: user.id,
      name: "Full Body Strength",
      description: "A balanced full-body workout suitable for all fitness levels",
      duration: 45,
      caloriesBurned: 320,
      date: new Date().toISOString()
    };
    this.workoutsData.set(workout.id, workout);
    
    // Create exercises for the workout
    const exercise1: Exercise = {
      id: this.exerciseIdCounter++,
      workoutId: workout.id,
      name: "Push-ups",
      sets: 3,
      reps: 12,
      notes: "Keep body straight, lower chest to ground"
    };
    
    const exercise2: Exercise = {
      id: this.exerciseIdCounter++,
      workoutId: workout.id,
      name: "Squats",
      sets: 4,
      reps: 15,
      notes: "Keep weight in heels, knees track over toes"
    };
    
    const exercise3: Exercise = {
      id: this.exerciseIdCounter++,
      workoutId: workout.id,
      name: "Plank",
      sets: 3,
      duration: 60,
      notes: "Hold for 60 seconds, keep body in straight line"
    };
    
    this.exercisesData.set(exercise1.id, exercise1);
    this.exercisesData.set(exercise2.id, exercise2);
    this.exercisesData.set(exercise3.id, exercise3);
  }
}

export const storage = new MemStorage();
