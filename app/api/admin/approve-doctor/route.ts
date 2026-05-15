import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

function generateDoctorCode() {
  return "AS-DR-" + Math.floor(1000 + Math.random() * 9000);
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const code = generateDoctorCode();

    await sql`
      UPDATE doctors
      SET status = 'approved',
          doctor_code = ${code}
      WHERE id = ${id}
    `;

    return NextResponse.json({
      message: "Doctor approved",
      doctor_code: code,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Approval failed" },
      { status: 500 }
    );
  }
}
