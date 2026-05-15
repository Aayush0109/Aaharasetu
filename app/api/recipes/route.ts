import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const recipes = await sql`SELECT * FROM recipes ORDER BY name`;

  const recipesWithIngredients = await Promise.all(
    recipes.map(async (recipe) => {
      const ingredients = await sql`
        SELECT ri.*, fi.name as food_name, fi.calories_per_100g, fi.protein_per_100g,
               fi.carbs_per_100g, fi.fat_per_100g, fi.rasa, fi.virya, fi.digestibility
        FROM recipe_ingredients ri
        JOIN food_items fi ON fi.id = ri.food_item_id
        WHERE ri.recipe_id = ${recipe.id}`;
      return { ...recipe, ingredients };
    })
  );

  return NextResponse.json(recipesWithIngredients);
}
