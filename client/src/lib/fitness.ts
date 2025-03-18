/**
 * Fitness Calculator Class
 * Provides utility functions for fitness and health calculations
 */
export class Calculator {
  /**
   * Calculate Body Mass Index (BMI)
   * Formula: weight (kg) / (height (m))^2
   * 
   * @param weight Weight in kilograms
   * @param height Height in meters
   * @returns Calculated BMI rounded to 1 decimal place
   */
  calculateBMI(weight: number, height: number): number {
    const bmi = weight / (height * height);
    return Math.round(bmi * 10) / 10;
  }
  
  /**
   * Get BMI Category based on BMI value
   * 
   * @param bmi Body Mass Index value
   * @returns String representing the BMI category
   */
  getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }
  
  /**
   * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
   * 
   * @param weight Weight in kilograms
   * @param height Height in centimeters
   * @param age Age in years
   * @param gender 'male' or 'female'
   * @returns BMR in calories per day
   */
  calculateBMR(weight: number, height: number, age: number, gender: string): number {
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }
  
  /**
   * Calculate Total Daily Energy Expenditure (TDEE)
   * 
   * @param bmr Basal Metabolic Rate
   * @param activityLevel Activity level factor
   * @returns TDEE in calories per day
   */
  calculateTDEE(bmr: number, activityLevel: string): number {
    const activityFactors: Record<string, number> = {
      "sedentary": 1.2,      // Little or no exercise
      "light": 1.375,        // Light exercise 1-3 days/week
      "moderate": 1.55,      // Moderate exercise 3-5 days/week
      "active": 1.725,       // Hard exercise 6-7 days/week
      "very active": 1.9     // Very hard exercise & physical job
    };
    
    const factor = activityFactors[activityLevel] || 1.2;
    return bmr * factor;
  }
  
  /**
   * Calculate daily calorie target based on fitness goal
   * 
   * @param tdee Total Daily Energy Expenditure
   * @param goal Fitness goal (weight loss, maintenance, muscle gain)
   * @returns Daily calorie target
   */
  calculateDailyCalories(tdee: number, goal: string): number {
    let dailyCalories = tdee;
    
    switch (goal) {
      case "weight loss":
        dailyCalories = tdee - 500; // Deficit of 500 calories
        break;
      case "muscle gain":
        dailyCalories = tdee + 300; // Surplus of 300 calories
        break;
      // For maintenance, TDEE is already correct
    }
    
    // Round to nearest 10
    return Math.round(dailyCalories / 10) * 10;
  }
  
  /**
   * Calculate ideal macronutrient distribution based on goal
   * 
   * @param calories Total daily calories
   * @param goal Fitness goal
   * @returns Object containing protein, carbs, and fat in grams
   */
  calculateMacros(calories: number, goal: string): { protein: number, carbs: number, fat: number } {
    let proteinPercent, carbsPercent, fatPercent;
    
    switch (goal) {
      case "weight loss":
        proteinPercent = 0.4;  // 40% protein
        carbsPercent = 0.3;    // 30% carbs
        fatPercent = 0.3;      // 30% fat
        break;
      case "muscle gain":
        proteinPercent = 0.3;  // 30% protein
        carbsPercent = 0.5;    // 50% carbs
        fatPercent = 0.2;      // 20% fat
        break;
      default: // maintenance
        proteinPercent = 0.3;  // 30% protein
        carbsPercent = 0.4;    // 40% carbs
        fatPercent = 0.3;      // 30% fat
    }
    
    // Calculate grams based on caloric distribution
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    const protein = Math.round((calories * proteinPercent) / 4);
    const carbs = Math.round((calories * carbsPercent) / 4);
    const fat = Math.round((calories * fatPercent) / 9);
    
    return { protein, carbs, fat };
  }
  
  /**
   * Calculate body fat percentage using U.S. Navy method
   * Note: This is a simplified version and not as accurate as direct measurements
   * 
   * @param waist Waist circumference in cm
   * @param neck Neck circumference in cm
   * @param height Height in cm
   * @param gender 'male' or 'female'
   * @param hip Hip circumference in cm (only needed for females)
   * @returns Estimated body fat percentage
   */
  calculateBodyFat(waist: number, neck: number, height: number, gender: string, hip?: number): number {
    if (gender === "male") {
      const bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      return Math.round(bodyFat * 10) / 10;
    } else if (gender === "female" && hip) {
      const bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
      return Math.round(bodyFat * 10) / 10;
    }
    return 0;
  }
  
  /**
   * Calculate ideal weight range based on BMI
   * 
   * @param height Height in meters
   * @returns Object containing the min and max ideal weight in kg
   */
  calculateIdealWeightRange(height: number): { min: number, max: number } {
    // Healthy BMI range is 18.5-24.9
    const minWeight = 18.5 * (height * height);
    const maxWeight = 24.9 * (height * height);
    
    return {
      min: Math.round(minWeight * 10) / 10,
      max: Math.round(maxWeight * 10) / 10
    };
  }
  
  /**
   * Calculate water intake recommendation
   * 
   * @param weight Weight in kilograms
   * @param activityLevel Activity level
   * @returns Recommended water intake in liters
   */
  calculateWaterIntake(weight: number, activityLevel: string): number {
    // Base recommendation: 30-35 ml per kg of body weight
    let baseWater = weight * 0.033; // 33 ml per kg
    
    // Adjust based on activity level
    const activityFactors: Record<string, number> = {
      "sedentary": 0,
      "light": 0.3,
      "moderate": 0.5,
      "active": 0.7,
      "very active": 1.0
    };
    
    const activityAdjustment = activityFactors[activityLevel] || 0;
    
    // Add activity adjustment (in liters)
    baseWater += activityAdjustment;
    
    // Round to one decimal place
    return Math.round(baseWater * 10) / 10;
  }
}
