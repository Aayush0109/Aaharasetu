"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, Leaf, User, ClipboardList } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/* ===========================
   TYPES
=========================== */

interface PatientDashboardResponse {
  doctor?: {
    name: string;
    specialization: string;
  };
  activeChart?: {
    id: number;
    title: string;
  };
}

interface WaterResponse {
  total: number;
}

/* ===========================
   COMPONENT
=========================== */

export default function PatientDashboard() {
  const { data, isLoading } = useSWR<PatientDashboardResponse>(
    "/api/patient/dashboard",
    fetcher
  );

  const { data: waterData, mutate: mutateWater } =
    useSWR<WaterResponse>("/api/patient/water", fetcher);

  const doctor = data?.doctor;
  const activeChart = data?.activeChart;
  const todayTotal = waterData?.total || 0;

  /* ===========================
     WATER STATE
  =========================== */

  const [unit, setUnit] = useState<"ml" | "l">("ml");
  const [input, setInput] = useState("");

  async function logWater() {
    if (!input) return;

    const amount =
      unit === "l" ? Number(input) * 1000 : Number(input);

    const res = await fetch("/api/patient/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    if (res.ok) {
      setInput("");
      await mutateWater(); // 🔥 instantly refresh water data
    }
  }

  /* ===========================
     UI
  =========================== */

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">
          Welcome to Your Health Space 🌿
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your diet, lifestyle, and daily wellness here.
        </p>
      </div>

      {/* Assigned Doctor */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Your Assigned Doctor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : doctor ? (
            <div>
              <p className="font-semibold">{doctor.name}</p>
              <p className="text-sm text-muted-foreground">
                {doctor.specialization}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No doctor assigned yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Active Diet Plan */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-accent" />
            Current Diet Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : activeChart ? (
            <div>
              <p className="font-semibold">{activeChart.title}</p>
              <Button className="mt-3" size="sm">
                View Full Plan
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No active diet chart assigned yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Lifestyle Section */}
      <div className="grid sm:grid-cols-2 gap-6">

        {/* WATER TRACKER */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary" />
              Water Intake
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Stay hydrated. Aim for 3000 ml daily.
            </p>

            {/* Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setUnit("ml")}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  unit === "ml"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                ML
              </button>

              <button
                onClick={() => setUnit("l")}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  unit === "l"
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                L
              </button>
            </div>

            {/* Input + Add */}
            <div className="flex gap-2">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Enter in ${unit}`}
                className="border rounded-md px-3 py-2 w-full text-sm"
              />
              <Button size="sm" onClick={logWater}>
                Add
              </Button>
            </div>

            {/* Progress */}
            <div>
              <p className="text-sm text-muted-foreground">
                Today: {todayTotal} ml
              </p>

              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((todayTotal / 3000) * 100, 100)}%`,
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Goal: 3000 ml
              </p>
            </div>
          </CardContent>
        </Card>

        {/* WELLNESS TIP */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-accent" />
              Daily Wellness Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start your morning with warm water and lemon to boost digestion.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
