"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { Patient } from "@/lib/types";

interface PatientFormProps {
  patient?: Patient;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function PatientForm({ patient, onSuccess, onCancel }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: patient?.full_name || "",
    age: patient?.age?.toString() || "",
    gender: patient?.gender || "",
    height_cm: patient?.height_cm?.toString() || "",
    weight_kg: patient?.weight_kg?.toString() || "",
    dietary_habit: patient?.dietary_habit || "Vegetarian",
    bowel_movement: patient?.bowel_movement || "Normal",
    water_intake: patient?.water_intake || "Medium",
    health_condition: patient?.health_condition || "",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = patient ? `/api/patients/${patient.id}` : "/api/patients";
    const method = patient ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          height_cm: form.height_cm ? Number(form.height_cm) : null,
          weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to save patient");
        setLoading(false);
        return;
      }

      toast.success(patient ? "Patient updated" : "Patient added");
      onSuccess();
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        {/* Personal information */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-col gap-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="Patient's full name"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                placeholder="Age in years"
                required
                min={1}
                max={120}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Gender *</Label>
              <Select value={form.gender} onValueChange={(v) => updateField("gender", v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="height_cm">Height (cm)</Label>
              <Input
                id="height_cm"
                type="number"
                value={form.height_cm}
                onChange={(e) => updateField("height_cm", e.target.value)}
                placeholder="e.g. 170"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                value={form.weight_kg}
                onChange={(e) => updateField("weight_kg", e.target.value)}
                placeholder="e.g. 65"
              />
            </div>
          </CardContent>
        </Card>

        {/* Health & Lifestyle */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Health & Lifestyle</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Dietary Habit</Label>
              <Select value={form.dietary_habit} onValueChange={(v) => updateField("dietary_habit", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Bowel Movement</Label>
              <Select value={form.bowel_movement} onValueChange={(v) => updateField("bowel_movement", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Constipation">Constipation</SelectItem>
                  <SelectItem value="Loose">Loose</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Daily Water Intake</Label>
              <Select value={form.water_intake} onValueChange={(v) => updateField("water_intake", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-3 flex flex-col gap-2">
              <Label htmlFor="health_condition">Primary Health Condition</Label>
              <Textarea
                id="health_condition"
                value={form.health_condition}
                onChange={(e) => updateField("health_condition", e.target.value)}
                placeholder="e.g. Type 2 Diabetes, mild gastritis..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {patient ? "Update Patient" : "Add Patient"}
          </Button>
        </div>
      </div>
    </form>
  );
}
