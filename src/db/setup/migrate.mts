import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import "dotenv/config";

async function migrateDb() {
  const db = neon(process.env.DATABASE_URL! ?? "");

  const migration = await readFile(
    join(process.cwd(), "src/db/sql/posts.sql"),
    "utf-8"
  );

  await db.query(migration);
  console.info("Database migration complete!")
}

await migrateDb();
