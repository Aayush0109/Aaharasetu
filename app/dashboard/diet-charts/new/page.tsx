"use client";

import React from "react"

import { useState, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  Loader2,
  Save,
  Flame,
  Droplets,
  UtensilsCrossed,
  Coffee,
  Sun,
  Moon,
  Cookie,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { FoodItem, Patient, MealType, Recipe } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ChartItem {
  food_item_id: number;
  food_item: FoodItem;
  meal_type: MealType;
  quantity_grams: number;
  notes: string;
}

const MEAL_ICONS: Record<MealType, React.ComponentType<{ className?: string }>> = {
  Breakfast: Coffee,
  Lunch: Sun,
  Snack: Cookie,
  Dinner: Moon,
};

const MEAL_ORDER: MealType[] = ["Breakfast", "Lunch", "Snack", "Dinner"];

function DietChartBuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatient = searchParams.get("patient") || "";

  const { data: patients = [] } = useSWR<Patient[]>("/api/patients", fetcher);
  const { data: foods = [] } = useSWR<FoodItem[]>("/api/food-items", fetcher);
  const { data: recipes = [] } = useSWR<Recipe[]>("/api/recipes", fetcher);

  const [patientId, setPatientId] = useState(preselectedPatient);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ChartItem[]>([]);
  const [saving, setSaving] = useState(false);

  // Food search dialog
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("Breakfast");
  const [foodSearch, setFoodSearch] = useState("");
  const [showRecipes, setShowRecipes] = useState(false);

  function openFoodSearch(meal: MealType) {
    setActiveMealType(meal);
    setFoodSearch("");
    setShowFoodSearch(true);
    setShowRecipes(false);
  }

  function addFoodItem(food: FoodItem, quantity: number = 100) {
    setItems((prev) => [
      ...prev,
      {
        food_item_id: food.id,
        food_item: food,
        meal_type: activeMealType,
        quantity_grams: quantity,
        notes: "",
      },
    ]);
  }

  function addRecipe(recipe: Recipe) {
    if (!recipe.ingredients) return;
    const newItems: ChartItem[] = recipe.ingredients.map((ing) => ({
      food_item_id: ing.food_item_id,
      food_item: foods.find((f) => f.id === ing.food_item_id) || ({
        id: ing.food_item_id,
        name: (ing as Record<string, unknown>).food_name as string || "Unknown",
        calories_per_100g: Number((ing as Record<string, unknown>).calories_per_100g) || 0,
        protein_per_100g: Number((ing as Record<string, unknown>).protein_per_100g) || 0,
        carbs_per_100g: Number((ing as Record<string, unknown>).carbs_per_100g) || 0,
        fat_per_100g: Number((ing as Record<string, unknown>).fat_per_100g) || 0,
        rasa: (ing as Record<string, unknown>).rasa as string || "Sweet",
        virya: (ing as Record<string, unknown>).virya as string || "Cold",
        digestibility: (ing as Record<string, unknown>).digestibility as string || "Easy",
      } as FoodItem),
      meal_type: activeMealType,
      quantity_grams: Number(ing.quantity_grams),
      notes: `From recipe: ${recipe.name}`,
    }));
    setItems((prev) => [...prev, ...newItems]);
    setShowFoodSearch(false);
    toast.success(`Added "${recipe.name}" ingredients`);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuantity(index: number, qty: number) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity_grams: qty } : item)));
  }

  // Nutrition calculations
  const mealGroups = useMemo(() => {
    const groups: Record<MealType, ChartItem[]> = {
      Breakfast: [],
      Lunch: [],
      Snack: [],
      Dinner: [],
    };
    for (const item of items) {
      groups[item.meal_type].push(item);
    }
    return groups;
  }, [items]);

  const calculateNutrition = useCallback((chartItems: ChartItem[]) => {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    for (const item of chartItems) {
      const ratio = item.quantity_grams / 100;
      calories += Number(item.food_item.calories_per_100g) * ratio;
      protein += Number(item.food_item.protein_per_100g) * ratio;
      carbs += Number(item.food_item.carbs_per_100g) * ratio;
      fat += Number(item.food_item.fat_per_100g) * ratio;
    }
    return { calories, protein, carbs, fat };
  }, []);

  const totalNutrition = useMemo(() => calculateNutrition(items), [items, calculateNutrition]);

  const ayurvedicSummary = useMemo(() => {
    if (items.length === 0) return null;
    const rasaCounts: Record<string, number> = {};
    let hotCount = 0, coldCount = 0;
    let easyCount = 0, moderateCount = 0, heavyCount = 0;

    for (const item of items) {
      const rasa = item.food_item.rasa;
      rasaCounts[rasa] = (rasaCounts[rasa] || 0) + 1;
      if (item.food_item.virya === "Hot") hotCount++;
      else coldCount++;
      if (item.food_item.digestibility === "Easy") easyCount++;
      else if (item.food_item.digestibility === "Moderate") moderateCount++;
      else heavyCount++;
    }

    const dominantRasa = Object.entries(rasaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    return { dominantRasa, hotCount, coldCount, easyCount, moderateCount, heavyCount };
  }, [items]);

  const filteredFoods = useMemo(() => {
    if (!foodSearch) return foods;
    return foods.filter((f) => f.name.toLowerCase().includes(foodSearch.toLowerCase()));
  }, [foods, foodSearch]);

  async function handleSave() {
    if (!patientId) return toast.error("Please select a patient");
    if (!title) return toast.error("Please enter a chart title");
    if (items.length === 0) return toast.error("Please add at least one food item");

    setSaving(true);
    try {
      const res = await fetch("/api/diet-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: Number(patientId),
          title,
          notes,
          items: items.map((item) => ({
            food_item_id: item.food_item_id,
            meal_type: item.meal_type,
            quantity_grams: item.quantity_grams,
            notes: item.notes,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
        setSaving(false);
        return;
      }

      const chart = await res.json();
      toast.success("Diet chart created successfully");
      router.push(`/dashboard/diet-charts/${chart.id}`);
    } catch {
      toast.error("Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/diet-charts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create Diet Chart</h1>
          <p className="text-sm text-muted-foreground">Build an Ayurvedic diet plan for your patient</p>
        </div>
      </div>

      {/* Chart info */}
      <Card className="border-border/60">
        <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Patient *</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.full_name} ({p.age}y, {p.gender})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Chart Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Diet Plan - Weight Management"
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes for this diet chart..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Meal sections */}
      {MEAL_ORDER.map((mealType) => {
        const MealIcon = MEAL_ICONS[mealType];
        const mealItems = mealGroups[mealType];
        const mealNutrition = calculateNutrition(mealItems);

        return (
          <Card key={mealType} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MealIcon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">{mealType}</CardTitle>
                  {mealItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(mealNutrition.calories)} kcal
                    </Badge>
                  )}
                </div>
                <Button size="sm" variant="outline" onClick={() => openFoodSearch(mealType)}>
                  <Plus className="w-3.5 h-3.5" />
                  Add Food
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mealItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No items added yet. Click "Add Food" to get started.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {mealItems.map((item, idx) => {
                    const globalIdx = items.indexOf(item);
                    const ratio = item.quantity_grams / 100;
                    return (
                      <div key={globalIdx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.food_item.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {Math.round(Number(item.food_item.calories_per_100g) * ratio)} kcal
                            </span>
                            <span className="text-xs text-muted-foreground">
                              P: {(Number(item.food_item.protein_per_100g) * ratio).toFixed(1)}g
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 italic">{item.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Input
                            type="number"
                            className="w-20 h-8 text-xs text-center"
                            value={item.quantity_grams}
                            onChange={(e) => updateQuantity(globalIdx, Number(e.target.value) || 0)}
                            min={1}
                          />
                          <span className="text-xs text-muted-foreground">g</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(globalIdx)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Summary */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Nutritional summary */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nutritional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="rounded-lg bg-primary/10 p-3">
                  <p className="text-lg font-bold text-foreground">{Math.round(totalNutrition.calories)}</p>
                  <p className="text-[10px] text-muted-foreground">Total kcal</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-lg font-bold text-foreground">{totalNutrition.protein.toFixed(1)}g</p>
                  <p className="text-[10px] text-muted-foreground">Protein</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-lg font-bold text-foreground">{totalNutrition.carbs.toFixed(1)}g</p>
                  <p className="text-[10px] text-muted-foreground">Carbs</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-lg font-bold text-foreground">{totalNutrition.fat.toFixed(1)}g</p>
                  <p className="text-[10px] text-muted-foreground">Fat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ayurvedic summary */}
          {ayurvedicSummary && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ayurvedic Analysis</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dominant Rasa</span>
                  <Badge variant="secondary">{ayurvedicSummary.dominantRasa}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Virya Balance</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-red-600">
                      <Flame className="w-3 h-3" /> {ayurvedicSummary.hotCount} Hot
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-sky-600">
                      <Droplets className="w-3 h-3" /> {ayurvedicSummary.coldCount} Cold
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Digestibility</span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[10px] border-green-200 text-green-700">E: {ayurvedicSummary.easyCount}</Badge>
                    <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700">M: {ayurvedicSummary.moderateCount}</Badge>
                    <Badge variant="outline" className="text-[10px] border-red-200 text-red-700">H: {ayurvedicSummary.heavyCount}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end gap-3 pb-8">
        <Link href="/dashboard/diet-charts">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Diet Chart
        </Button>
      </div>

      {/* Food search dialog */}
      <Dialog open={showFoodSearch} onOpenChange={setShowFoodSearch}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add to {activeMealType}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant={showRecipes ? "outline" : "default"}
              size="sm"
              onClick={() => setShowRecipes(false)}
            >
              Foods
            </Button>
            <Button
              variant={showRecipes ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRecipes(true)}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              Recipes
            </Button>
          </div>

          {showRecipes ? (
            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {recipes.map((recipe) => (
                <button
                  key={recipe.id}
                  type="button"
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary/60 transition-colors"
                  onClick={() => addRecipe(recipe)}
                >
                  <p className="text-sm font-medium text-foreground">{recipe.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{recipe.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="text-[10px]">{recipe.category}</Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {recipe.ingredients?.length || 0} ingredients
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search foods..."
                  className="pl-10"
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 mt-2">
                {filteredFoods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    className="w-full text-left p-3 rounded-lg hover:bg-secondary/60 transition-colors flex items-center gap-3"
                    onClick={() => {
                      addFoodItem(food);
                      toast.success(`Added ${food.name}`);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{food.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(Number(food.calories_per_100g))} kcal | {food.rasa} | {food.virya}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NewDietChartPage() {
  return (
    <Suspense fallback={null}>
      <DietChartBuilderInner />
    </Suspense>
  );
}
