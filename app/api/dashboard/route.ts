import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [patientCount] = await sql`SELECT COUNT(*) as count FROM patients WHERE doctor_id = ${session.id}`;
  const [chartCount] = await sql`SELECT COUNT(*) as count FROM diet_charts WHERE doctor_id = ${session.id}`;
  const [foodCount] = await sql`SELECT COUNT(*) as count FROM food_items`;

  const recentCharts = await sql`
    SELECT dc.id, dc.title, dc.created_at, p.full_name as patient_name
    FROM diet_charts dc
    JOIN patients p ON p.id = dc.patient_id
    WHERE dc.doctor_id = ${session.id}
    ORDER BY dc.created_at DESC
    LIMIT 5`;

  const recentPatients = await sql`
    SELECT id, full_name, age, gender, health_condition, created_at
    FROM patients
    WHERE doctor_id = ${session.id}
    ORDER BY created_at DESC
    LIMIT 5`;

  return NextResponse.json({
    stats: {
      patients: Number(patientCount.count),
      dietCharts: Number(chartCount.count),
      foodItems: Number(foodCount.count),
    },
    recentCharts,
    recentPatients,
  });
}
