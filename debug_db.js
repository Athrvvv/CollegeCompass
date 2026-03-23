const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

async function debug() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "MISSING");
  if (!process.env.DATABASE_URL) return;
  
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log("Testing SQL execution...");
    const result = await sql`SELECT NOW()`;
    console.log("SQL Success:", result[0]);
    
    console.log("Checking tables...");
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tables:", tables.map(t => t.table_name).join(", "));
  } catch (e) {
    console.error("DEBUG ERROR:", e);
  }
}

debug();
