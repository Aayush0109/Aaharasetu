import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patients = await sql`SELECT * FROM patients WHERE doctor_id = ${session.id} ORDER BY created_at DESC`;
  return NextResponse.json(patients);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { full_name, age, gender, height_cm, weight_kg, dietary_habit, bowel_movement, water_intake, health_condition } = body;

  if (!full_name || !age || !gender) {
    return NextResponse.json({ error: "Name, age, and gender are required" }, { status: 400 });
  }

  const result = await sql`
    INSERT INTO patients (doctor_id, full_name, age, gender, height_cm, weight_kg, dietary_habit, bowel_movement, water_intake, health_condition)
    VALUES (${session.id}, ${full_name}, ${age}, ${gender}, ${height_cm || null}, ${weight_kg || null}, ${dietary_habit || 'Vegetarian'}, ${bowel_movement || 'Normal'}, ${water_intake || 'Medium'}, ${health_condition || null})
    RETURNING *`;

  return NextResponse.json(result[0], { status: 201 });
}
