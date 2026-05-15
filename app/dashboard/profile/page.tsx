"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DoctorProfile() {
  const { data, isLoading } = useSWR("/api/doctor/profile", fetcher);

  const doctor = data?.doctor;

  if (isLoading) return <p className="p-8">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Name:</strong> {doctor?.name}</p>
          <p><strong>Email:</strong> {doctor?.email}</p>
          <p><strong>Specialization:</strong> {doctor?.specialization}</p>
          <p>
            <strong>Doctor Code:</strong>{" "}
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">
              {doctor?.doctor_code}
            </span>
          </p>
          <p>
            <strong>Registered On:</strong>{" "}
            {new Date(doctor?.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
