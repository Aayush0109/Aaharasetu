"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Search, Apple, Flame, Droplets, X } from "lucide-react";
import type { FoodItem } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const RASA_COLORS: Record<string, string> = {
  Sweet: "bg-green-100 text-green-800",
  Sour: "bg-yellow-100 text-yellow-800",
  Salty: "bg-blue-100 text-blue-800",
  Bitter: "bg-orange-100 text-orange-800",
  Pungent: "bg-red-100 text-red-800",
  Astringent: "bg-purple-100 text-purple-800",
};

const VIRYA_COLORS: Record<string, string> = {
  Hot: "bg-red-50 text-red-700",
  Cold: "bg-sky-50 text-sky-700",
};

const DIGESTIBILITY_COLORS: Record<string, string> = {
  Easy: "bg-green-50 text-green-700",
  Moderate: "bg-amber-50 text-amber-700",
  Heavy: "bg-red-50 text-red-700",
};

export default function FoodDatabasePage() {
  const { data: items = [], isLoading } = useSWR<FoodItem[]>("/api/food-items", fetcher);
  const [search, setSearch] = useState("");
  const [rasaFilter, setRasaFilter] = useState("all");
  const [viryaFilter, setViryaFilter] = useState("all");
  const [digestFilter, setDigestFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<FoodItem | null>(null);

  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category))].sort(),
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (rasaFilter !== "all" && item.rasa !== rasaFilter) return false;
      if (viryaFilter !== "all" && item.virya !== viryaFilter) return false;
      if (digestFilter !== "all" && item.digestibility !== digestFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      return true;
    });
  }, [items, search, rasaFilter, viryaFilter, digestFilter, categoryFilter]);

  const hasFilters = rasaFilter !== "all" || viryaFilter !== "all" || digestFilter !== "all" || categoryFilter !== "all";

  function clearFilters() {
    setRasaFilter("all");
    setViryaFilter("all");
    setDigestFilter("all");
    setCategoryFilter("all");
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Food Database</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Browse Ayurvedic foods with nutritional and traditional properties
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search food items..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={rasaFilter} onValueChange={setRasaFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Rasa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rasa</SelectItem>
              {["Sweet", "Sour", "Salty", "Bitter", "Pungent", "Astringent"].map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={viryaFilter} onValueChange={setViryaFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Virya" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Virya</SelectItem>
              <SelectItem value="Hot">Hot</SelectItem>
              <SelectItem value="Cold">Cold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={digestFilter} onValueChange={setDigestFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Digestibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Heavy">Heavy</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              <X className="w-3 h-3" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} of {items.length} items
      </p>

      {/* Food grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="py-12 text-center">
            <Apple className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No food items match your criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="border-border/60 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelected(item)}
            >
              <CardContent className="py-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  {!item.is_vegetarian && (
                    <Badge variant="outline" className="text-[10px] shrink-0 border-red-200 text-red-600">
                      Non-Veg
                    </Badge>
                  )}
                </div>

                {/* Nutrition row */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{Math.round(Number(item.calories_per_100g))}</p>
                    <p className="text-[10px] text-muted-foreground">kcal</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{Number(item.protein_per_100g).toFixed(1)}g</p>
                    <p className="text-[10px] text-muted-foreground">Protein</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{Number(item.carbs_per_100g).toFixed(1)}g</p>
                    <p className="text-[10px] text-muted-foreground">Carbs</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{Number(item.fat_per_100g).toFixed(1)}g</p>
                    <p className="text-[10px] text-muted-foreground">Fat</p>
                  </div>
                </div>

                {/* Ayurvedic chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${RASA_COLORS[item.rasa] || "bg-muted text-foreground"}`}>
                    {item.rasa}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${VIRYA_COLORS[item.virya] || "bg-muted text-foreground"}`}>
                    {item.virya === "Hot" ? <Flame className="w-2.5 h-2.5" /> : <Droplets className="w-2.5 h-2.5" />}
                    {item.virya}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${DIGESTIBILITY_COLORS[item.digestibility] || "bg-muted text-foreground"}`}>
                    {item.digestibility}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && <FoodDetail item={selected} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FoodDetail({ item }: { item: FoodItem }) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground">{item.description}</p>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Nutrition per 100g
        </p>
        <div className="grid grid-cols-4 gap-3">
          <NutrientBox label="Calories" value={`${Math.round(Number(item.calories_per_100g))}`} unit="kcal" />
          <NutrientBox label="Protein" value={`${Number(item.protein_per_100g).toFixed(1)}`} unit="g" />
          <NutrientBox label="Carbs" value={`${Number(item.carbs_per_100g).toFixed(1)}`} unit="g" />
          <NutrientBox label="Fat" value={`${Number(item.fat_per_100g).toFixed(1)}`} unit="g" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Ayurvedic Properties
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rasa (Taste)</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${RASA_COLORS[item.rasa]}`}>
              {item.rasa}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Virya (Potency)</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${VIRYA_COLORS[item.virya]}`}>
              {item.virya === "Hot" ? <Flame className="w-3 h-3" /> : <Droplets className="w-3 h-3" />}
              {item.virya}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Digestibility</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${DIGESTIBILITY_COLORS[item.digestibility]}`}>
              {item.digestibility}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutrientBox({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-lg bg-secondary/60 p-2.5 text-center">
      <p className="text-base font-bold text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{unit}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
