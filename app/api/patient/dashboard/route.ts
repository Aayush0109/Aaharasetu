import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== "patient") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [patient] = await sql`
      SELECT * FROM patients WHERE id = ${session.id}
    `;

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const [doctor] = await sql`
      SELECT name, specialization
      FROM doctors
      WHERE id = ${patient.doctor_id}
    `;

    const [activeChart] = await sql`
      SELECT id, title
      FROM diet_charts
      WHERE patient_id = ${patient.id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    return NextResponse.json({
      doctor,
      activeChart,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
