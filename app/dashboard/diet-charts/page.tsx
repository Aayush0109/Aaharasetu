"use client";

import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilePlus2, ClipboardList, Calendar, ArrowRight } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ChartListItem {
  id: number;
  title: string;
  notes: string | null;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  created_at: string;
}

export default function DietChartsPage() {
  const { data: charts = [], isLoading } = useSWR<ChartListItem[]>("/api/diet-charts", fetcher);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Diet Charts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View and manage Ayurvedic diet plans
          </p>
        </div>
        <Link href="/dashboard/diet-charts/new">
          <Button>
            <FilePlus2 className="w-4 h-4" />
            Create Diet Chart
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : charts.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center py-12">
            <ClipboardList className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No diet charts yet</p>
            <Link href="/dashboard/diet-charts/new">
              <Button size="sm" className="mt-4">
                Create Your First Chart
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {charts.map((chart) => (
            <Link key={chart.id} href={`/dashboard/diet-charts/${chart.id}`}>
              <Card className="group border-border/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{chart.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {chart.patient_name}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {chart.patient_age}y, {chart.patient_gender}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Calendar className="w-3 h-3" />
                    {new Date(chart.created_at).toLocaleDateString()}
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
