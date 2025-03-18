import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display in format like "Mon, June 12"
export function formatDate(date: Date | string): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

// Format time to display in format like "8:00 AM"
export function formatTime(time: string): string {
  if (!time) return "";
  
  // If time is already in the format "8:00 AM", return it
  if (time.includes(" ")) return time;
  
  // If time is in 24-hour format like "17:00", convert to "5:00 PM"
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${minute} ${ampm}`;
}

// Capitalize the first letter of a string
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate BMI from weight (kg) and height (cm)
export function calculateBMI(weight: number, height: number): number {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

// Get BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi >= 18.5 && bmi < 25) return "Normal";
  if (bmi >= 25 && bmi < 30) return "Overweight";
  return "Obese";
}

// Calculate calories based on weight, height, age, gender, and activity level
export function calculateCalories(
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female",
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
): number {
  // Basic BMR calculation using Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days per week
    moderate: 1.55, // Moderate exercise 3-5 days per week
    active: 1.725, // Hard exercise 6-7 days per week
    very_active: 1.9, // Very hard exercise & physical job or training twice a day
  };
  
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

// Format a number with a + or - sign
export function formatChangeNumber(num: number): string {
  if (num > 0) return `+${num}`;
  return `${num}`;
}

// Calculate progress percentage between current and target
export function calculateProgressPercentage(current: number, target: number, start: number): number {
  if (target === start) return 100; // Avoid division by zero
  
  // For weight loss goals (where target < start)
  if (target < start) {
    const totalChange = start - target;
    const currentChange = start - current;
    return Math.min(100, Math.max(0, Math.round((currentChange / totalChange) * 100)));
  }
  
  // For weight gain or other increasing goals (where target > start)
  const totalChange = target - start;
  const currentChange = current - start;
  return Math.min(100, Math.max(0, Math.round((currentChange / totalChange) * 100)));
}
