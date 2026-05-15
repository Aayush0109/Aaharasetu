"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PatientForm } from "@/components/patient-form";
import { Search, UserPlus, Users, ArrowRight } from "lucide-react";
import type { Patient } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function PatientsPageInner() {
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get("new") === "1");
  const [search, setSearch] = useState("");
  const { data: patients = [], mutate, isLoading } = useSWR<Patient[]>("/api/patients", fetcher);

  const filtered = patients.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your patient profiles
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus className="w-4 h-4" />
          Add Patient
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Patient list */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center py-12">
            <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {search ? "No patients match your search" : "No patients yet"}
            </p>
            {!search && (
              <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                Add Your First Patient
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((patient) => (
            <Link key={patient.id} href={`/dashboard/patients/${patient.id}`}>
              <Card className="group border-border/60 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="py-5 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-base font-semibold text-primary">
                        {patient.full_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {patient.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age}y, {patient.gender}
                        {patient.height_cm ? ` | ${patient.height_cm}cm` : ""}
                        {patient.weight_kg ? ` | ${patient.weight_kg}kg` : ""}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {patient.dietary_habit}
                    </Badge>
                    {patient.health_condition && (
                      <Badge variant="outline" className="text-xs truncate max-w-[200px]">
                        {patient.health_condition}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Add patient dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <PatientForm
            onSuccess={() => {
              setShowForm(false);
              mutate();
            }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={null}>
      <PatientsPageInner />
    </Suspense>
  );
}
