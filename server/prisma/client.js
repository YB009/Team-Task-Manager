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
const localPgHost = process.env.PG_HOST;
const localPgPort = process.env.PG_PORT || "5432";
const localPgUser = process.env.PG_USER;
const localPgPassword = process.env.PG_PASSWORD;
const localPgDatabase = process.env.PG_DATABASE;
const isLocalPgHost =
  /^(localhost|127\.0\.0\.1)$/i.test(localPgHost || "");
const localConnectionString =
  isLocalPgHost && localPgUser && localPgDatabase
    ? `postgresql://${encodeURIComponent(localPgUser)}:${encodeURIComponent(localPgPassword || "")}@${localPgHost}:${localPgPort}/${encodeURIComponent(localPgDatabase)}`
    : null;
const pooledConnectionString = process.env.DATABASE_URL;
const directConnectionString = process.env.DIRECT_URL;
const isSupabasePooler =
  /pgbouncer=true/i.test(pooledConnectionString || "") ||
  /:6543(?:\/|$)/i.test(pooledConnectionString || "");
const shouldPreferLocalConnection =
  process.env.NODE_ENV !== "production" &&
  Boolean(localConnectionString);
const shouldPreferDirectConnection =
  !shouldPreferLocalConnection &&
  process.env.NODE_ENV !== "production" &&
  Boolean(directConnectionString) &&
  isSupabasePooler;
const rawConnectionString = shouldPreferDirectConnection
  ? directConnectionString
  : shouldPreferLocalConnection
    ? localConnectionString
    : pooledConnectionString;
const allowInvalidCerts =
  /sslaccept=accept_invalid_certs/i.test(rawConnectionString || "") ||
  process.env.PG_SSL_REJECT_UNAUTHORIZED === "false";

let connectionString = rawConnectionString;
if (allowInvalidCerts && rawConnectionString) {
  try {
    const url = new URL(rawConnectionString);
    // node-postgres can let URL SSL params override the explicit `ssl` config object.
    // Strip SSL query params and set SSL behavior explicitly below.
    [
      "sslmode",
      "sslaccept",
      "sslcert",
      "sslkey",
      "sslrootcert",
      "sslcrl",
    ].forEach((key) => url.searchParams.delete(key));
    connectionString = url.toString();
  } catch {
    connectionString = rawConnectionString;
  }
}

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  // Supabase pooler certificates can fail strict validation in some serverless runtimes.
  ...(allowInvalidCerts ? { ssl: { rejectUnauthorized: false } } : {}),
});

pool.on("error", (error) => {
  console.error("[prisma-pg] pool error:", error?.message || error);
});

if (shouldPreferLocalConnection) {
  console.log("[prisma] Using local Postgres for development");
} else if (shouldPreferDirectConnection) {
  console.log("[prisma] Using DIRECT_URL for local runtime stability");
}

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export default prisma;
