"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole =
    searchParams.get("role") === "patient" ? "patient" : "doctor";

  const [role, setRole] = useState<"doctor" | "patient">(defaultRole);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    registrationNumber: "",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully");

      if (role === "doctor") {
        router.push("/dashboard");
      } else {
        router.push("/patient-dashboard");
      }
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent className="pt-6 pb-8 px-6">

            {/* Role Tabs */}
            <div className="flex mb-6 rounded-lg overflow-hidden border">
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex-1 py-2 text-sm font-medium ${
                  role === "doctor"
                    ? "bg-primary text-white"
                    : "bg-background"
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 py-2 text-sm font-medium ${
                  role === "patient"
                    ? "bg-primary text-white"
                    : "bg-background"
                }`}
              >
                Patient
              </button>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">

              <div>
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              {role === "doctor" && (
                <>
                  <div>
                    <Label>Specialization</Label>
                    <Input
                      value={form.specialization}
                      onChange={(e) =>
                        setForm({ ...form, specialization: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Experience (years)</Label>
                    <Input
                      value={form.experience}
                      onChange={(e) =>
                        setForm({ ...form, experience: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Registration Number</Label>
                    <Input
                      value={form.registrationNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          registrationNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-primary hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}