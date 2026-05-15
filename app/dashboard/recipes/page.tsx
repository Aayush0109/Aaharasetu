"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UtensilsCrossed, ChevronRight, Flame, Droplets } from "lucide-react";
import type { Recipe } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface RecipeIngredientFull {
  id: number;
  recipe_id: number;
  food_item_id: number;
  quantity_grams: number;
  food_name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  rasa: string;
  virya: string;
  digestibility: string;
}

interface RecipeFull extends Recipe {
  ingredients: RecipeIngredientFull[];
}

export default function RecipesPage() {
  const { data: recipes = [], isLoading } = useSWR<RecipeFull[]>("/api/recipes", fetcher);
  const [selected, setSelected] = useState<RecipeFull | null>(null);

  function getRecipeNutrition(recipe: RecipeFull) {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    for (const ing of recipe.ingredients) {
      const ratio = Number(ing.quantity_grams) / 100;
      calories += Number(ing.calories_per_100g) * ratio;
      protein += Number(ing.protein_per_100g) * ratio;
      carbs += Number(ing.carbs_per_100g) * ratio;
      fat += Number(ing.fat_per_100g) * ratio;
    }
    return { calories, protein, carbs, fat };
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Recipes</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Predefined Ayurvedic recipe combinations
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-12 text-center">
            <UtensilsCrossed className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No recipes available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => {
            const nutrition = getRecipeNutrition(recipe);
            return (
              <Card
                key={recipe.id}
                className="border-border/60 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelected(recipe)}
              >
                <CardContent className="py-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{recipe.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{recipe.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{recipe.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {recipe.ingredients?.length || 0} ingredients
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center pt-1 border-t border-border/50">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{Math.round(nutrition.calories)}</p>
                      <p className="text-[10px] text-muted-foreground">kcal</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{nutrition.protein.toFixed(1)}g</p>
                      <p className="text-[10px] text-muted-foreground">Protein</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{nutrition.carbs.toFixed(1)}g</p>
                      <p className="text-[10px] text-muted-foreground">Carbs</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{nutrition.fat.toFixed(1)}g</p>
                      <p className="text-[10px] text-muted-foreground">Fat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recipe detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && <RecipeDetail recipe={selected} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RecipeDetail({ recipe }: { recipe: RecipeFull }) {
  let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">{recipe.description}</p>

      {recipe.instructions && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Instructions</p>
          <p className="text-sm text-foreground">{recipe.instructions}</p>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Ingredients</p>
        <div className="flex flex-col gap-2">
          {recipe.ingredients.map((ing) => {
            const ratio = Number(ing.quantity_grams) / 100;
            const cals = Number(ing.calories_per_100g) * ratio;
            totalCal += cals;
            totalProtein += Number(ing.protein_per_100g) * ratio;
            totalCarbs += Number(ing.carbs_per_100g) * ratio;
            totalFat += Number(ing.fat_per_100g) * ratio;

            return (
              <div key={ing.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{ing.food_name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{Math.round(cals)} kcal</span>
                    <span className={`inline-flex items-center gap-0.5 text-[10px] ${ing.virya === "Hot" ? "text-red-600" : "text-sky-600"}`}>
                      {ing.virya === "Hot" ? <Flame className="w-2.5 h-2.5" /> : <Droplets className="w-2.5 h-2.5" />}
                      {ing.virya}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs shrink-0">{Number(ing.quantity_grams)}g</Badge>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5 text-center">
          <p className="text-base font-bold text-foreground">{Math.round(totalCal)}</p>
          <p className="text-[10px] text-muted-foreground">Total kcal</p>
        </div>
        <div className="rounded-lg bg-secondary p-2.5 text-center">
          <p className="text-base font-bold text-foreground">{totalProtein.toFixed(1)}g</p>
          <p className="text-[10px] text-muted-foreground">Protein</p>
        </div>
        <div className="rounded-lg bg-secondary p-2.5 text-center">
          <p className="text-base font-bold text-foreground">{totalCarbs.toFixed(1)}g</p>
          <p className="text-[10px] text-muted-foreground">Carbs</p>
        </div>
        <div className="rounded-lg bg-secondary p-2.5 text-center">
          <p className="text-base font-bold text-foreground">{totalFat.toFixed(1)}g</p>
          <p className="text-[10px] text-muted-foreground">Fat</p>
        </div>
      </div>
    </div>
  );
}
