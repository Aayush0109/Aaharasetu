"use client";

import React from "react"

import { useState, use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientForm } from "@/components/patient-form";
import {
  ArrowLeft,
  Edit,
  Ruler,
  Weight,
  Droplets,
  Heart,
  Utensils,
  Activity,
  FilePlus2,
} from "lucide-react";
import type { Patient } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: patient, isLoading, mutate } = useSWR<Patient>(`/api/patients/${id}`, fetcher);
  const [showEdit, setShowEdit] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Patient not found</p>
        <Link href="/dashboard/patients">
          <Button variant="outline" className="mt-4 bg-transparent">
            Back to Patients
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/patients">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{patient.full_name}</h1>
            <p className="text-sm text-muted-foreground">
              {patient.age}y, {patient.gender}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/diet-charts/new?patient=${patient.id}`}>
            <Button size="sm">
              <FilePlus2 className="w-4 h-4" />
              Create Diet Chart
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Body stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <InfoCard icon={Ruler} label="Height" value={patient.height_cm ? `${patient.height_cm} cm` : "N/A"} />
        <InfoCard icon={Weight} label="Weight" value={patient.weight_kg ? `${patient.weight_kg} kg` : "N/A"} />
        <InfoCard icon={Droplets} label="Water Intake" value={patient.water_intake} />
        <InfoCard icon={Activity} label="Bowel" value={patient.bowel_movement} />
      </div>

      {/* Details */}
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Utensils className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Dietary Habit</p>
              <Badge variant="secondary">{patient.dietary_habit}</Badge>
            </div>
          </div>
          {patient.health_condition && (
            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Health Condition</p>
                <p className="text-sm text-foreground">{patient.health_condition}</p>
              </div>
            </div>
          )}
          {patient.height_cm && patient.weight_kg && (
            <div className="flex items-start gap-3">
              <Activity className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className="text-sm text-foreground">
                  {(patient.weight_kg / ((patient.height_cm / 100) ** 2)).toFixed(1)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            patient={patient}
            onSuccess={() => {
              setShowEdit(false);
              mutate();
            }}
            onCancel={() => setShowEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="py-4 flex flex-col items-center gap-1 text-center">
        <Icon className="w-5 h-5 text-primary mb-1" />
        <p className="text-lg font-semibold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
