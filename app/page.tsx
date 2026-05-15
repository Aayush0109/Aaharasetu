"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Leaf, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"doctor" | "patient">("doctor");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      console.log("Logged in user:", data.user);
      
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // 🔥 Role-based redirect
      if (data.user.role === "admin") {
          router.push("/admin-dashboard");
      } else if (data.user.role === "doctor") {
        router.push("/dashboard");
      } else if (data.user.role === "patient") {
         router.push("/patient-dashboard");
      } else {
        router.push("/");
      }

    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">

        {/* Logo Section */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">AharaSetu</h1>
          <p className="text-sm text-muted-foreground">
            Ayurvedic Diet & Lifestyle Platform
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6 pb-8 px-6">

            {/* 🔥 Role Tabs */}
            <div className="flex mb-6 rounded-lg overflow-hidden border">
              <button
                onClick={() => setRole("doctor")}
                className={`flex-1 py-2 text-sm font-medium ${
                  role === "doctor"
                    ? "bg-primary text-white"
                    : "bg-background"
                }`}
              >
                Doctor Login
              </button>
              <button
                onClick={() => setRole("patient")}
                className={`flex-1 py-2 text-sm font-medium ${
                  role === "patient"
                    ? "bg-primary text-white"
                    : "bg-background"
                }`}
              >
                Patient Login
              </button>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">

              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder={
                    role === "doctor"
                      ? "doctor@aharasetu.com"
                      : "patient@email.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </Button>

            </form>
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Don’t have an account?{" "}
              </span>
              <button
                type="button"
                onClick={() => router.push(`/register?role=${role}`)}
                className="text-primary font-medium hover:underline"
              >
                Register as {role}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by Aharasetu 🌿
        </p>
      </div>
    </main>
  );
}
