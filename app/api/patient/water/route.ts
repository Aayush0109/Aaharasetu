import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

/* ===========================
   GET → Fetch today's water
=========================== */

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ total: 0 });
    }

    const result = await sql`
        SELECT COALESCE(SUM(amount_ml), 0) AS total
        FROM water_logs
        WHERE patient_id = ${session.id}
        AND logged_at >= NOW() - INTERVAL '1 day'
        console.log("SESSION:", session);
    `;

    return NextResponse.json({
      total: Number(result[0].total),
    });

  } catch (error) {
    console.error("Water GET error:", error);
    return NextResponse.json({ total: 0 });
  }
}

/* ===========================
   POST → Log water intake
=========================== */

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO water_logs (patient_id, amount)
      VALUES (${session.id}, ${amount})
    `;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Water POST error:", error);
    return NextResponse.json(
      { error: "Failed to log water" },
      { status: 500 }
    );
  }
}
