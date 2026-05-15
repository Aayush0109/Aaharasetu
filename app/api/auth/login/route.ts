import { sql } from "@/lib/db";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password and role are required" },
        { status: 400 }
      );
    }

    // =========================
    // DOCTOR LOGIN
    // =========================
    if (role === "doctor") {
      const doctors = await sql`
        SELECT * FROM doctors WHERE email = ${email}
      `;

      console.log("🔍 Doctor lookup:", { email, found: doctors.length > 0 });

      if (doctors.length === 0) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const doctor = doctors[0];
      console.log("🔍 Doctor data:", { name: doctor.name, email: doctor.email, status: doctor.status });

      const isValid = await bcrypt.compare(password, doctor.password_hash);
      console.log("🔍 Password comparison:", { isValid, passwordLength: password.length, hashLength: doctor.password_hash.length });
      
      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      // 🔐 Pending Check
      if (doctor.status !== "approved") {
        return NextResponse.json(
          { error: "Your registration is under review by admin." },
          { status: 403 }
        );
      }

      const token = await createToken({
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        role: "doctor",
      });

      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json({
        user: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role,
        },
      });
    }

    // =========================
    // PATIENT LOGIN
    // =========================
    if (role === "patient") {
      const patients = await sql`
        SELECT * FROM patients WHERE email = ${email}
      `;

      if (patients.length === 0) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const patient = patients[0];

      const isValid = await bcrypt.compare(password, patient.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = await createToken({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        role: "patient",
      });

      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json({
        user: {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          role: "patient",
        },
      });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
