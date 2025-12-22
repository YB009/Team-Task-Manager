// server/src/config/firebaseAdmin.js
// ESM-safe Firebase Admin initialisation that works with Node 18+ / 20+ / 24+

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------
// Resolve __dirname in ESM
// ---------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------
// Load service account JSON manually (no `assert { type: "json" }`)
// ---------------------------------------------------------------------
const serviceAccountPath = path.join(
  __dirname,
  "../../firebase-service-account.json" // <- file at /server/firebase-service-account.json
);

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `Firebase service account file not found at: ${serviceAccountPath}`
  );
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

// ---------------------------------------------------------------------
// Initialise Firebase Admin only once
// ---------------------------------------------------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // If you later add Storage / other services and need the bucket:
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });

  console.log(
    "[firebaseAdmin] Firebase Admin SDK initialised with service account"
  );
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
