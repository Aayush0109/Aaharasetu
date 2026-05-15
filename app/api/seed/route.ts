import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const existingDoctor = await sql`SELECT id FROM doctors WHERE email = 'nutrition@aharasetu.in'`;
    if (existingDoctor.length > 0) {
      return NextResponse.json({ message: "Demo doctor already exists" });
    }

    const hash = await bcrypt.hash("NutritionAyur@2024!", 10);
    await sql`INSERT INTO doctors (name, email, password_hash, specialization) VALUES (${'Dr. Aayush Verma'}, ${'nutrition@aharasetu.in'}, ${hash}, ${'Ayurvedic Nutrition Specialist'})`;

    const doctor = await sql`SELECT id FROM doctors WHERE email = ${'nutrition@aharasetu.in'}`;
    const doctorId = doctor[0].id;

    // Insert patients one by one with all values as placeholders
    await sql`INSERT INTO patients (doctor_id, full_name, age, gender, height_cm, weight_kg, dietary_habit, bowel_movement, water_intake, health_condition) VALUES (${doctorId}, ${'Priya Mehta'}, ${34}, ${'Female'}, ${162}, ${58}, ${'Vegetarian'}, ${'Normal'}, ${'Medium'}, ${'Mild gastritis, occasional acidity'})`;
    await sql`INSERT INTO patients (doctor_id, full_name, age, gender, height_cm, weight_kg, dietary_habit, bowel_movement, water_intake, health_condition) VALUES (${doctorId}, ${'Rajesh Kumar'}, ${45}, ${'Male'}, ${175}, ${82}, ${'Non-Vegetarian'}, ${'Constipation'}, ${'Low'}, ${'Type 2 Diabetes, high cholesterol'})`;
    await sql`INSERT INTO patients (doctor_id, full_name, age, gender, height_cm, weight_kg, dietary_habit, bowel_movement, water_intake, health_condition) VALUES (${doctorId}, ${'Ananya Iyer'}, ${28}, ${'Female'}, ${158}, ${52}, ${'Vegetarian'}, ${'Normal'}, ${'High'}, ${'Iron deficiency anemia'})`;

    return NextResponse.json({ message: "Demo data seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
