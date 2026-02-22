// server/prisma/client.js
import pkgClient from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure environment variables are loaded even when this file is imported early.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const { Pool } = pkg;
const { PrismaClient } = pkgClient;
const connectionString = process.env.DATABASE_URL;
const allowInvalidCerts =
  /sslaccept=accept_invalid_certs/i.test(connectionString || "") ||
  process.env.PG_SSL_REJECT_UNAUTHORIZED === "false";

const pool = new Pool({
  connectionString,
  // Supabase pooler certificates can fail strict validation in some serverless runtimes.
  ...(allowInvalidCerts ? { ssl: { rejectUnauthorized: false } } : {}),
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
