import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const charts = await sql`
    SELECT dc.*, p.full_name as patient_name, p.age as patient_age, p.gender as patient_gender,
           p.height_cm, p.weight_kg, p.dietary_habit, p.health_condition
    FROM diet_charts dc
    JOIN patients p ON p.id = dc.patient_id
    WHERE dc.id = ${id} AND dc.doctor_id = ${session.id}`;

  if (charts.length === 0) return NextResponse.json({ error: "Chart not found" }, { status: 404 });

  const items = await sql`
    SELECT dci.*, fi.name as food_name, fi.category, fi.calories_per_100g, fi.protein_per_100g,
           fi.carbs_per_100g, fi.fat_per_100g, fi.rasa, fi.virya, fi.digestibility, fi.is_vegetarian
    FROM diet_chart_items dci
    JOIN food_items fi ON fi.id = dci.food_item_id
    WHERE dci.diet_chart_id = ${id}
    ORDER BY
      CASE dci.meal_type
        WHEN 'Breakfast' THEN 1
        WHEN 'Lunch' THEN 2
        WHEN 'Snack' THEN 3
        WHEN 'Dinner' THEN 4
      END`;

  return NextResponse.json({ ...charts[0], items });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM diet_charts WHERE id = ${id} AND doctor_id = ${session.id}`;
  return NextResponse.json({ success: true });
}
