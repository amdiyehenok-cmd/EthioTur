import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load local env files before reading DATABASE_URL.
config({ path: [".env.local", ".env"] });

const fallbackUrl = "postgresql://ethiopia:ethiopia_local_dev@127.0.0.1:5433/ethiopia_unfolded";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? fallbackUrl,
  },
});
