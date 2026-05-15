import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

function generateDoctorCode() {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `AHAR-${random}`;
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, specialization } =
      await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 DOCTOR REGISTRATION
    if (role === "doctor") {
      const existing = await sql`
        SELECT id FROM doctors WHERE email = ${email}
      `;

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "Doctor email already registered" },
          { status: 400 }
        );
      }

      const doctorCode = generateDoctorCode();

      await sql`
        INSERT INTO doctors 
        (name, email, password_hash, specialization, role, status, doctor_code)
        VALUES (
          ${name},
          ${email},
          ${hashedPassword},
          ${specialization || "General"},
          'doctor',
          'pending',
          ${doctorCode}
        )
      `;

      return NextResponse.json({
        message: "Doctor registered. Awaiting admin approval.",
      });
    }

    // 🔹 PATIENT REGISTRATION
    if (role === "patient") {
      const existing = await sql`
        SELECT id FROM patients WHERE email = ${email}
      `;

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "Patient email already registered" },
          { status: 400 }
        );
      }

      await sql`
        INSERT INTO patients 
        (full_name, email, password_hash, role)
        VALUES (
          ${name},
          ${email},
          ${hashedPassword},
          'patient'
        )
      `;

      return NextResponse.json({
        message: "Patient registered successfully.",
      });
    }

    return NextResponse.json(
      { error: "Invalid role" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}