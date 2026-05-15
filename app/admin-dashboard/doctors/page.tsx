"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
}

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    const res = await fetch("/api/admin/pending-doctors");
    const data = await res.json();
    setDoctors(data.doctors || []);
  }

  async function approveDoctor(id: number) {
    await fetch("/api/admin/approve-doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchDoctors();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Pending Doctor Approvals
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {doctors.map((doc) => (
          <Card key={doc.id} className="shadow-md">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{doc.name}</p>
                <p className="text-sm text-muted-foreground">
                  {doc.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {doc.specialization}
                </p>
              </div>

              <Button onClick={() => approveDoctor(doc.id)}>
                Approve
              </Button>
            </CardContent>
          </Card>
        ))}

        {doctors.length === 0 && (
          <p className="text-muted-foreground">
            No pending doctors.
          </p>
        )}
      </div>
    </div>
  );
}
