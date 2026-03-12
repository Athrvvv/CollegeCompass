"use server";

import { neon } from "@neondatabase/serverless";

export async function getColleges() {

  const sql = neon(process.env.DATABASE_URL!);

  const data = await sql`
    SELECT * FROM colleges
  `;

  return data;
}