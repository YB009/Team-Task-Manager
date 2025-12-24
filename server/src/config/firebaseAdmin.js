// server/src/config/firebaseAdmin.js
// ESM-safe Firebase Admin initialisation that works with Node 18+ / 20+ / 24+

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build credentials either from env vars or from the local service account file.
const envHasCreds =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

let credential;

if (envHasCreds) {
  credential = admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });
  console.log("[firebaseAdmin] Loaded credentials from environment variables");
} else {
  // Fall back to the JSON file at /server/firebase-service-account.json
  const serviceAccountPath = path.join(
    __dirname,
    "../../firebase-service-account.json"
  );

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase service account file not found at: ${serviceAccountPath}. ` +
        `Add FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY to the .env ` +
        `or place firebase-service-account.json in /server.`
    );
  }

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );
  credential = admin.credential.cert(serviceAccount);
  console.log("[firebaseAdmin] Loaded credentials from firebase-service-account.json");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential,
  });
  console.log("[firebaseAdmin] Firebase Admin SDK initialised");
}

// ---------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------
// Default export for general use: `import admin from "../config/firebaseAdmin.js";`
export default admin;

// Optional named helpers if you want them:
// import { firebaseAuth } from "../config/firebaseAdmin.js";
export const firebaseAuth = admin.auth();

// If you later enable Firestore you can use this (safe even if not used):
export const firebaseDb = admin.firestore ? admin.firestore() : null;
