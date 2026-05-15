import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [doctor] = await sql`
      SELECT id, name, email, specialization, doctor_code, created_at
      FROM doctors
      WHERE id = ${session.id}
    `;

    return NextResponse.json({ doctor });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
