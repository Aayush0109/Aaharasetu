"use client";

import React from "react"

import useSWR from "swr";
import Link from "next/link";
import {
  Users,
  ClipboardList,
  Apple,
  UserPlus,
  FilePlus2,
  BookOpen,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data, isLoading } = useSWR("/api/dashboard", fetcher);

  const stats = data?.stats;
  const recentCharts = data?.recentCharts || [];
  const recentPatients = data?.recentPatients || [];

  function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          {getGreeting()}, Doctor
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here’s your clinic overview for today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Patients"
          value={stats?.patients}
          icon={Users}
          loading={isLoading}
          color="primary"
        />
        <StatCard
          label="Diet Charts"
          value={stats?.dietCharts}
          icon={ClipboardList}
          loading={isLoading}
          color="accent"
        />
        <StatCard
          label="Food Items"
          value={stats?.foodItems}
          icon={Apple}
          loading={isLoading}
          color="muted"
        />
        <StatCard
          label="Recent Activity"
          value={recentCharts.length}
          icon={Calendar}
          loading={isLoading}
          color="accent"
        />
      </div>

      <Card className="border-border/60 bg-primary/5">
        <CardContent className="py-4 px-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              System Insight
            </p>
            <p className="text-sm font-medium">
              {stats?.patients > 0
                ? "Your practice is active and growing."
                : "Start by adding your first patient."}
            </p>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
            Aharasetu Analytics
          </span>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/patients?new=1">
          <Card className="group cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Add Patient</p>
                <p className="text-xs text-muted-foreground">Register a new patient profile</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/diet-charts/new">
          <Card className="group cursor-pointer border-border/60 hover:border-accent/40 hover:shadow-md transition-all">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <FilePlus2 className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Create Diet Chart</p>
                <p className="text-xs text-muted-foreground">Build a new Ayurvedic diet plan</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/food-database">
          <Card className="group cursor-pointer border-border/60 hover:border-primary/40 hover:shadow-md transition-all">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">Food Database</p>
                <p className="text-xs text-muted-foreground">Browse Ayurvedic food items</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent diet charts */}
        <Card className="border-border/60 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Diet Charts</CardTitle>
              <Link href="/dashboard/diet-charts">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : recentCharts.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No diet charts yet</p>
                <Link href="/dashboard/diet-charts/new">
                  <Button size="sm" className="mt-3">
                    Create First Chart
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentCharts.map((chart: { id: number; title: string; patient_name: string; created_at: string }) => (
                  <Link
                    key={chart.id}
                    href={`/dashboard/diet-charts/${chart.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/60 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{chart.title}</p>
                      <p className="text-xs text-muted-foreground">{chart.patient_name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Calendar className="w-3 h-3" />
                      {new Date(chart.created_at).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent patients */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Patients</CardTitle>
              <Link href="/dashboard/patients">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : recentPatients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No patients yet</p>
                <Link href="/dashboard/patients?new=1">
                  <Button size="sm" className="mt-3">
                    Add First Patient
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentPatients.map((patient: { id: number; full_name: string; age: number; gender: string; health_condition: string }) => (
                  <Link
                    key={patient.id}
                    href={`/dashboard/patients/${patient.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/60 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {patient.full_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{patient.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age}y, {patient.gender}
                        {patient.health_condition && ` - ${patient.health_condition}`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  color,
}: {
  label: string;
  value: number | undefined;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
  color: "primary" | "accent" | "muted";
}) {
  const colorMap = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    accent: { bg: "bg-accent/10", text: "text-accent" },
    muted: { bg: "bg-primary/5", text: "text-primary" },
  };
  const c = colorMap[color];

  return (
    <Card className="border-border/60">
      <CardContent className="flex items-center gap-4 py-5">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${c.text}`} />
        </div>
        <div>
          {loading ? (
            <div className="h-8 w-16 rounded bg-muted animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-foreground">{value ?? 0}</p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
