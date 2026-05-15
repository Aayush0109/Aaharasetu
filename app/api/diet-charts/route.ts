import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const charts = await sql`
    SELECT dc.*, p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender
    FROM diet_charts dc
    JOIN patients p ON p.id = dc.patient_id
    WHERE dc.doctor_id = ${session.id}
    ORDER BY dc.created_at DESC`;

  return NextResponse.json(charts);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { patient_id, title, notes, items } = body;

  if (!patient_id || !title || !items || items.length === 0) {
    return NextResponse.json({ error: "Patient, title, and at least one food item are required" }, { status: 400 });
  }

  const chart = await sql`
    INSERT INTO diet_charts (doctor_id, patient_id, title, notes)
    VALUES (${session.id}, ${patient_id}, ${title}, ${notes || null})
    RETURNING *`;

  const chartId = chart[0].id;

  for (const item of items) {
    await sql`
      INSERT INTO diet_chart_items (diet_chart_id, food_item_id, meal_type, quantity_grams, notes)
      VALUES (${chartId}, ${item.food_item_id}, ${item.meal_type}, ${item.quantity_grams}, ${item.notes || null})`;
  }

  return NextResponse.json(chart[0], { status: 201 });
}
