import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const rasa = searchParams.get("rasa") || "";
  const virya = searchParams.get("virya") || "";
  const digestibility = searchParams.get("digestibility") || "";
  const category = searchParams.get("category") || "";

  let items;
  if (search || rasa || virya || digestibility || category) {
    items = await sql`
      SELECT * FROM food_items
      WHERE
        (${search} = '' OR LOWER(name) LIKE ${'%' + search.toLowerCase() + '%'})
        AND (${rasa} = '' OR rasa = ${rasa})
        AND (${virya} = '' OR virya = ${virya})
        AND (${digestibility} = '' OR digestibility = ${digestibility})
        AND (${category} = '' OR category = ${category})
      ORDER BY name`;
  } else {
    items = await sql`SELECT * FROM food_items ORDER BY name`;
  }

  return NextResponse.json(items);
}
