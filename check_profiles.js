const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });

async function checkProfiles() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const profiles = await sql`SELECT auth_user_id, first_name FROM user_profiles`;
    console.log("Profiles in DB:", JSON.stringify(profiles, null, 2));
  } catch (e) {
    console.error(e);
  }
}

checkProfiles();
