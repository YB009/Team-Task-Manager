import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { BugSense, registerNodeHandlers } from "@bugsense/bugsense-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const endpoint = process.env.BUGSENSE_ENDPOINT;
const projectId = process.env.BUGSENSE_PROJECT_ID;
const apiKey = process.env.BUGSENSE_API_KEY;

const isConfigured = Boolean(endpoint && projectId && apiKey);

export const bugsense = isConfigured
  ? new BugSense({
      endpoint,
      projectId,
      apiKey,
      environment: process.env.NODE_ENV || "development",
      release: process.env.BUGSENSE_RELEASE || "workvite-server@dev",
      maxBatchSize: Number(process.env.BUGSENSE_MAX_BATCH_SIZE || 10),
      flushIntervalMs: Number(process.env.BUGSENSE_FLUSH_INTERVAL_MS || 5000),
    })
  : null;

if (bugsense) {
  registerNodeHandlers(bugsense);
} else if (process.env.NODE_ENV !== "production") {
  console.warn(
    "[BugSense] Missing BUGSENSE_ENDPOINT, BUGSENSE_PROJECT_ID, or BUGSENSE_API_KEY. Server SDK not started."
  );
}
