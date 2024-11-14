import dotenv from "dotenv";
dotenv.config();
dotenv.config({
  path: ".env.local",
});
import { defineConfig } from "drizzle-kit";
console.log(process.env.POSTGRES_URL);
export default defineConfig({
  out: "./drizzle",
  schema: "./features/database/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
