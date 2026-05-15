import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const doctors = await sql`
      SELECT id, name, email, specialization
      FROM doctors
      WHERE role = 'doctor'
      AND status = 'pending'
    `;

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
