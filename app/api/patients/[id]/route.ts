import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const patients = await sql`SELECT * FROM patients WHERE id = ${id} AND doctor_id = ${session.id}`;
  if (patients.length === 0) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  return NextResponse.json(patients[0]);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { full_name, age, gender, height_cm, weight_kg, dietary_habit, bowel_movement, water_intake, health_condition } = body;

  const result = await sql`
    UPDATE patients SET
      full_name = ${full_name}, age = ${age}, gender = ${gender},
      height_cm = ${height_cm || null}, weight_kg = ${weight_kg || null},
      dietary_habit = ${dietary_habit || 'Vegetarian'}, bowel_movement = ${bowel_movement || 'Normal'},
      water_intake = ${water_intake || 'Medium'}, health_condition = ${health_condition || null},
      updated_at = NOW()
    WHERE id = ${id} AND doctor_id = ${session.id}
    RETURNING *`;

  if (result.length === 0) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  return NextResponse.json(result[0]);
}
