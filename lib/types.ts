export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  created_at: string;
}

export interface Patient {
  id: number;
  doctor_id: number;
  full_name: string;
  age: number;
  gender: string;
  height_cm: number | null;
  weight_kg: number | null;
  dietary_habit: string;
  bowel_movement: string;
  water_intake: string;
  health_condition: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: number;
  name: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  rasa: string;
  virya: string;
  digestibility: string;
  description: string;
  is_vegetarian: boolean;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  category: string;
  ingredients?: RecipeIngredient[];
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
  food_item_id: number;
  quantity_grams: number;
  food_item?: FoodItem;
}

export interface DietChart {
  id: number;
  doctor_id: number;
  patient_id: number;
  title: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  items?: DietChartItem[];
}

export interface DietChartItem {
  id: number;
  diet_chart_id: number;
  food_item_id: number;
  meal_type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  quantity_grams: number;
  notes: string | null;
  food_item?: FoodItem;
}

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AyurvedicSummary {
  dominantRasa: string;
  viryaBalance: { hot: number; cold: number };
  digestibilityBreakdown: { easy: number; moderate: number; heavy: number };
}
