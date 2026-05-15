"use client";

import React from "react"

import { use, useMemo, useRef } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileDown,
  Trash2,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Flame,
  Droplets,
  Leaf,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import type { DietChartItem, MealType } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const MEAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Breakfast: Coffee,
  Lunch: Sun,
  Snack: Cookie,
  Dinner: Moon,
};

interface ChartData {
  id: number;
  title: string;
  notes: string | null;
  created_at: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  height_cm: number | null;
  weight_kg: number | null;
  dietary_habit: string;
  health_condition: string | null;
  items: (DietChartItem & {
    food_name: string;
    category: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    rasa: string;
    virya: string;
    digestibility: string;
    is_vegetarian: boolean;
  })[];
}

export default function DietChartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: chart, isLoading } = useSWR<ChartData>(`/api/diet-charts/${id}`, fetcher);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const mealGroups = useMemo(() => {
    if (!chart?.items) return {};
    const groups: Record<string, typeof chart.items> = {};
    for (const item of chart.items) {
      if (!groups[item.meal_type]) groups[item.meal_type] = [];
      groups[item.meal_type].push(item);
    }
    return groups;
  }, [chart]);

  const totalNutrition = useMemo(() => {
    if (!chart?.items) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    for (const item of chart.items) {
      const ratio = Number(item.quantity_grams) / 100;
      calories += Number(item.calories_per_100g) * ratio;
      protein += Number(item.protein_per_100g) * ratio;
      carbs += Number(item.carbs_per_100g) * ratio;
      fat += Number(item.fat_per_100g) * ratio;
    }
    return { calories, protein, carbs, fat };
  }, [chart]);

  const ayurvedicSummary = useMemo(() => {
    if (!chart?.items || chart.items.length === 0) return null;
    const rasaCounts: Record<string, number> = {};
    let hotCount = 0, coldCount = 0;
    for (const item of chart.items) {
      rasaCounts[item.rasa] = (rasaCounts[item.rasa] || 0) + 1;
      if (item.virya === "Hot") hotCount++;
      else coldCount++;
    }
    const dominantRasa = Object.entries(rasaCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    return { dominantRasa, hotCount, coldCount };
  }, [chart]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this diet chart?")) return;
    await fetch(`/api/diet-charts/${id}`, { method: "DELETE" });
    toast.success("Diet chart deleted");
    router.push("/dashboard/diet-charts");
  }

  function handleExportPDF() {
    if (!printRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${chart?.title || "Diet Chart"} - AharaSetu</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; color: #2B2B2B; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; padding-bottom: 16px; border-bottom: 2px solid #2E8B57; }
          .logo { width: 40px; height: 40px; background: #2E8B57; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: bold; }
          .brand { font-size: 22px; font-weight: 700; color: #2E8B57; }
          .brand-sub { font-size: 11px; color: #888; }
          .title { font-size: 18px; font-weight: 700; margin: 20px 0 8px; }
          .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 12px; background: #f9f6f1; border-radius: 8px; margin-bottom: 20px; }
          .patient-info p { font-size: 13px; }
          .patient-info strong { color: #2E8B57; }
          .date { font-size: 12px; color: #888; margin-bottom: 16px; }
          .meal-section { margin-bottom: 20px; }
          .meal-title { font-size: 15px; font-weight: 600; color: #2E8B57; margin-bottom: 8px; padding: 6px 0; border-bottom: 1px solid #e8e0d6; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 4px; }
          th { text-align: left; padding: 6px 8px; background: #f5f0ea; font-weight: 600; font-size: 11px; text-transform: uppercase; color: #666; }
          td { padding: 6px 8px; border-bottom: 1px solid #f0ebe5; }
          .meal-total { text-align: right; font-size: 12px; color: #888; padding: 4px 8px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 20px 0; }
          .summary-box { text-align: center; padding: 12px; background: #f9f6f1; border-radius: 8px; }
          .summary-box .value { font-size: 20px; font-weight: 700; color: #2B2B2B; }
          .summary-box .label { font-size: 10px; color: #888; text-transform: uppercase; }
          .ayurveda-section { padding: 12px; background: #f0f7f3; border-radius: 8px; margin: 16px 0; }
          .ayurveda-section h3 { font-size: 14px; color: #2E8B57; margin-bottom: 8px; }
          .ayurveda-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
          .notes-section { padding: 12px; background: #fffbf5; border-radius: 8px; border: 1px solid #f0ebe5; margin-top: 16px; }
          .notes-section h3 { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
          .notes-section p { font-size: 12px; color: #666; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e8e0d6; text-align: center; font-size: 11px; color: #999; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        ${printRef.current.innerHTML}
        <div class="footer">Generated by AharaSetu - Ayurvedic Diet Management System</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Diet chart not found</p>
        <Link href="/dashboard/diet-charts">
          <Button variant="outline" className="mt-4 bg-transparent">Back to Diet Charts</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/diet-charts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{chart.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="secondary" className="text-xs">{chart.patient_name}</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(chart.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Patient card */}
      <Card className="border-border/60">
        <CardContent className="py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="font-medium text-foreground">{chart.patient_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age / Gender</p>
              <p className="font-medium text-foreground">{chart.patient_age}y, {chart.patient_gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Diet Type</p>
              <p className="font-medium text-foreground">{chart.dietary_habit}</p>
            </div>
            {chart.health_condition && (
              <div>
                <p className="text-xs text-muted-foreground">Condition</p>
                <p className="font-medium text-foreground truncate">{chart.health_condition}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nutritional summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-border/60">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{Math.round(totalNutrition.calories)}</p>
            <p className="text-xs text-muted-foreground">Total kcal</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalNutrition.protein.toFixed(1)}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalNutrition.carbs.toFixed(1)}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalNutrition.fat.toFixed(1)}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </CardContent>
        </Card>
      </div>

      {/* Ayurvedic summary */}
      {ayurvedicSummary && (
        <Card className="border-border/60 border-l-4 border-l-primary">
          <CardContent className="py-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Dominant Rasa:</span>
              <Badge>{ayurvedicSummary.dominantRasa}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Virya:</span>
              <span className="inline-flex items-center gap-1 text-xs text-red-600">
                <Flame className="w-3 h-3" /> {ayurvedicSummary.hotCount}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-sky-600">
                <Droplets className="w-3 h-3" /> {ayurvedicSummary.coldCount}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Meals */}
      {(["Breakfast", "Lunch", "Snack", "Dinner"] as MealType[]).map((mealType) => {
        const mealItems = mealGroups[mealType];
        if (!mealItems || mealItems.length === 0) return null;
        const MealIcon = MEAL_ICONS[mealType];
        let mealCals = 0;
        for (const item of mealItems) {
          mealCals += (Number(item.calories_per_100g) * Number(item.quantity_grams)) / 100;
        }

        return (
          <Card key={mealType} className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MealIcon className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">{mealType}</CardTitle>
                <Badge variant="secondary" className="text-xs ml-auto">
                  {Math.round(mealCals)} kcal
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {mealItems.map((item) => {
                  const ratio = Number(item.quantity_grams) / 100;
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.food_name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            {Math.round(Number(item.calories_per_100g) * ratio)} kcal
                          </span>
                          <span className="text-xs text-muted-foreground">
                            P: {(Number(item.protein_per_100g) * ratio).toFixed(1)}g
                          </span>
                          <span className="text-xs text-muted-foreground">
                            C: {(Number(item.carbs_per_100g) * ratio).toFixed(1)}g
                          </span>
                          <span className="text-xs text-muted-foreground">
                            F: {(Number(item.fat_per_100g) * ratio).toFixed(1)}g
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {Number(item.quantity_grams)}g
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {chart.notes && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{chart.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Hidden print content */}
      <div className="hidden">
        <div ref={printRef}>
          <div className="header">
            <div className="logo">A</div>
            <div>
              <div className="brand">AharaSetu</div>
              <div className="brand-sub">Ayurvedic Diet Management System</div>
            </div>
          </div>
          <div className="title">{chart.title}</div>
          <div className="date">Created: {new Date(chart.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
          <div className="patient-info">
            <p><strong>Patient:</strong> {chart.patient_name}</p>
            <p><strong>Age/Gender:</strong> {chart.patient_age}y, {chart.patient_gender}</p>
            <p><strong>Diet Type:</strong> {chart.dietary_habit}</p>
            {chart.health_condition && <p><strong>Condition:</strong> {chart.health_condition}</p>}
          </div>

          <div className="summary">
            <div className="summary-box">
              <div className="value">{Math.round(totalNutrition.calories)}</div>
              <div className="label">Total kcal</div>
            </div>
            <div className="summary-box">
              <div className="value">{totalNutrition.protein.toFixed(1)}g</div>
              <div className="label">Protein</div>
            </div>
            <div className="summary-box">
              <div className="value">{totalNutrition.carbs.toFixed(1)}g</div>
              <div className="label">Carbs</div>
            </div>
            <div className="summary-box">
              <div className="value">{totalNutrition.fat.toFixed(1)}g</div>
              <div className="label">Fat</div>
            </div>
          </div>

          {ayurvedicSummary && (
            <div className="ayurveda-section">
              <h3>Ayurvedic Analysis</h3>
              <div className="ayurveda-row">
                <span>Dominant Rasa:</span>
                <strong>{ayurvedicSummary.dominantRasa}</strong>
              </div>
              <div className="ayurveda-row">
                <span>Virya Balance:</span>
                <span>{ayurvedicSummary.hotCount} Hot / {ayurvedicSummary.coldCount} Cold</span>
              </div>
            </div>
          )}

          {(["Breakfast", "Lunch", "Snack", "Dinner"] as MealType[]).map((mealType) => {
            const mealItems = mealGroups[mealType];
            if (!mealItems || mealItems.length === 0) return null;
            let mealCals = 0;
            return (
              <div key={mealType} className="meal-section">
                <div className="meal-title">{mealType}</div>
                <table>
                  <thead>
                    <tr>
                      <th>Food Item</th>
                      <th>Qty (g)</th>
                      <th>Calories</th>
                      <th>Protein</th>
                      <th>Rasa</th>
                      <th>Virya</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mealItems.map((item) => {
                      const ratio = Number(item.quantity_grams) / 100;
                      const cals = Math.round(Number(item.calories_per_100g) * ratio);
                      mealCals += cals;
                      return (
                        <tr key={item.id}>
                          <td>{item.food_name}</td>
                          <td>{Number(item.quantity_grams)}</td>
                          <td>{cals}</td>
                          <td>{(Number(item.protein_per_100g) * ratio).toFixed(1)}g</td>
                          <td>{item.rasa}</td>
                          <td>{item.virya}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="meal-total">Meal Total: {mealCals} kcal</div>
              </div>
            );
          })}

          {chart.notes && (
            <div className="notes-section">
              <h3>Doctor{"'"}s Notes</h3>
              <p>{chart.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
